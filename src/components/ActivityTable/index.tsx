import { activityTableData } from "@/data/activityTableData";
import { collectionTableData } from "@/data/collectionTableData";
import Image from "next/image";

export default function ActivityTable() {
  return (
    <div className="w-full overflow-x-auto border-[1px] border-gray-700 rounded-md mb-10">
      <table className="min-w-[1024px] lg:w-full bg-transparent">
        <thead>
          <tr>
            <th className="text-left py-3 px-4 uppercase text-gray-300 font-bold text-sm"></th>
            <th className="text-left py-3 px-4 uppercase text-gray-300 font-bold text-sm">
              Name
            </th>
            <th className="text-left py-3 px-4 uppercase text-gray-300 font-bold text-sm">
              type
            </th>
            <th className="text-left py-3 px-4 uppercase text-gray-300 font-bold text-sm">
              total
            </th>
            <th className="text-left py-3 px-4 uppercase text-gray-300 font-bold text-sm">
              seller
            </th>
            <th className="text-left py-3 px-4 uppercase text-gray-300 font-bold text-sm">
              buyer
            </th>
            <th className="text-left py-3 px-4 uppercase text-gray-300 font-bold text-sm">
              time
            </th>
          </tr>
        </thead>
        <tbody>
          {activityTableData.map((row, index) => (
            <tr
              key={index}
              className={`${index % 2 === 0 ? "bg-gray-800" : "bg-gray-900"}`}
            >
              <td className="py-2 px-4 text-white font-light text-md">
                {index + 1}
              </td>
              <td className="relative py-1 px-4 text-white font-light text-md flex items-center justify-start gap-3">
                <div className="relative w-[30px] h-[30px]">
                  <Image
                    fill
                    src={row.imgUrl}
                    alt="Collection Image"
                    className="object-cover"
                  />
                </div>
                {row.name}
              </td>
              <td className="py-2 px-4 text-[#8DEEC4] uppercase">
                {row.type === 0 ? "list" : row.type === 1 ? "Unlist" : "Sold"}
              </td>
              <td className="py-2 px-4 text-[#DD7A98]">{row.total} SOL</td>
              <td className="py-2 px-4 text-white font-light">
                {row.seller.slice(0, 4) + "...." + row.seller.slice(-4)}
              </td>
              <td className="py-2 px-4 text-white font-light">
                {" "}
                {row.buyer.slice(0, 4) + "...." + row.buyer.slice(-4)}
              </td>
              <td className="py-2 px-4 text-white font-light">
                {row.time.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
