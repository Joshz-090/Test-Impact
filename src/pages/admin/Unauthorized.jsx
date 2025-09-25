export default function Unauthorized() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-2">Unauthorized</h1>
        <p className="text-gray-600">Your account doesn’t have admin access.</p>
      </div>
    </div>
  )
}


