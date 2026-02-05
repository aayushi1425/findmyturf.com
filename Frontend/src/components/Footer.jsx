import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-200">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-sm font-black text-white">
                FM
              </span>
              <span className="text-sm font-semibold">FindMyTurf</span>
            </div>
            <p className="text-xs text-slate-400">
              Discover, compare and book sports turfs with real-time
              availability and owner-managed slots.
            </p>
          </div>

          <div className="space-y-3 text-sm">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Product
            </h4>
            <ul className="space-y-1">
              <li>
                <Link to="/turfs" className="hover:text-white">
                  Explore turfs
                </Link>
              </li>
              <li>
                <Link to="/my-bookings" className="hover:text-white">
                  My bookings
                </Link>
              </li>
              <li>
                <Link to="/owner/turfs" className="hover:text-white">
                  Owner dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3 text-sm">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Company
            </h4>
            <ul className="space-y-1">
              <li>
                <Link to="/about" className="hover:text-white">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/popular-turfs" className="hover:text-white">
                  Popular turfs
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3 text-sm">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Legal
            </h4>
            {/* TODO: Backend support required for static content CMS
                Frontend ready to link to legal pages. */}
            <ul className="space-y-1">
              <li>
                <Link to="/about" className="hover:text-white">
                  Terms &amp; conditions
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white">
                  Privacy policy
                </Link>
              </li>
              <li>
                <Link to="/popular-turfs" className="hover:text-white">
                  Refund policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-6 text-xs text-slate-500 sm:flex-row">
          <p>© {year} FindMyTurf. All rights reserved.</p>
          <p>Play more. Stress less.</p>
        </div>
      </div>
    </footer>
  );
}
