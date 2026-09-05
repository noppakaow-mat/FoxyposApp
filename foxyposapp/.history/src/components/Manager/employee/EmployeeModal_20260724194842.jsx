import { useState, useEffect } from "react";


export default function EmployeeModal({
  user,
  open,
  onClose,
  onSave
}) {

  const [role, setRole] = useState("");


  useEffect(() => {

    if (user) {
      setRole(user.role);
    }

  }, [user]);


  if (!open || !user) {
    return null;
  }


  function handleSubmit(e) {

    e.preventDefault();

    onSave({
      id: user.id,
      role
    });

  }


  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">


        <h2 className="text-lg font-bold text-gray-800 mb-5">
          แก้ไข Role
        </h2>


        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <div>

            <label className="text-sm text-gray-600">
              Username
            </label>


            <input
              value={user.username}
              disabled
              className="w-full mt-1 border rounded-xl px-3 py-2 bg-gray-100"
            />

          </div>



          <div>

            <label className="text-sm text-gray-600">
              Role
            </label>


            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full mt-1 border rounded-xl px-3 py-2"
            >

              <option value="manager">
                Manager
              </option>


              <option value="cashier">
                Cashier
              </option>


              <option value="kitchen">
                Kitchen
              </option>

            </select>

          </div>



          <div className="flex justify-end gap-3 pt-4">

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border"
            >
              ยกเลิก
            </button>


            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-yellow-500 text-white font-semibold"
            >
              บันทึก
            </button>

          </div>


        </form>


      </div>

    </div>
  );
}