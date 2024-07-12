"use client";
import { useRef, useState } from "react";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import { SelectPropsType } from "@/types/types";
import { ArrowIcon } from "../SvgIcons";
import { useRouter, useSearchParams } from "next/navigation";

export default function CollectionFilterSelect({
  options,
  filterType,
  onSelectFilter,
}: SelectPropsType) {
  const elem = useRef(null);
  const router = useRouter();
  const param = useSearchParams();
  const [open, setOpen] = useState(false);
  const [filterOption, setFilterOption] = useState(0);
  useOnClickOutside(elem, () => setOpen(false));
  const search = param.get("activeTab") || "items";
  const showQuery = param.getAll("item"); // Ensure it's an array

  const handleFilterSelect = (index: number) => {
    setFilterOption(index);
    setOpen(false);
    onSelectFilter(options[index].param);
    router.push(`?activeTab=items&${filterType}=${options[index].param}`);
  };

  return (
    <div className="relative" ref={elem}>
      <div
        className="w-[160px] py-[6px] px-2 border border-customborder rounded-md text-gray-300 text-md flex items-center justify-between gap-2 cursor-pointer
      hover:border-gray-400 duration-300 text-sm uppercase"
        onClick={() => setOpen(!open)}
      >
        {filterType === "item"
          ? showQuery[0] === "listed"
            ? "listed"
            : "unlisted"
          : options[filterOption].title}
        <span className={`${open ? "-rotate-90" : "rotate-90"} duration-300`}>
          <ArrowIcon />
        </span>
      </div>
      <div
        className={`absolute top-10 w-[160px] min-h-[70px] rounded-md bg-green-950 flex items-start shadow-sm shadow-green-300 justify-between flex-col z-50 py-2 duration-200
          origin-top ${
            open
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
      >
        {options.map((item, index) => (
          <p
            className={`text-white cursor-pointer text-sm uppercase ${
              item.param !== options[filterOption].param && "hover:bg-green-500"
            } w-full py-2 px-2 ${
              item.param === options[filterOption].param
                ? "bg-green-800"
                : "bg-green-950"
            }`}
            key={index}
            onClick={() => {
              handleFilterSelect(index);
              router.push(`?activeTab=items&${filterType}=${item.param}`);
            }}
          >
            {item.title}
          </p>
        ))}
      </div>
    </div>
  );
}
