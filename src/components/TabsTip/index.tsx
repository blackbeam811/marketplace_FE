"use client";
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { Menu } from "./menu";
import { useSearchParams } from "next/navigation";

const TabsTip = () => {
  const param = useSearchParams();
  const search = param.get("tab");
  return (
    <div className="w-full border-b-[1px] border-gray-600 flex items-center justify-start gap-5">
      {Menu.map((item, index) => (
        <div
          className={`text-sm  ${
            item.param === search
              ? ` border-b-2 text-white font-bold`
              : "text-gray-400"
          } border-pink-600 cursor-pointer min-w-[60px] text-center`}
          key={index}
        >
          <Link href={item.link}>{item.title}</Link>
        </div>
      ))}
    </div>
  );
};

export default TabsTip;
