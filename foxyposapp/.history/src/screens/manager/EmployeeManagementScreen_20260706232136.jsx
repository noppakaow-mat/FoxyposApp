import { useEffect, useState } from "react";

import {
  getUsers,
  createUser,
  updateUserRole,
  deleteUser
} from "../services/managerService";

export default function EmployeeManagementScreen() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "cashier"
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    const data = await getUsers();
    setUsers(data);
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!form.name || !form.email || !form.password) return;

    await createUser(form);

    setForm({
      name: "",
      email: "",
      password: "",
      role: "cashier"
    });

    loadUsers();
  };

  const handleRoleChange = async (id, role) => {
    await updateUserRole(id, role);
    loadUsers();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this employee?")) return;

    await deleteUser(id);
    loadUsers();
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading employees...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">

      {/* FORM */}
      <div className="bg-white p-4 rounded-xl shadow space-y-3">
        <h2 className="font-bold text-lg">Add Employee</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            className="border p-2 rounded"
            placeholder="Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <input
            className="border p-2 rounded"
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <input
            className="border p-2 rounded"
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <select
            className="border p-2 rounded"
            value={form.role}
            onChange={(e) =>
              setForm({ ...form, role: e.target.value })
            }
          >
            <option value="cashier">Cashier</option>
            <option value="kitchen">Kitchen</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Employee
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="font-bold mb-4">Employee List</h2>

        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b">
                <td>{u.name}</td>
                <td>{u.email}</td>

                <td>
                  <select
                    value={u.role}
                    onChange={(e) =>
                      handleRoleChange(u.id, e.target.value)
                    }
                    className="border p-1 rounded"
                  >
                    <option value="cashier">Cashier</option>
                    <option value="kitchen">Kitchen</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>

                <td>
                  <button
                    onClick={() => handleDelete(u.id)}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}