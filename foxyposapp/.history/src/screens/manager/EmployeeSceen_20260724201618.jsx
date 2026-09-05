import { useEffect, useState } from "react";

import Header from "../../components/manager/sHeader";

import EmployeeTable from "../../components/manager/employee/EmployeeTable";
import EmployeeModal from "../../components/manager/employee/EmployeeModal";

import {
  getUsers,
  updateRole,
  deleteUser
} from "../../services/userService";


export default function EmployeePage() {

  const [users, setUsers] = useState([]);

  const [selectedUser, setSelectedUser] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);

  const [loading, setLoading] = useState(true);


  useEffect(() => {
    loadUsers();
  }, []);


  async function loadUsers() {

    try {

      const res = await getUsers();

      setUsers(res.data);

    } catch (error) {

      console.error(
        "Load users error:",
        error
      );

    } finally {

      setLoading(false);

    }

  }


  function handleEditRole(user) {

    setSelectedUser(user);

    setModalOpen(true);

  }


  async function handleUpdateRole(data) {

    try {

      await updateRole(
        data.id,
        data.role
      );


      setModalOpen(false);

      setSelectedUser(null);

      loadUsers();


    } catch (error) {

      console.error(
        "Update role error:",
        error
      );

    }

  }


  async function handleDelete(id) {

    try {

      await deleteUser(id);

      loadUsers();


    } catch (error) {

      console.error(
        "Delete user error:",
        error
      );

    }

  }


  if (loading) {

    return (
      <div className="p-6">
        Loading employee...
      </div>
    );

  }


  return (
    <div className="space-y-6">

      <Header title="Employee Management" />


      <EmployeeTable
        users={users}
        onEditRole={handleEditRole}
        onDelete={handleDelete}
      />


      <EmployeeModal
        user={selectedUser}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleUpdateRole}
      />

    </div>
  );
}