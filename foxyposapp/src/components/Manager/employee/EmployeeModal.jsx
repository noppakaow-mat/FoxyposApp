import { useState, useEffect } from "react";
import {
  ShieldCheck,
  UserPlus,
  X,
} from "lucide-react";

export default function EmployeeModal({
  user,
  open,
  onClose,
  onSave,
}) {
  const isEdit = !!user;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("cashier");

  useEffect(() => {
    if (!open) return;

    if (isEdit) {
      setUsername(user.username);
      setPassword("");
      setRole(user.role);
    } else {
      setUsername("");
      setPassword("");
      setRole("cashier");
    }
  }, [user, open, isEdit]);

  if (!open) return null;

  function handleSubmit(e) {
    e.preventDefault();

    if (isEdit) {
      onSave({
        id: user.id,
        role,
      });
    } else {
      onSave({
        username,
        password,
        role,
      });
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">

          <div className="flex items-center gap-3">

            <div className="rounded-full bg-yellow-100 p-2">
              {isEdit ? (
                <ShieldCheck
                  className="text-yellow-600"
                  size={22}
                />
              ) : (
                <UserPlus
                  className="text-yellow-600"
                  size={22}
                />
              )}
            </div>

            <div>

              <h2 className="text-lg font-bold text-gray-800">
                {isEdit
                  ? "Edit Employee Role"
                  : "Add Employee"}
              </h2>

              <p className="text-sm text-gray-500">
                {isEdit
                  ? "แก้ไขสิทธิ์การใช้งาน"
                  : "เพิ่มพนักงานใหม่"}
              </p>

            </div>

          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-gray-100"
          >
            <X size={18} />
          </button>

        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-6"
        >
                      {/* Username */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Username
            </label>

            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isEdit}
              required
              className={`w-full rounded-xl border px-4 py-3 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-300 outline-none ${
                isEdit ? "bg-gray-100 text-gray-500" : ""
              }`}
            />
          </div>

          {/* Password (เฉพาะตอนเพิ่มพนักงาน) */}
          {!isEdit && (
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-300 outline-none"
              />
            </div>
          )}

          {/* Role */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Role
            </label>

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-300 outline-none"
            >
              <option value="manager">Manager</option>
              <option value="cashier">Cashier</option>
              <option value="kitchen">Kitchen</option>
            </select>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-300 px-5 py-2.5 font-medium text-gray-700 transition hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-xl bg-yellow-500 px-5 py-2.5 font-semibold text-white transition hover:bg-yellow-600"
            >
              {isEdit ? "Save Changes" : "Add Employee"}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}