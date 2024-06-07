"use client";

import { useState } from "react";
import Image from "next/image";
import { activityTableData } from "@/data/activityTableData";
import { activityTableTH } from "@/data/tableTHData";
import { MdOutlineNavigateNext } from "react-icons/md";
import { BiSkipNext } from "react-icons/bi";

export default function ActivityTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Calculate the current items to display
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = activityTableData.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Calculate total pages
  const totalPages = Math.ceil(activityTableData.length / itemsPerPage);

  // Function to handle items per page change
  const handleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to the first page
  };

  return (
    <div className="w-full flex items-center justify-center gap-2 flex-col">
      <div className="w-full overflow-x-auto border border-customborder rounded-md mb-4 min-h-[40vh] relative">
        <table className="min-w-[1000px] lg:w-full bg-transparent">
          <thead className="border-b border-customborder">
            <tr>
              {activityTableTH.map((item, index) => (
                <th
                  className="text-left py-3 px-4 uppercase text-gray-300 font-bold text-sm"
                  key={index}
                >
                  {" "}
                  {item}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentItems.map((row, index) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0 ? "bg-darkgreen" : "bg-[#0f4223b9]"
                }`}
              >
                <td className="py-2 px-4 text-white font-light text-md">
                  {index + 1 + indexOfFirstItem}
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
      <div className="flex justify-start items-center p-4 bg-[#022D19]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => paginate(1)}
            className={`flex items-center justify-center mt-1 rotate-180 ${
              currentPage === 1
                ? "text-gray-400 cursor-not-allowed"
                : "cursor-pointer text-white"
            }`}
          >
            <BiSkipNext size={25} />
          </button>
          <button
            onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
            className={`flex items-center justify-center mt-1 rotate-180 ${
              currentPage === 1
                ? "text-gray-400 cursor-not-allowed"
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
              paginate(currentPage < totalPages ? currentPage + 1 : totalPages)
            }
            className={`flex items-center justify-center mt-1 ${
              currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed"
                : "cursor-pointer text-white"
            }`}
          >
            <MdOutlineNavigateNext size={25} />
          </button>
          <button
            onClick={() => paginate(totalPages)}
            className={`flex items-center justify-center mt-1 ${
              currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed"
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
