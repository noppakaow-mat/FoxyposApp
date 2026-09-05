import {
  DollarSign,
  CalendarDays,
  UtensilsCrossed,
  ShoppingCart,
} from "lucide-react";

export default function SummaryCards({
  todayRevenue,
  monthRevenue,
  activeTables,
  todayOrders,
}) {
  const cards = [
    {
      title: "Today's Revenue",
      value: `฿${Number(todayRevenue || 0).toLocaleString()}`,
      icon: <DollarSign size={28} />,
      color: "bg-green-500",
    },
    {
      title: "Monthly Revenue",
      value: `฿${Number(monthRevenue || 0).toLocaleString()}`,
      icon: <CalendarDays size={28} />,
      color: "bg-blue-500",
    },
    {
      title: "Active Tables",
      value: activeTables || 0,
      icon: <UtensilsCrossed size={28} />,
      color: "bg-orange-500",
    },
    {
      title: "Today's Orders",
      value: todayOrders || 0,
      icon: <ShoppingCart size={28} />,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="rounded-xl bg-white shadow-md p-6 hover:shadow-lg transition"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">
                {card.title}
              </p>

              <h2 className="mt-2 text-3xl font-bold text-gray-800">
                {card.value}
              </h2>
            </div>

            <div
              className={`${card.color} p-4 rounded-full text-white`}
            >
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}