/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import { collectionTableTH } from "@/data/tableTHData";
import { useContext, useState, useMemo } from "react";
import { CollectionContext } from "@/contexts/CollectionContext";
import { PINATA_URL } from "@/config";
import { NormalSpinner } from "../Spinners";
import { CollectionDataType, CollectionTableTHType } from "@/types/types";
import { useRouter } from "next/navigation";
import { FaArrowsAltV } from "react-icons/fa";

type SortConfig = {
  key: keyof CollectionDataType;
  direction: "ascending" | "descending";
};

const headerToKeyMap: {
  [key in keyof CollectionTableTHType]: keyof CollectionDataType;
} = {
  collectionName: "collectionName",
  floorPrice: "floorPrice",
  totalVolume: "totalVolume",
  volume: "volume",
  sales: "sales",
  listed: "listed",
  topOffer: "topOffer",
  owners: "owners",
};

export default function CollectionTable() {
  const { collectionData, collectionDataState } = useContext(CollectionContext);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchColumn, setSearchColumn] = useState<
    keyof CollectionDataType | null
  >(null);

  // Handle search term change
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Handle column change for searching
  const handleColumnChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchColumn(event.target.value as keyof CollectionDataType);
  };

  // Handle sorting
  const handleSort = (key: keyof CollectionDataType) => {
    let direction: "ascending" | "descending" = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = useMemo(() => {
    if (!sortConfig || !collectionData) return collectionData;
    return [...collectionData].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
  }, [collectionData, sortConfig]);

  const filteredData = useMemo(() => {
    if (!searchTerm || !searchColumn || !sortedData) return sortedData;
    return sortedData.filter((item) =>
      item[searchColumn]
        ?.toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [sortedData, searchTerm, searchColumn]);

  return (
    <div className="w-full overflow-x-auto pb-10 rounded-md">
      {/* <div className="flex mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearch}
          className="mr-2"
        />
        <select onChange={handleColumnChange} defaultValue="">
          <option value="" disabled>
            Select column
          </option>
          {collectionData &&
            collectionData.length > 0 &&
            Object.keys(collectionData[0]).map((header) => (
              <option key={header} value={header}>
                {header}
              </option>
            ))}
        </select>
      </div> */}
      <table className="xl:min-w-[1024px] min-w-[800px] lg:w-full bg-transparent">
        <thead className="border-b border-customborder bg-[#133b29ce]">
          <tr>
            {Object.keys(headerToKeyMap).map((header) => (
              <th
                className="text-left py-3 px-4 uppercase text-gray-100 font-bold text-sm cursor-pointer"
                key={header}
                onClick={() =>
                  handleSort(header as keyof CollectionTableTHType)
                }
              >
                {header}
                {sortConfig?.key ===
                  headerToKeyMap[header as keyof CollectionTableTHType] &&
                  (sortConfig.direction === "ascending" ? (
                    " ↑"
                  ) : sortConfig.direction === "descending" ? (
                    " ↓"
                  ) : (
                    <FaArrowsAltV color="white" size={10} />
                  ))}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row, index) => (
            <tr
              key={index}
              className={`hover:bg-[#17483471] cursor-pointer duration-200 text-sm font-semibold md:text-md ${
                index % 2 === 0 ? "bg-darkgreen" : "bg-[#0f422321]"
              }`}
            >
              <td className="relative py-2 px-4 text-gray-100 font-semibold flex items-center justify-start gap-3">
                <div className="relative w-[45px] h-[45px]">
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
              <td className="py-2 px-4 text-[#8DEEC4]">{row.floorPrice} SOL</td>
              <td className="py-2 px-4 text-[#DD7A98]">{row.totalVolume}</td>
              <td className="py-2 px-4 text-white font-semibold">
                {row.listed === 0
                  ? 0
                  : ((row.listed / row.totalVolume) * 100).toFixed(2)}
                %
              </td>
              <td className="py-2 px-4 text-gray-100 font-semibold">
                {row.sales.toLocaleString()}
              </td>
              <td className="py-2 px-4 text-gray-100 font-semibold">
                {row.listed.toLocaleString()}
              </td>
              <td className="py-2 px-4 text-gray-100 font-semibold">
                {row.topOffer.toLocaleString()} SOL
              </td>
              <td className="py-2 px-4 text-gray-100 font-semibold">
                {row.owners.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="w-full flex items-center justify-center py-4">
        {/* <span className="text-sm text-white">Load more</span> */}
      </div>
      <div
        className={`w-full items-center justify-center my-5 ${
          collectionDataState ? "flex" : "hidden"
        }`}
      >
        <NormalSpinner width={9} height={10} />
      </div>
      <div
        className={`${
          collectionData.length === 0 && !collectionDataState
            ? "flex"
            : "hidden"
        } w-full items-center justify-center my-5`}
      >
        <span className="text-[#ffffff]">Nothing to show 😒</span>
      </div>
    </div>
  );
}
