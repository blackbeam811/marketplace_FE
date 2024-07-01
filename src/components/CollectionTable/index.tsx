/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { collectionTableTH } from "@/data/tableTHData";
import { useContext } from "react";
import { CollectionContext } from "@/contexts/CollectionContext";
import { PINATA_URL } from "@/config";
import { NormalSpinner } from "../Spinners";

export default function CollectionTable() {
  const router = useRouter();
  const { collectionData, collectionDataState } = useContext(CollectionContext);
  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-[1024px] lg:w-full bg-transparent">
        <thead className="border-b border-customborder">
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
          {collectionData.map((row, index) => (
            <tr
              key={index}
              className={
                "bg-darkgreen hover:bg-[#225e451f] cursor-pointer duration-200"
              }
              // onClick={() => router.push("/market/" + row.collectionAddr)}
            >
              <td className="py-2 px-4 text-white font-light text-md">
                {index + 1}
              </td>
              <td className="relative py-2 px-4 text-white font-light text-md flex items-center justify-start gap-3">
                <div className="relative w-[50px] h-[50px]">
                  <img
                    src={PINATA_URL + row.imgUrl}
                    alt="Collection Image"
                    className="object-cover rounded-md w-full h-full"
                  />
                </div>
                <Link href={`${"/market/" + row.collectionAddr}`}>
                  {row.collectionName}
                </Link>
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
      <div
        className={`w-full flex items-center justify-center my-5 ${
          !collectionDataState && "hidden"
        }`}
      >
        <NormalSpinner width={9} height={10} />
      </div>
      <div
        className={`${
          collectionData.length !== 0 && "hidden"
        } w-full flex items-center justify-center my-5`}
      >
        <span className="text-[#ffffff]">Nothing to show 😒</span>
      </div>
    </div>
  );
}
