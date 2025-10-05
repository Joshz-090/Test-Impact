import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="text-center max-w-md">
        <p className="text-sm font-semibold text-gray-500">404</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
          Page not found
        </h1>
        <p className="mt-2 text-base leading-7 text-gray-600">
          Sorry, we couldn’t find the page you’re looking for.
        </p>
        <div className="mt-6 flex items-center justify-center gap-x-4">
          <Link
            to="/"
            className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800"
          >
            Go back home
          </Link>
          <Link to="/contact" className="text-sm font-semibold text-gray-900">
            Contact support →
          </Link>
        </div>
      </div>
    </div>
  );
}
