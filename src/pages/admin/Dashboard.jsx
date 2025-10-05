import { useEffect, useMemo, useState } from "react";
import {
  collection,
  getCountFromServer,
  onSnapshot,
  orderBy,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { db, analytics } from "../../firebase";
import { logEvent } from "firebase/analytics";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import { useMetrics } from "../../context/MetricsContext";
import AccessTest from "../../components/admin/AccessTest";

const COLORS = ["#0ea5e9", "#94a3b8", "#10b981", "#f59e0b", "#ef4444"];
const SUBSCRIPTION_COLORS = ["#10b981", "#94a3b8"];

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-900">{`Date: ${label}`}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-72">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

export default function Dashboard() {
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [growthData, setGrowthData] = useState([]);
  const [recentSubscribers, setRecentSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("30d"); // 7d, 30d, 90d, all
  const { visitors: visitorCount, projects: projectCount } = useMetrics();

  useEffect(() => {
    // Analytics page view
    if (analytics) {
      logEvent(analytics, "admin_dashboard_view");
    }
  }, []);

  useEffect(() => {
    async function fetchInitialData() {
      setStatsLoading(true);
      try {
        // Fetch subscriber count
        const coll = collection(db, "subscribers");
        const snapshot = await getCountFromServer(coll);
        setSubscriberCount(snapshot.data().count || 0);

        // Fetch recent subscribers (last 10)
        const recentQuery = query(
          coll,
          orderBy("subscribedAt", "desc"),
          where("subscribedAt", ">", Timestamp.fromDate(getDateFromRange("7d")))
        );

        const unsubscribeRecent = onSnapshot(recentQuery, (snap) => {
          const recent = snap.docs.slice(0, 10).map((doc) => ({
            id: doc.id,
            email: doc.data().email,
            date: doc.data().subscribedAt?.toDate() || new Date(),
          }));
          setRecentSubscribers(recent);
        });

        return () => unsubscribeRecent();
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
        setSubscriberCount(0);
        setRecentSubscribers([]);
      } finally {
        setStatsLoading(false);
        setLoading(false);
      }
    }

    fetchInitialData();
  }, []);

  useEffect(() => {
    const coll = collection(db, "subscribers");
    const startDate = getDateFromRange(timeRange);

    const q = query(
      coll,
      orderBy("subscribedAt", "asc"),
      where("subscribedAt", ">", Timestamp.fromDate(startDate))
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        const byDay = new Map();
        let cumulativeTotal = 0;

        snap.forEach((doc) => {
          const d = doc.data();
          const date = d.subscribedAt?.toDate() || new Date();
          const key = date.toISOString().slice(0, 10);
          byDay.set(key, (byDay.get(key) || 0) + 1);
        });

        // Fill in missing dates and calculate cumulative totals
        const filledData = fillMissingDates(byDay, startDate);
        const sorted = filledData.map(({ date, count }) => {
          cumulativeTotal += count;
          return {
            date: formatDateForDisplay(date),
            shortDate: formatShortDate(date),
            dailyCount: count,
            cumulativeTotal: cumulativeTotal,
          };
        });

        setGrowthData(sorted);
      },
      (error) => {
        console.error("Failed to fetch subscriber growth data:", error);
        setGrowthData([]);
      }
    );

    return () => unsub();
  }, [timeRange]);

  // Helper function to get date based on time range
  function getDateFromRange(range) {
    const now = new Date();
    switch (range) {
      case "7d":
        return new Date(now.setDate(now.getDate() - 7));
      case "30d":
        return new Date(now.setDate(now.getDate() - 30));
      case "90d":
        return new Date(now.setDate(now.getDate() - 90));
      case "all":
        return new Date(0); // Beginning of time
      default:
        return new Date(now.setDate(now.getDate() - 30));
    }
  }

  // Helper function to fill missing dates
  function fillMissingDates(dataMap, startDate) {
    const result = [];
    const current = new Date(startDate);
    const today = new Date();

    while (current <= today) {
      const key = current.toISOString().slice(0, 10);
      result.push({
        date: key,
        count: dataMap.get(key) || 0,
      });
      current.setDate(current.getDate() + 1);
    }

    return result;
  }

  // Format date for display
  function formatDateForDisplay(dateString) {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }

  // Format date for short display
  function formatShortDate(dateString) {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }

  // Subscription data for pie chart
  const subscriptionData = useMemo(() => {
    const subscribed = subscriberCount;
    const totalVisitors = Math.max(subscribed, visitorCount ?? 0);
    const notSubscribed = Math.max(totalVisitors - subscribed, 0);

    return [
      { name: "Subscribed", value: subscribed, count: subscribed },
      { name: "Not Subscribed", value: notSubscribed, count: notSubscribed },
    ];
  }, [subscriberCount, visitorCount]);

  // Calculate growth metrics
  const growthMetrics = useMemo(() => {
    if (growthData.length < 2) return { weeklyGrowth: 0, monthlyGrowth: 0 };

    const recent = growthData.slice(-7);
    const previous = growthData.slice(-14, -7);

    const recentGrowth = recent.reduce((sum, day) => sum + day.dailyCount, 0);
    const previousGrowth = previous.reduce(
      (sum, day) => sum + day.dailyCount,
      0
    );

    const weeklyGrowth =
      previousGrowth > 0
        ? ((recentGrowth - previousGrowth) / previousGrowth) * 100
        : recentGrowth > 0
        ? 100
        : 0;

    return {
      weeklyGrowth: Math.round(weeklyGrowth),
      totalGrowth:
        growthData.length > 0
          ? growthData[growthData.length - 1].cumulativeTotal
          : 0,
    };
  }, [growthData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            📊 Admin Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Overview of your platform's performance and metrics
          </p>
        </div>

        <AccessTest />

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            label="Total Subscribers"
            value={subscriberCount}
            trend={growthMetrics.weeklyGrowth}
            icon="📧"
            loading={statsLoading}
          />
          <StatCard
            label="Total Visitors"
            value={visitorCount ?? "0"}
            icon="👥"
            loading={statsLoading}
          />
          <StatCard
            label="Projects"
            value={projectCount ?? "0"}
            icon="📂"
            loading={statsLoading}
          />
          <StatCard
            label="Growth Rate"
            value={`${growthMetrics.weeklyGrowth}%`}
            trend={growthMetrics.weeklyGrowth}
            icon="📈"
            loading={statsLoading}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Subscription Ratio Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Subscription Ratio
              </h3>
              <div className="text-sm text-gray-500">
                Total: {visitorCount ?? subscriberCount}
              </div>
            </div>
            <div className="w-full h-72">
              {statsLoading ? (
                <LoadingSpinner />
              ) : (
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={subscriptionData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, count }) => `${name}: ${count}`}
                    >
                      {subscriptionData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            SUBSCRIPTION_COLORS[
                              index % SUBSCRIPTION_COLORS.length
                            ]
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Growth Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Subscriber Growth
              </h3>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500"
              >
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
                <option value="all">All Time</option>
              </select>
            </div>
            <div className="w-full h-72">
              {statsLoading ? (
                <LoadingSpinner />
              ) : (
                <ResponsiveContainer>
                  <AreaChart
                    data={growthData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="shortDate"
                      tick={{ fontSize: 12 }}
                      interval={
                        growthData.length > 30
                          ? Math.floor(growthData.length / 10)
                          : 0
                      }
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="cumulativeTotal"
                      stroke="#0ea5e9"
                      fill="#0ea5e9"
                      fillOpacity={0.1}
                      strokeWidth={2}
                      name="Total Subscribers"
                    />
                    <Line
                      type="monotone"
                      dataKey="dailyCount"
                      stroke="#ef4444"
                      strokeWidth={2}
                      dot={{ fill: "#ef4444", strokeWidth: 2, r: 3 }}
                      name="Daily New"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Recent Subscribers
          </h3>
          {recentSubscribers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No recent subscribers
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {recentSubscribers.map((subscriber) => (
                <div key={subscriber.id} className="bg-gray-50 rounded-lg p-4">
                  <div
                    className="text-sm font-medium text-gray-900 truncate"
                    title={subscriber.email}
                  >
                    {subscriber.email}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {subscriber.date.toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <a
              href="/admin/events"
              className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <span className="text-2xl mb-2">🎉</span>
              <span className="text-sm font-medium text-blue-900">
                Manage Events
              </span>
            </a>
            <a
              href="/admin/departments"
              className="flex flex-col items-center p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
            >
              <span className="text-2xl mb-2">🏢</span>
              <span className="text-sm font-medium text-indigo-900">
                Departments
              </span>
            </a>
            <a
              href="/admin/members"
              className="flex flex-col items-center p-4 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
            >
              <span className="text-2xl mb-2">👤</span>
              <span className="text-sm font-medium text-emerald-900">
                Add Members
              </span>
            </a>
            <a
              href="/admin/projects"
              className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <span className="text-2xl mb-2">📂</span>
              <span className="text-sm font-medium text-green-900">
                Projects
              </span>
            </a>
            <a
              href="/admin/subscribers"
              className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <span className="text-2xl mb-2">👥</span>
              <span className="text-sm font-medium text-purple-900">
                Subscribers
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// Enhanced StatCard Component
function StatCard({ label, value, trend, icon, loading = false }) {
  const trendColor =
    trend > 0 ? "text-green-600" : trend < 0 ? "text-red-600" : "text-gray-600";
  const trendIcon = trend > 0 ? "↗" : trend < 0 ? "↘" : "→";

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium text-gray-600">{label}</div>
          <div className="text-3xl font-bold text-gray-900 mt-2">
            {loading ? (
              <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
            ) : (
              value
            )}
          </div>
          {trend !== undefined && !loading && (
            <div className={`text-sm font-medium mt-1 ${trendColor}`}>
              {trendIcon} {Math.abs(trend)}%{" "}
              {trend > 0 ? "increase" : trend < 0 ? "decrease" : ""}
            </div>
          )}
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  );
}
