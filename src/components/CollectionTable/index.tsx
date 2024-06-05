"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { collectionTableData } from "@/data/collectionTableData";
import { collectionTableTH } from "@/data/tableTHData";

export default function CollectionTable() {
  const router = useRouter();
  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-[1024px] lg:w-full bg-transparent">
        <thead>
          <tr>
            {collectionTableTH.map((item, index) => (
              <th
                className="text-left py-3 px-4 uppercase text-gray-300 font-thin text-sm"
                key={index}
              >
                {item}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {collectionTableData.map((row, index) => (
            <tr
              key={index}
              className={
                "bg-gray-900 hover:bg-gray-800 cursor-pointer duration-200"
              }
              onClick={() => router.push("/market/" + row.collectionAddr)}
            >
              <td className="py-2 px-4 text-white font-light text-md">
                {index + 1}
              </td>
              <td className="relative py-2 px-4 text-white font-light text-md flex items-center justify-start gap-3">
                <div className="relative w-[50px] h-[50px]">
                  <Image
                    fill
                    src={row.imgUrl}
                    alt="Collection Image"
                    className="object-cover rounded-md"
                  />
                </div>
                {row.name}
              </td>
              <td className="py-2 px-4 text-[#8DEEC4]">
                {row.currentPrice} SOL
              </td>
              <td className="py-2 px-4 text-[#DD7A98]">
                {row.previousPrice} SOL
              </td>
              <td className="py-2 px-4 text-white font-light">
                {row.volume.toLocaleString()}
              </td>
              <td className="py-2 px-4 text-white font-light">
                {row.change.toLocaleString()}%
              </td>
              <td className="py-2 px-4 text-white font-light">
                {row.sales.toLocaleString()}
              </td>
              <td className="py-2 px-4 text-white font-light">
                {row.marketCap.toLocaleString()}
              </td>
              <td className="py-2 px-4 text-white font-light">
                {row.totalVolume.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
