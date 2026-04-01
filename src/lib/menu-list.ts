import { Clock, Home, type LucideIcon, Settings, Vault } from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active: boolean;
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: LucideIcon;
  submenus: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/",
          label: "Home",
          active: pathname === "/",
          icon: Home,
          submenus: [],
        },
        {
          href: "/activity",
          label: "Activity",
          active: pathname.startsWith("/activity"),
          icon: Clock,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Vaults",
      menus: [
        {
          href: "/vault/new",
          label: "New Vault",
          active: pathname === "/vault/new",
          icon: Vault,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Account",
      menus: [
        {
          href: "/settings",
          label: "Settings",
          active: pathname.startsWith("/settings"),
          icon: Settings,
          submenus: [],
        },
      ],
    },
  ];
}
