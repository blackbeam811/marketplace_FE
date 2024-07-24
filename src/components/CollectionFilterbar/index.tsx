"use client";
import { SetStateAction, useState } from "react";
import { BiSearch } from "react-icons/bi";
import { FiFilter } from "react-icons/fi";
import CollectionFilterSelect from "../CollectionFilterSelect";
import { collectionFilterOptions } from "@/data/selectTabData";
import { CollectionFilterbarProps } from "@/types/types";
import { useSearchParams } from "next/navigation";
import { BsFillGrid3X3GapFill, BsFillGridFill } from "react-icons/bs";

export default function CollectionFilterbar({
  setFilterOpen,
  filterOpen,
  setShowGrid,
  showGrid,
  onSearch,
  onSelectFilter,
}: CollectionFilterbarProps) {
  const param = useSearchParams();
  const search = param.get("activeTab") || "items";
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div
      className={`w-full flex items-center justify-between gap-3 px-2 ${
        (search === "activity" || search === "offers") && "hidden"
      }`}
    >
      <div
        className={`p-2 ${
          filterOpen
            ? "bg-yellow-600 text-white"
            : "bg-transparent text-gray-300 border border-customborder"
        } rounded-md hover:text-white duration-300 cursor-pointer`}
        onClick={() => setFilterOpen(!filterOpen)}
      >
        <FiFilter />
      </div>
      <div
        className="items-center justify-center bg-transparent border border-customborder p-2
      rounded-md gap-2 hidden md:flex"
      >
        <BsFillGridFill
          className={`text-gray-300 hover:text-yellow-600 duration-200 cursor-pointer ${
            showGrid !== "normal" ? "text-gray-300" : "text-yellow-600"
          }`}
          onClick={() => setShowGrid("normal")}
        />
        <BsFillGrid3X3GapFill
          className={`text-gray-300 hover:text-yellow-600 duration-200 cursor-pointer ${
            showGrid === "normal" ? "text-gray-300" : "text-yellow-600"
          }`}
          onClick={() => setShowGrid("small")}
        />
      </div>
      <div className="w-full flex items-center justify-start px-2 rounded-md border border-customborder hover:border-[#ffffff87] duration-300">
        <BiSearch color="white" />
        <input
          placeholder="Search items"
          value={searchTerm}
          onChange={handleSearchChange}
          className="outline-none bg-transparent w-full text-white py-1 px-1 text-md"
        />
      </div>
      <CollectionFilterSelect
        options={collectionFilterOptions}
        filterType=""
        onSelectFilter={onSelectFilter}
      />
    </div>
  );
}
