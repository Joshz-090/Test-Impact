import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { collection, doc, getDoc, getDocs, limit, query, where } from "firebase/firestore";
import { auth, db } from "../firebase";
import { AuthContext } from "./AuthContextBase";

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user?.email) {
        try {
          console.log("Checking admin role for:", user.email);
          // Prefer lookup by UID (secure and exact)
          const byUid = await getDoc(doc(db, "admins", user.uid));
          if (byUid.exists()) {
            const data = byUid.data();
            console.log("Admin role found by UID:", data.role);
            setRole(data.role === "super" ? "super" : "normal");
          } else {
            // Backwards compatibility: fallback to email-based lookup
            const adminsRef = collection(db, "admins");
            const q = query(
              adminsRef,
              where("email", "==", user.email.toLowerCase()),
              limit(1)
            );
            const snap = await getDocs(q);
            if (!snap.empty) {
              const first = snap.docs[0];
              const data = first.data();
              console.log("Admin role found by email:", data.role);
              setRole(data.role === "super" ? "super" : "normal");
            } else {
              console.log("No admin record found for:", user.email);
              setRole(null);
            }
          }
        } catch (e) {
          console.error("Failed fetching admin role for", user.email, e);
          setRole(null);
        }
      } else {
        setRole(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const value = useMemo(() => ({ currentUser, role, loading }), [currentUser, role, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

