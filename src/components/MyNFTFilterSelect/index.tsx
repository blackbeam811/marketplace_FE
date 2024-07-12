"use client";
import { useRef, useState } from "react";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import { MyNFTFilterSelectPropsType, SelectPropsType } from "@/types/types";
import { ArrowIcon } from "../SvgIcons";
import { useRouter, useSearchParams } from "next/navigation";

export default function MyNFTFilterSelect({
  options,
  filterType,
}: MyNFTFilterSelectPropsType) {
  const elem = useRef(null);
  const router = useRouter();
  const param = useSearchParams();
  const [open, setOpen] = useState(false);
  const [filterOption, setFilterOption] = useState(0);
  useOnClickOutside(elem, () => setOpen(false));
  const search = param.get("activeTab") || "items";
  const showQuery = param.getAll("item"); // Ensure it's an array

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
          : options[filterOption]}
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
              item !== options[filterOption] && "hover:bg-green-500"
            } w-full py-2 px-2 ${
              item === options[filterOption] ? "bg-green-800" : "bg-green-950"
            }`}
            key={index}
            onClick={() => {
              setFilterOption(index);
              setOpen(false);
              router.push(`?activeTab=items&${filterType}=${item}`);
            }}
          >
            {item}
          </p>
        ))}
      </div>
    </div>
  );
}
