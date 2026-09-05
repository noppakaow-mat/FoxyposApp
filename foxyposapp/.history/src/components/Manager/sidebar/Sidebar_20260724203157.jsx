export default function Sidebar() {

  return (
    <aside className="
      w-64
      h-screen
      bg-zinc-900
      text-white
      flex
      flex-col
      p-4
    ">

      {/* Logo */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-yellow-400">
          FoxyPOS
        </h1>
      </div>


      {/* Menu */}
      <nav className="space-y-2">

        <a href="/manager">
          Dashboard
        </a>

        <a href="/manager/stock">
          Stock
        </a>

        <a href="/manager/employees">
          Employees
        </a>

      </nav>


      {/* Logout */}
      <div className="mt-auto pt-4">
        <button
          className="
            w-full
            bg-red-500
            hover:bg-red-600
            text-white
            py-3
            rounded-xl
          "
        >
          Logout
        </button>
      </div>


    </aside>
  );
}