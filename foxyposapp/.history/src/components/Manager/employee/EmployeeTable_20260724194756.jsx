import RoleBadge from "./RoleBadge";


export default function EmployeeTable({
    users = [],
    onEditRole,
    onDelete
}) {

    return (
        <section className="bg-white rounded-2xl shadow-sm p-6">

            <div className="mb-6">

                <h2 className="text-lg font-bold text-gray-800">
                    Employee Management
                </h2>

                <p className="text-sm text-gray-500">
                    จัดการผู้ใช้งานในระบบ
                </p>

            </div>


            <div className="overflow-x-auto">

                <table className="w-full text-sm">

                    <thead>

                        <tr className="border-b text-gray-500">

                            <th className="py-3 text-left">
                                #
                            </th>

                            <th className="py-3 text-left">
                                Username
                            </th>

                            <th className="py-3 text-center">
                                Role
                            </th>

                            <th className="py-3 text-right">
                                Action
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {users.length > 0 ? (

                            users.map((user, index) => (

                                <tr
                                    key={user.id}
                                    className="border-b last:border-none"
                                >

                                    <td className="py-4 font-semibold">
                                        {index + 1}
                                    </td>


                                    <td className="py-4">
                                        {user.username}
                                    </td>


                                    <td className="py-4 text-center">

                                        <RoleBadge
                                            role={user.role}
                                        />

                                    </td>


                                    <td className="py-4 text-right space-x-2">

                                        <button
                                            onClick={() => onEditRole(user)}
                                            className="text-blue-600 font-semibold"
                                        >
                                            แก้ไข Role
                                        </button>


                                        <button
                                            onClick={() => onDelete(user.id)}
                                            className="text-red-600 font-semibold"
                                        >
                                            ลบ
                                        </button>

                                    </td>

                                </tr>

                            ))

                        ) : (

                            <tr>

                                <td
                                    colSpan="4"
                                    className="py-8 text-center text-gray-400"
                                >
                                    ไม่มีข้อมูลพนักงาน
                                </td>

                            </tr>

                        )}

                    </tbody>

                </table>

            </div>

        </section>
    );
}