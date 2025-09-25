import { useEffect, useMemo, useState } from "react";
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";

export default function Subscribers() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [subscribers, setSubscribers] = useState([])

  useEffect(() => {
    const coll = collection(db, "subscribers")
    const q = query(coll, orderBy("subscribedAt", "desc"))
    const unsub = onSnapshot(q, (snap) => {
      const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      setSubscribers(rows)
    }, (error) => {
      console.error("Failed loading subscribers:", error)
      setSubscribers([])
    })
    return () => unsub()
  }, [])

  async function addSubscriber(e) {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    try {
      await addDoc(collection(db, "subscribers"), {
        email: email.trim().toLowerCase(),
        // Keep both fields for backwards compatibility
        subscribedAt: serverTimestamp(),
        dateSubscribed: serverTimestamp(),
      })
      setEmail("")
    } finally {
      setLoading(false)
    }
  }

  async function removeSubscriber(id) {
    await deleteDoc(doc(db, "subscribers", id))
  }

  const allEmails = useMemo(() => subscribers.map(s => s.email).join(", "), [subscribers])

  async function copyAll() {
    await navigator.clipboard.writeText(allEmails)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Subscribers</h1>

      <form onSubmit={addSubscriber} className="flex gap-2">
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Subscriber email" className="flex-1 border rounded px-3 py-2" required />
        <button disabled={loading} className="bg-black text-white rounded px-4">{loading ? "Adding..." : "Add"}</button>
        <button type="button" onClick={copyAll} className="border rounded px-4">Copy all emails</button>
      </form>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-3 text-sm font-medium text-gray-600">Email</th>
              <th className="text-left p-3 text-sm font-medium text-gray-600">Date</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody>
            {subscribers.map((s) => (
              <tr key={s.id} className="border-t">
                <td className="p-3">{s.email}</td>
                <td className="p-3 text-sm text-gray-500">{s.subscribedAt?.toDate?.()?.toLocaleString?.() || s.dateSubscribed?.toDate?.()?.toLocaleString?.() || "-"}</td>
                <td className="p-3 text-right">
                  <button onClick={() => removeSubscriber(s.id)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}


