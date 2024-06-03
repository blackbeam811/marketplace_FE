"use client";
import { collectionTableData } from "@/data/collectionTableData";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CollectionTable() {
  const router = useRouter();
  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-[1024px] lg:w-full bg-transparent">
        <thead>
          <tr>
            <th className="text-left py-3 px-4 uppercase text-gray-300 font-bold text-sm"></th>
            <th className="text-left py-3 px-4 uppercase text-gray-300 font-bold text-sm">
              Collection
            </th>
            <th className="text-left py-3 px-4 uppercase text-gray-300 font-bold text-sm">
              Current Price
            </th>
            <th className="text-left py-3 px-4 uppercase text-gray-300 font-bold text-sm">
              Previous Price
            </th>
            <th className="text-left py-3 px-4 uppercase text-gray-300 font-bold text-sm">
              Volume
            </th>
            <th className="text-left py-3 px-4 uppercase text-gray-300 font-bold text-sm">
              Change
            </th>
            <th className="text-left py-3 px-4 uppercase text-gray-300 font-bold text-sm">
              Sales
            </th>
            <th className="text-left py-3 px-4 uppercase text-gray-300 font-bold text-sm">
              Market Cap
            </th>
            <th className="text-left py-3 px-4 uppercase text-gray-300 font-bold text-sm">
              Total Volume
            </th>
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
                    className="object-cover"
                  />
                </div>
                {row.name}
              </td>
              <td className="py-2 px-4 text-[#8DEEC4]">
                {row.currentPrice}SOL
              </td>
              <td className="py-2 px-4 text-[#DD7A98]">
                {row.previousPrice} SOL
              </td>
              <td className="py-2 px-4 text-white font-light">{row.volume}</td>
              <td className="py-2 px-4 text-white font-light">{row.change}%</td>
              <td className="py-2 px-4 text-white font-light">{row.sales}</td>
              <td className="py-2 px-4 text-white font-light">
                {row.marketCap}
              </td>
              <td className="py-2 px-4 text-white font-light">
                {row.totalVolume}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
