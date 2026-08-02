"use client";

import { useRouter, usePathname } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  LogOut,
} from "lucide-react";

import { useAppSelector } from "@/store/hooks";
import { useSidebar } from "@/features/sidebar/useSidebar";
import { useLogout } from "@/hooks/auth/useAuth";

const menuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/dasboard",
    icon: LayoutDashboard,
  },
  {
    id: "logout",
    label: "Logout",
    href: "/login",
    icon: LogOut,
  },
];

const SideMenu = () => {
  const router = useRouter();
  const pathname = usePathname();
  const isOpen = useAppSelector((state) => state.sidebar.isOpen);
  const { toggle } = useSidebar();
  const logoutMutation = useLogout();

  const handleClick = (href: string, id: string) => {
    if (id === "logout") {
      logoutMutation.mutate();
      return;
    }

    router.push(href);
  };

  const isMenuActive = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      {isOpen && <div className="fixed inset-0 z-40 sm:hidden" />}

      <aside
        className={`
          fixed left-0 top-0 z-50 h-screen w-64
          theme-primary-background
          transition-transform duration-300
          sm:hidden
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <button
          onClick={toggle}
          className="
            absolute top-6 -right-5
            flex h-6 w-6 items-center justify-center
            rounded-full border border-theme-primary-background bg-white
          "
        >
          {isOpen ? (
            <ChevronLeft className="h-4 w-4 text-theme-primary-background" />
          ) : (
            <ChevronRight className="h-4 w-4 text-theme-primary-background" />
          )}
        </button>

        <div className="mt-6 flex flex-col items-center gap-3">
          <span className="theme-text text-2xl font-semibold">
            Book-Manager
          </span>
        </div>

        <nav className="mt-8 flex flex-col gap-3 p-4">
          {menuItems.map((item) => {
            const isActive = isMenuActive(item.href);
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => handleClick(item.href, item.id)}
                className={`
                  flex w-full items-center gap-3 rounded-xl px-4 py-3 cursor-pointer
                  transition-all duration-200 
                  ${
                    isActive
                      ? "scale-105 bg-white text-black shadow-lg"
                      : "bg-white/15 text-white hover:bg-white hover:text-black"
                  }
                `}
              >
                <Icon className="h-5 w-5" />
                <span className="text-lg font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      <aside className="hidden w-20 theme-primary-background sm:block">
        <nav className="flex h-full flex-col items-center justify-center space-y-4 p-4">
          {menuItems.map((item) => {
            const isActive = isMenuActive(item.href);
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => handleClick(item.href, item.id)}
                className={`
                  flex h-10 w-10 items-center justify-center rounded-xl
                  transition-all duration-200 cursor-pointer
                  ${
                    isActive
                      ? "scale-105 bg-white shadow-lg"
                      : "bg-white/15 text-white hover:bg-white hover:text-black"
                  }
                `}
                title={item.label}
              >
                <Icon className="h-5 w-5" />
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default SideMenu;
