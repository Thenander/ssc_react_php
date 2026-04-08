import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const linkClass = (path: string) =>
    `hover:text-white transition-colors ${
      location.pathname === path ? "text-white font-semibold" : "text-gray-300"
    }`;

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex items-center gap-8">
      <Link to="/" className="text-xl font-bold tracking-wide text-white">
        Samples, scratches and cuts
      </Link>
      <div className="flex gap-6 text-sm">
        <Link to="/" className={linkClass("/")}>
          Releases
        </Link>
        <Link to="/sources" className={linkClass("/sources")}>
          Sources
        </Link>
      </div>
      <div className="ml-auto">
        <Link
          to="/admin"
          className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
        >
          Admin
        </Link>
      </div>
    </nav>
  );
}
