import { Link, Outlet } from "react-router-dom";
import { db } from "../../mock/db";

export function PublicLayout() {
  return (
    <div className="wf-page min-h-screen flex flex-col bg-[#fafafa]">
      <header className="wf-header shrink-0 border-b border-[#e0e0e0]">
        <div className="flex w-full max-w-5xl mx-auto items-center justify-between gap-4 px-4 py-3">
          <Link to="/" className="wf-header-logo no-underline">
            {db.demoConfig.empresaNombre}
          </Link>
          <nav className="flex flex-wrap items-center gap-3 text-sm">
            <Link className="wf-link-muted no-underline" to="/login/empresa">
              Acceso EMPRESA
            </Link>
          </nav>
        </div>
      </header>
      <main className="min-w-0 flex-1">
        <Outlet />
      </main>
    </div>
  );
}
