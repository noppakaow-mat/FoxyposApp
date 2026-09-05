import { useMemo, useState } from "react";
import {
  Search,
  UserPlus,
  Pencil,
  Trash2,
} from "lucide-react";

import RoleBadge from "./RoleBadge";

export default function EmployeeTable({
  users = [],
  onEditRole,
  onDelete,
  onAddEmployee,
}) {
  const [search, setSearch] = useState("");

  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.username
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        user.role
          .toLowerCase()
          .includes(search.toLowerCase())
    );
  }, [users, search]);

  return (
    <section className="bg-white rounded-2xl shadow-sm p-6">

      {/* Header */}
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>
          <h2 className="text-lg font-bold text-gray-800">
            จัดการพนักงาน
          </h2>

          <p className="text-sm text-gray-500">
            เพิ่ม แก้ไข และจัดการสิทธิ์การใช้งานของพนักงาน
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">

          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="ค้นหาพนักงาน..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-300 pl-10 pr-4 py-2 outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-300"
            />
          </div>

          <button
            onClick={onAddEmployee}
            className="flex items-center justify-center gap-2 rounded-xl bg-yellow-500 px-4 py-2 font-semibold text-white transition hover:bg-yellow-600"
          >
            <UserPlus size={18} />
            เพิ่มพนักงาน
          </button>

        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">

        <table className="w-full text-sm">

          <thead>

            <tr className="border-b text-gray-500">

              <th className="py-3 text-left w-16">
                #
              </th>

              <th className="py-3 text-left">
                พนักงาน
              </th>

              <th className="py-3 text-center">
                ตำแหน่ง
              </th>

              <th className="py-3 text-center">
                วันที่สร้าง
              </th>

              <th className="py-3 text-center">
                จัดการ
              </th>

            </tr>

          </thead>

          <tbody>

            {filteredUsers.length > 0 ? (

              filteredUsers.map((user, index) => (

                <tr
                  key={user.id}
                  className="border-b last:border-none hover:bg-gray-50 transition"
                >

                  <td className="py-4 font-semibold text-gray-700">
                    {index + 1}
                  </td>

                  <td className="py-4">

                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-400 font-semibold text-white">
                        {user.username.charAt(0).toUpperCase()}
                      </div>

                      <div>

                        <p className="font-semibold text-gray-800">
                          {user.username}
                        </p>

                        <p className="text-xs text-gray-500">
                          รหัสพนักงาน : {user.id}
                        </p>

                      </div>

                    </div>

                  </td>

                  <td className="py-4 text-center">

                    <RoleBadge role={user.role} />

                  </td>

                  <td className="py-4 text-center text-gray-500">

                    {user.created_at
                      ? new Date(user.created_at).toLocaleDateString("th-TH", {
                          timeZone: "Asia/Bangkok",
                        })
                      : "-"}

                  </td>

                  <td className="py-4">

                    <div className="flex justify-center gap-2">

                      <button
                        onClick={() => onEditRole(user)}
                        className="group flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-600 transition hover:bg-blue-600 hover:text-white"
                        title="แก้ไขสิทธิ์"
                      >
                        <Pencil
                          size={16}
                          className="transition-colors group-hover:text-white"
                        />
                      </button>

                      <button
                        onClick={() => onDelete(user.id)}
                        className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-500 transition hover:bg-red-100"
                        title="ลบพนักงาน"
                      >
                        <Trash2 size={16} />
                      </button>

                    </div>

                  </td>

                </tr>

              ))

            ) : (

              <tr>

                <td
                  colSpan={5}
                  className="py-8 text-center text-gray-400"
                >
                  ไม่พบข้อมูลพนักงาน
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </section>
  );
}
