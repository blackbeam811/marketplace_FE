/* eslint-disable @next/next/no-img-element */
"use client";

import { TabMenu } from "@/data/tabMenuData";
import { useRouter, useSearchParams } from "next/navigation";

export default function TabsTip() {
  const router = useRouter();
  const param = useSearchParams();
  const search = param.get("activeTab") || "items";

  return (
    <div className="w-full border-b-[1px] border-customborder md:flex items-center justify-start gap-5 hidden">
      {TabMenu.map((item, index) => (
        <div
          key={index}
          className={`min-w-[60px] text-center cursor-pointer ${
            item.param === search
              ? "border-b-2 text-white font-bold text-md"
              : "text-gray-400 text-sm"
          } border-yellow-600`}
          onClick={() => router.push(item.link)}
        >
          {item.title}
        </div>
      ))}
    </div>
  );
}
