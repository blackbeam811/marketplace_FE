"use client";
import { useRef, useState } from "react";
import { ArrowIcon } from "../SvgIcons";
import { Menu } from "./menu";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";

export default function CollectionFilterSelect() {
  const elem = useRef(null);
  const [open, setOpen] = useState(false);
  const [filterOption, setFilterOption] = useState(0);
  useOnClickOutside(elem, () => setOpen(false));

  return (
    <div className="relative">
      <div
        className="w-[160px] py-[5px] px-1 border-[1px] border-gray-600 rounded-md text-gray-300 text-md flex items-center justify-center gap-2 cursor-pointer
      hover:border-gray-400 duration-300"
        onClick={() => setOpen(!open)}
      >
        {Menu[filterOption]}
        <ArrowIcon />
      </div>
      <div
        className={`absolute top-10 w-[160px] min-h-[100px] rounded-md bg-gray-800 flex items-start justify-center flex-col gap-2 ${
          !open && "hidden"
        }`}
        ref={elem}
      >
        {Menu.map((item, index) => (
          <p
            className={`text-white cursor-pointer text-sm hover:bg-gray-700 w-full py-1 px-2 ${
              index === 0
                ? " rounded-t-md"
                : index === Menu.length - 1
                ? "rounded-b-md"
                : ""
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
