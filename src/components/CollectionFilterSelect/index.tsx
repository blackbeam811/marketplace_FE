"use client";
import { useRef, useState } from "react";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import { SelectPropsType } from "@/types/types";
import { ArrowIcon } from "../SvgIcons";

export default function CollectionFilterSelect({ options }: SelectPropsType) {
  const elem = useRef(null);
  const [open, setOpen] = useState(false);
  const [filterOption, setFilterOption] = useState(0);
  useOnClickOutside(elem, () => setOpen(false));

  return (
    <div className="relative">
      <div
        className="w-[160px] py-[5px] px-2 border border-customborder rounded-md text-gray-300 text-md flex items-center justify-between gap-2 cursor-pointer
      hover:border-gray-400 duration-300 text-sm"
        onClick={() => setOpen(!open)}
      >
        {options[filterOption]}
        <span className={`${open ? "-rotate-90" : "rotate-90"} duration-300`}>
          <ArrowIcon />
        </span>
      </div>
      <div
        className={`absolute top-10 w-[160px] min-h-[70px] rounded-md bg-green-950 flex items-start shadow-sm shadow-green-300 justify-between flex-col z-50 py-2 ${
          !open && "hidden"
        }`}
        ref={elem}
      >
        {options.map((item, index) => (
          <p
            className={`text-white cursor-pointer text-sm  ${
              item !== options[filterOption] && "hover:bg-green-500"
            } w-full py-2 px-2 ${
              item === options[filterOption] ? "bg-green-800" : "bg-green-950"
            }`}
            key={index}
            onClick={() => {
              setFilterOption(index);
              setOpen(false);
            }}
          >
            {item}
          </p>
        ))}
      </div>
    </div>
  );
}
