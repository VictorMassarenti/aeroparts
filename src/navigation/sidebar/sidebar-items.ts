import {
  BarChart3,
  Building2,
  CreditCard,
  FileText,
  HandCoins,
  type LucideIcon,
  Package,
  Receipt,
  ShoppingCart,
  Users,
  Warehouse,
} from "lucide-react";

export interface NavSubItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavMainItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  subItems?: NavSubItem[];
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "AeroShow",
    items: [
      {
        title: "Parts Database",
        url: "/dashboard/aero/parts",
        icon: Package,
      },
      {
        title: "Inventory",
        url: "/dashboard/aero/inventory",
        icon: Warehouse,
      },
      {
        title: "Customers",
        url: "/dashboard/aero/customers",
        icon: Users,
      },
      {
        title: "Vendors",
        url: "/dashboard/aero/vendors",
        icon: Building2,
      },
      {
        title: "Quotes",
        url: "/dashboard/aero/quotes",
        icon: FileText,
      },
      {
        title: "Invoices",
        url: "/dashboard/aero/invoices",
        icon: Receipt,
      },
      {
        title: "Purchase Orders",
        url: "/dashboard/aero/purchase-orders",
        icon: ShoppingCart,
      },
      {
        title: "A/P",
        url: "/dashboard/aero/accounts-payable",
        icon: CreditCard,
      },
      {
        title: "A/R",
        url: "/dashboard/aero/accounts-receivable",
        icon: HandCoins,
      },
      {
        title: "Financial",
        url: "/dashboard/aero/financial",
        icon: BarChart3,
      },
    ],
  },
];
