import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { analytics, db } from "../firebase";
import { logEvent } from "firebase/analytics";
import { doc, increment, onSnapshot, setDoc, updateDoc } from "firebase/firestore";

const MetricsContext = createContext({ visitors: null });

export function MetricsProvider({ children }) {
  const [visitors, setVisitors] = useState(null);

  // Listen to visitors counter
  useEffect(() => {
    const ref = doc(db, "metrics", "visitors");
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setVisitors(data.count ?? null);
      }
    });
    return () => unsub();
  }, []);

  // Increment visitors once per browser (simple unique approximation)
  useEffect(() => {
    const VISITED_KEY = "__ngo_admin_site_visited__";
    const hasVisited = localStorage.getItem(VISITED_KEY);
    if (!hasVisited) {
      // Fire analytics event
      if (analytics) {
        logEvent(analytics, "site_visit");
      }
      const ref = doc(db, "metrics", "visitors");
      (async () => {
        try {
          // Ensure doc exists
          await setDoc(ref, { count: 0 }, { merge: true });
          await updateDoc(ref, { count: increment(1) });
          localStorage.setItem(VISITED_KEY, "1");
        } catch (e) {
          // ignore failures
          console.warn("Visitor increment failed", e);
        }
      })();
    }
  }, []);

  const value = useMemo(() => ({ visitors }), [visitors]);
  return <MetricsContext.Provider value={value}>{children}</MetricsContext.Provider>;
}

export function useMetrics() {
  return useContext(MetricsContext);
}


