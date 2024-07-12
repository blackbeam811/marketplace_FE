/* eslint-disable @next/next/no-img-element */

"use client";
import { useEffect, useMemo, useState } from "react";
import { MdOutlineNavigateNext } from "react-icons/md";
import { BiSkipNext } from "react-icons/bi";
import { ActivityDataType, ActivityTableTHType } from "@/types/types";
import { activityTableTH } from "@/data/tableTHData";

type SortConfig = {
  key: keyof ActivityDataType;
  direction: "ascending" | "descending";
};

const headerToKeyMap: {
  [key in keyof ActivityTableTHType]: keyof ActivityDataType;
} = {
  name: "tokenId",
  type: "txType",
  Price: "solPrice",
  seller: "seller",
  buyer: "buyer",
  time: "updatedAt",
};

export default function ActivityTable({ data }: { data: ActivityDataType[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchColumn, setSearchColumn] = useState<
    keyof ActivityDataType | null
  >(null);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Handle items per page change
  const handleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to the first page
  };

  // Handle search term change
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Handle column change for searching
  const handleColumnChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchColumn(event.target.value as keyof ActivityDataType);
  };

  // Handle sorting
  const handleSort = (key: keyof ActivityTableTHType) => {
    const mappedKey = headerToKeyMap[key];
    let direction: "ascending" | "descending" = "ascending";
    if (
      sortConfig &&
      sortConfig.key === mappedKey &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key: mappedKey, direction });
  };

  const sortedData = useMemo(() => {
    if (!sortConfig || !data) return data;
    return [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);

  const filteredData = useMemo(() => {
    if (!searchTerm || !searchColumn || !sortedData) return sortedData;
    return sortedData.filter((item) =>
      item[searchColumn]
        ?.toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [sortedData, searchTerm, searchColumn]);

  const currentItems = filteredData?.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = filteredData
    ? Math.ceil(filteredData.length / itemsPerPage)
    : 1;

  return (
    <div className="w-full flex items-center justify-center gap-2 flex-col overflow-x-auto">
      <div className="w-full overflow-x-auto border border-customborder rounded-md mb-4 min-h-[10vh] relative">
        <table className="min-w-[1000px] lg:w-full bg-transparent">
          <thead className="border-b border-customborder">
            <tr>
              {Object.keys(headerToKeyMap).map((header) => (
                <th
                  className="text-left py-3 px-4 uppercase text-gray-300 font-bold text-sm cursor-pointer"
                  key={header}
                  onClick={() =>
                    handleSort(header as keyof ActivityTableTHType)
                  }
                >
                  {header}
                  {sortConfig?.key ===
                    headerToKeyMap[header as keyof ActivityTableTHType] &&
                    (sortConfig.direction === "ascending" ? " ↑" : " ↓")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentItems?.map((row, index) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0 ? "bg-darkgreen" : "bg-[#0f4223b9]"
                }`}
              >
                <td className="relative py-1 px-4 text-white font-light text-md flex items-center justify-start gap-3">
                  <div className="relative w-[30px] h-[30px]">
                    <img
                      src={row.imgUrl}
                      alt="Collection Image"
                      className="object-cover w-full h-full"
                    />
                  </div>
                  {row.tokenId}
                </td>
                <td className="py-2 px-4 text-[#8DEEC4] uppercase">
                  {row.txType === 0
                    ? "list"
                    : row.txType === 1
                    ? "Unlist"
                    : "Sold"}
                </td>
                <td className="py-2 px-4 text-[#DD7A98]">{row.solPrice} SOL</td>
                <td className="py-2 px-4 text-white font-light">
                  {row.seller.slice(0, 4) + "...." + row.seller.slice(-4)}
                </td>
                <td className="py-2 px-4 text-white font-light">
                  {row.buyer !== ""
                    ? row.buyer.slice(0, 4) + "......." + row.buyer.slice(-4)
                    : "...."}
                </td>
                <td className="py-2 px-4 text-white font-light">
                  {new Date(row.updatedAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div
          className={`${
            data?.length !== 0 && "hidden"
          } w-full flex items-center justify-center my-5`}
        >
          <span className="text-[#ffffff]">Nothing to show 😒</span>
        </div>
      </div>
      <div
        className={`flex justify-start items-center p-4 bg-[#022D19] ${
          data !== undefined && data?.length < 5 && "hidden"
        }`}
      >
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(1)}
            className={`flex items-center justify-center mt-1 rotate-180 ${
              currentPage === 1
                ? "text-gray-500 cursor-not-allowed"
                : "cursor-pointer text-white"
            }`}
          >
            <BiSkipNext size={25} />
          </button>
          <button
            onClick={() =>
              setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)
            }
            className={`flex items-center justify-center mt-1 rotate-180 ${
              currentPage === 1
                ? "text-gray-500 cursor-not-allowed"
                : "cursor-pointer text-white"
            }`}
          >
            <MdOutlineNavigateNext size={25} />
          </button>
          <span className="mx-2 text-white text-xl">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage(
                currentPage < totalPages ? currentPage + 1 : totalPages
              )
            }
            className={`flex items-center justify-center mt-1 ${
              currentPage === totalPages
                ? "text-gray-500 cursor-not-allowed"
                : "cursor-pointer text-white"
            }`}
          >
            <MdOutlineNavigateNext size={25} />
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            className={`flex items-center justify-center mt-1 ${
              currentPage === totalPages
                ? "text-gray-500 cursor-not-allowed"
                : "cursor-pointer text-white"
            }`}
          >
            <BiSkipNext size={25} />
          </button>
        </div>
      </div>
    </div>
  );
}
