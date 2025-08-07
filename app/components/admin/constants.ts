import { FaHome, FaInstagram, FaMusic, FaNewspaper, FaStar, FaUsers, FaChartLine, FaCog } from "react-icons/fa";
export { productivityMessages } from "./messages";

export const navigationItems = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: FaHome,
    description: "Overview & Analytics"
  },
  {
    name: "Instagram",
    href: "/admin/instagram",
    icon: FaInstagram,
    description: "Message Management"
  },
  {
    name: "Demo Submissions",
    href: "/admin/demos",
    icon: FaMusic,
    description: "Review Demo Submissions"
  },
  {
    name: "Demo Distribution",
    href: "/admin/demo",
    icon: FaMusic,
    description: "Upload & Send Demos"
  },
  {
    name: "Newsletter",
    href: "/admin/newsletter",
    icon: FaNewspaper,
    description: "Subscriber Management"
  },
  {
    name: "Influencers",
    href: "/admin/influencers",
    icon: FaStar,
    description: "Influencer Database"
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: FaUsers,
    description: "User Management"
  },
  {
    name: "Analytics",
    href: "/admin/analytics",
    icon: FaChartLine,
    description: "Reports & Stats"
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: FaCog,
    description: "System Configuration"
  }
];
