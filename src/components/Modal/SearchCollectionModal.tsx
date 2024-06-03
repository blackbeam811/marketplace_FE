"use client";
import Image from "next/image";
import { activityTableData } from "@/data/activityTableData";
import { useContext, useRef } from "react";
import { ModalContext } from "@/contexts/ModalContext";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";

export default function SearchCollectionModal() {
  const { searchCollectionModalShow, closeSearchCollectionModal } =
    useContext(ModalContext);
  const elem = useRef(null);
  useOnClickOutside(elem, () => closeSearchCollectionModal());
  return (
    <div
      className={`w-full fixed items-start top-0 bottom-0 py-10 lg:pr-[200px] left-0 right-0 justify-center flex px-3 bg-black bg-opacity-10 backdrop-blur-md z-[9] ${
        !searchCollectionModalShow && "hidden"
      }`}
    >
      <div
        className="w-[700px] bg-gray-800 min-h-[300px] rounded-lg mt-5 relative"
        ref={elem}
      >
        <table className="w-full bg-transparent">
          <thead>
            <tr>
              <th className="text-left py-3 px-4 uppercase text-gray-300 font-bold text-sm">
                Collection
              </th>
              <th className="text-left py-3 px-4 uppercase text-gray-300 font-bold text-sm">
                Floor
              </th>
              <th className="text-left py-3 px-4 uppercase text-gray-300 font-bold text-sm">
                Total Volume
              </th>
            </tr>
          </thead>
          <tbody>
            {activityTableData.map((row, index) => (
              <tr
                key={index}
                className={`${index % 2 === 0 ? "bg-gray-800" : "bg-gray-900"}`}
              >
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

                <td className="py-2 px-4 text-[#DD7A98]">{row.total} SOL</td>
                <td className="py-2 px-4 text-white font-light">
                  {row.seller.slice(0, 4) + "...." + row.seller.slice(-4)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
