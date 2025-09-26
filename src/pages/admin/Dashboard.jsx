import { useEffect, useMemo, useState } from "react";
import {
  collection,
  getCountFromServer,
  onSnapshot,
  orderBy,
  query,
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
} from "recharts";
import { useMetrics } from "../../context/MetricsContext";
import AccessTest from "../../components/admin/AccessTest";
import EventPromotionForm from "../../components/admin/EventPromotionForm";
import DepartmentForm from "../../components/admin/DepartmentForm";

const COLORS = ["#0ea5e9", "#94a3b8"];

export default function Dashboard() {
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [growthData, setGrowthData] = useState([]);
  const { visitors: visitorCount } = useMetrics();

  useEffect(() => {
    // Analytics page view
    if (analytics) {
      logEvent(analytics, "admin_dashboard_view");
    }
  }, []);

  useEffect(() => {
    async function fetchCounts() {
      try {
        const coll = collection(db, "subscribers");
        const snapshot = await getCountFromServer(coll);
        setSubscriberCount(snapshot.data().count || 0);
      } catch (error) {
        console.error("Failed to fetch subscriber count:", error);
        setSubscriberCount(0);
      }
    }
    fetchCounts();
  }, []);

  useEffect(() => {
    const coll = collection(db, "subscribers");
    const q = query(coll, orderBy("subscribedAt", "asc")); // Changed from dateSubscribed to subscribedAt
    const unsub = onSnapshot(
      q,
      (snap) => {
        const byDay = new Map();
        snap.forEach((doc) => {
          const d = doc.data();
          const date = d.subscribedAt?.toDate?.() || new Date();
          const key = date.toISOString().slice(0, 10);
          byDay.set(key, (byDay.get(key) || 0) + 1);
        });
        const sorted = Array.from(byDay.entries())
          .sort((a, b) => a[0].localeCompare(b[0]))
          .map(([date, count], idx, arr) => ({
            date,
            count,
            total: count + (idx > 0 ? arr[idx - 1].total : 0),
          }));
        setGrowthData(sorted);
      },
      (error) => {
        console.error("Failed to fetch subscriber growth data:", error);
        setGrowthData([]);
      }
    );
    return () => unsub();
  }, []);

  // Simple derived subscribed vs not-subscribed ratio.
  const pieData = useMemo(() => {
    const subscribed = subscriberCount;
    const totalVisitors = Math.max(subscribed, visitorCount ?? subscribed);
    const notSubscribed = Math.max(totalVisitors - subscribed, 0);
    return [
      { name: "Subscribed", value: subscribed },
      { name: "Not Subscribed", value: notSubscribed },
    ];
  }, [subscriberCount, visitorCount]);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <AccessTest />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Subscribers" value={subscriberCount} />
        <StatCard label="Visitors" value={visitorCount ?? "-"} />
        <StatCard label="Admins" value={"-"} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="font-medium mb-2">Subscribed vs Not Subscribed</div>
          <div className="w-full h-72">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="font-medium mb-2">Subscriber Growth</div>
          <div className="w-full h-72">
            <ResponsiveContainer>
              <LineChart
                data={growthData}
                margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#0ea5e9"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Event / Promotion Management Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Event & Promotion Management
          </h2>
          <div className="text-sm text-gray-500">
            Create and manage events, promotions, and announcements
          </div>
        </div>

        <EventPromotionForm />
      </div>

      {/* Department & Team Management Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-black">
            Department & Team Management
          </h2>
          <div className="text-sm text-gray-500">
            Create and manage departments with team members
          </div>
        </div>

        <DepartmentForm />
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );
}
