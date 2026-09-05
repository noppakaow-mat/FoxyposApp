export default function RoleBadge({ role }) {

  const roleStyle = {
    manager: "bg-purple-100 text-purple-700",
    cashier: "bg-blue-100 text-blue-700",
    kitchen: "bg-orange-100 text-orange-700"
  };


  const roleName = {
    manager: "Manager",
    cashier: "Cashier",
    kitchen: "Kitchen"
  };


  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${roleStyle[role] || "bg-gray-100 text-gray-700"}`}
    >
      {roleName[role] || role}
    </span>
  );
}