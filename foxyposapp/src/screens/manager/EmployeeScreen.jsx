import { useEffect, useState } from "react";

import EmployeeTable from "../../components/Manager/employee/EmployeeTable";
import EmployeeModal from "../../components/Manager/employee/EmployeeModal";

import {
  getUsers,
  createUser,
  updateRole,
  deleteUser,
} from "../../services/userService";

export default function EmployeeScreen() {
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      const res = await getUsers();
      setUsers(res.data);
    } catch (error) {
      console.error("Load users error:", error);
    } finally {
      setLoading(false);
    }
  }

  // ==========================
  // ADD EMPLOYEE
  // ==========================
  function handleAddEmployee() {
    setSelectedUser(null);
    setModalOpen(true);
  }

  // ==========================
  // EDIT ROLE
  // ==========================
  function handleEditRole(user) {
    setSelectedUser(user);
    setModalOpen(true);
  }

  // ==========================
  // SAVE (ADD / EDIT)
  // ==========================
  async function handleSave(data) {
    try {
      if (data.id) {
        await updateRole(data.id, data.role);
      } else {
        await createUser({
          username: data.username,
          password: data.password,
          role: data.role,
        });
      }

      setModalOpen(false);
      setSelectedUser(null);

      loadUsers();

    } catch (error) {
      console.error("Save employee error:", error);
    }
  }

  // ==========================
  // DELETE
  // ==========================
  async function handleDelete(id) {
    const confirmDelete = window.confirm(
      "Delete this employee?"
    );

    if (!confirmDelete) return;

    try {
      await deleteUser(id);
      loadUsers();
    } catch (error) {
      console.error("Delete user error:", error);
    }
  }

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <p className="text-gray-500">
          Loading employee...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <EmployeeTable
        users={users}
        onAddEmployee={handleAddEmployee}
        onEditRole={handleEditRole}
        onDelete={handleDelete}
      />

      <EmployeeModal
        open={modalOpen}
        user={selectedUser}
        onClose={() => {
          setModalOpen(false);
          setSelectedUser(null);
        }}
        onSave={handleSave}
      />

    </div>
  );
}