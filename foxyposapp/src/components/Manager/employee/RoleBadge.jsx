import { Crown, BadgeDollarSign, ChefHat } from "lucide-react";

export default function RoleBadge({ role }) {
  const roles = {
    manager: {
      label: "Manager",
      color: "bg-black text-white border border-black",
    },

    cashier: {
      label: "Cashier",
      color: "bg-gray-100 text-gray-800 border border-gray-300",
    },

    kitchen: {
      label: "Kitchen",
      color: "bg-white text-gray-800 border border-gray-300",
    },
  };

  const current = roles[role] || {
    label: role,
    color: "bg-gray-100 text-gray-700 border border-gray-300",
    icon: null,
  };

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${current.color}`}
    >
      {current.icon}
      {current.label}
    </span>
  );
}