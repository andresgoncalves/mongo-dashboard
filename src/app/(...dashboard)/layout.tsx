import {
  Bars3Icon,
  BookOpenIcon,
  BriefcaseIcon,
  BuildingStorefrontIcon,
  ChartBarIcon,
  UserGroupIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const links = [
    {
      href: "/dashboard",
      title: "Dashboard",
      Icon: ChartBarIcon,
    },
    {
      href: "/products",
      title: "Productos",
      Icon: BuildingStorefrontIcon,
    },
    {
      href: "/services",
      title: "Servicios",
      Icon: BookOpenIcon,
    },
    {
      href: "/sales",
      title: "Ventas",
      Icon: BriefcaseIcon,
    },
    {
      href: "/customers",
      title: "Clientes",
      Icon: UserGroupIcon,
    },
  ];

  return (
    <div className="drawer">
      <input id="drawer-toggle" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex">
        {/* Closed sidebar */}
        <div className="menu menu-vertical min-h-screen items-center bg-base-100 shadow-md">
          <div className="tooltip tooltip-right" data-tip="Abrir barra lateral">
            <label
              className="btn btn-ghost mb-8"
              htmlFor="drawer-toggle"
              aria-label="Abrir barra lateral"
            >
              <Bars3Icon className="h-6 w-6" />
            </label>
          </div>
          <ul>
            {links.map(({ href, title, Icon }) => (
              <li key={href}>
                <Link
                  className="tooltip tooltip-right"
                  href={href}
                  data-tip={title}
                  aria-label={title}
                >
                  <Icon className="h-6 w-6" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {/* Main content */}
        <main className="flex max-h-screen flex-1 flex-col overflow-y-auto">
          {children}
        </main>
      </div>
      {/* Open sidebar */}
      <div className="drawer-side">
        <div className="drawer-overlay"></div>
        <div className="menu menu-vertical min-h-screen min-w-[12rem] bg-base-100 shadow-md">
          <div
            className="tooltip tooltip-right self-start"
            data-tip="Cerrar barra lateral"
          >
            <label
              className="btn btn-ghost mb-8"
              htmlFor="drawer-toggle"
              aria-label="Cerrar barra lateral"
            >
              <XMarkIcon className="h-6 w-6" />
            </label>
          </div>
          <ul>
            {links.map(({ href, title, Icon }) => (
              <li key={href}>
                <Link href={href}>
                  <Icon className="h-6 w-6" />
                  <span className="m-auto">{title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
