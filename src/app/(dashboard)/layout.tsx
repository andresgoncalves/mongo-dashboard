import Toast from "@/components/Toast";
import { ToastContextProvider } from "@/lib/context/ToastContext";

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
    <ToastContextProvider>
      <div className="drawer">
        <input id="drawer-toggle" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col sm:flex-row">
          {/* Closed sidebar */}
          <div className="menu menu-horizontal min-h-0 items-center bg-base-100 shadow sm:menu-vertical sm:min-h-screen">
            <label
              className="btn btn-ghost sm:mb-8"
              htmlFor="drawer-toggle"
              aria-label="Abrir barra lateral"
            >
              <Bars3Icon className="h-6 w-6" />
            </label>
            <ul className="max-sm:hidden">
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
          <main className="flex flex-1 flex-col sm:max-h-screen sm:overflow-y-auto">
            {children}
          </main>
          <Toast />
        </div>
        {/* Open sidebar */}
        <div className="drawer-side">
          <div className="drawer-overlay"></div>
          <div className="menu menu-vertical min-h-screen min-w-[12rem] bg-base-100 shadow">
            <label
              className="btn btn-ghost mb-8 self-start"
              htmlFor="drawer-toggle"
              aria-label="Cerrar barra lateral"
            >
              <XMarkIcon className="h-6 w-6" />
            </label>
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
    </ToastContextProvider>
  );
}
