/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import { useContext, useEffect, useRef, useState } from "react";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import { ModalContext } from "@/contexts/ModalContext";
import { CollectionContext } from "@/contexts/CollectionContext";
import { PINATA_URL } from "@/config";
import { CollectionDataType } from "@/types/types";

export default function SearchCollectionModal() {
  const {
    searchCollectionModalShow,
    closeSearchCollectionModal,
    filterWithSearchCollectionAddr,
  } = useContext(ModalContext);
  const elem = useRef(null);
  useOnClickOutside(elem, () => closeSearchCollectionModal());

  const { collectionData } = useContext(CollectionContext);
  const [filterData, setFilterData] = useState<CollectionDataType[]>([]);

  useEffect(() => {
    setFilterData(
      filterWithSearchCollectionAddr === ""
        ? collectionData
        : collectionData.filter((item) =>
            item.collectionName.includes(filterWithSearchCollectionAddr)
          )
    );
  }, [collectionData, filterWithSearchCollectionAddr]);

  return (
    <div
      className={`w-full fixed items-start top-0 duration-300 bottom-0 py-10 left-0 right-0 justify-center flex px-3 bg-black bg-opacity-10 backdrop-blur-md z-[9] ${
        !searchCollectionModalShow
          ? "opacity-0 pointer-events-none"
          : "opacity-100 pointer-events-auto"
      }`}
    >
      <div
        className="w-[700px] bg-darkgreen min-h-[100px] rounded-lg mt-5 relative shadow-lg"
        ref={elem}
      >
        <table className="w-full bg-transparent">
          <thead className="border-b border-customborder">
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
            {filterData.map((row, index) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0 ? "bg-darkgreen" : "bg-[#0b563356]"
                } py-10`}
              >
                <td className="relative py-1 px-4 text-white font-light text-md flex items-center justify-start gap-3">
                  <div className="relative w-[30px] h-[30px]">
                    <img
                      src={PINATA_URL + row.imgUrl}
                      alt="Collection Image"
                      className="object-cover rounded-md"
                    />
                  </div>
                  <Link
                    href={`${"/market/" + row.collectionAddr}`}
                    onClick={closeSearchCollectionModal}
                    className="text-sm"
                  >
                    {row.collectionName}
                  </Link>
                </td>

                <td className="py-2 px-4 text-[#DD7A98]">
                  {row.currentPrice} SOL
                </td>
                <td className="py-2 px-4 text-white font-light text-sm">
                  {row.collectionAddr.slice(0, 6) +
                    "...." +
                    row.collectionAddr.slice(-6)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div
          className={`${
            filterData.length !== 0 && "hidden"
          } w-full flex items-center justify-center my-5`}
        >
          <span className="text-[#ffffff]">Nothing to show 😒</span>
        </div>
      </div>
    </div>
  );
}
