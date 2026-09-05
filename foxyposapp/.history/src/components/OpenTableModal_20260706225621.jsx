import { useEffect, useState } from "react";
import { getPackages } from "../services/packageService";

export default function OpenTableModal({
  table,
  onClose,
  onSubmit,
}) {
  const [customerCount, setCustomerCount] = useState(1);
  const [packageId, setPackageId] = useState("");
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPackage();
  }, []);

  const loadPackage = async () => {
    try {
      const res = await getPackages();
      setPackages(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async () => {
    if (!packageId) {
      alert("กรุณาเลือกแพ็กเกจ");
      return;
    }

    try {
      setLoading(true);

      await onSubmit({
        table_id: table.table_id,
        customer_count: Number(customerCount),
        package_id: Number(packageId),
      });

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center">
      <div className="bg-white rounded-xl w-[420px] p-6">

        {/* TITLE */}
        <h2 className="text-xl font-bold mb-5">
          เปิดโต๊ะ {table.table_number}
        </h2>

        {/* CUSTOMER COUNT */}
        <label className="block mb-2">
          จำนวนลูกค้า
        </label>

        <input
          type="number"
          min={1}
          value={customerCount}
          onChange={(e) =>
            setCustomerCount(Number(e.target.value))
          }
          className="border w-full p-2 rounded"
        />

        {/* PACKAGE */}
        <label className="block mt-5 mb-2">
          Package
        </label>

        <select
          className="border w-full p-2 rounded"
          value={packageId}
          onChange={(e) =>
            setPackageId(e.target.value)
          }
        >
          <option value="">
            เลือกแพ็กเกจ
          </option>

          {packages.map((pkg) => (
            <option
              key={pkg.package_id}
              value={pkg.package_id}
            >
              {pkg.package_name} ({pkg.price} บาท)
            </option>
          ))}
        </select>

        {/* BUTTONS */}
        <div className="flex justify-end gap-3 mt-8">

          <button
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2 rounded bg-gray-300"
          >
            ยกเลิก
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`px-5 py-2 rounded text-white ${
              loading
                ? "bg-red-300"
                : "bg-red-500"
            }`}
          >
            {loading ? "กำลังเปิด..." : "เปิดโต๊ะ"}
          </button>

        </div>
      </div>
    </div>
  );
}