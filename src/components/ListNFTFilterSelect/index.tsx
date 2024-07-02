"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function ListNFTFilterSelect() {
  const router = useRouter();
  const [showNFTState, setShowNFTState] = useState(0);
  const param = useSearchParams();
  const search = param.get("activeTab") || "items";
  return (
    <div
      className={`flex border rounded-full border-customborder ${
        search !== "items" && "hidden"
      }`}
    >
      <div
        className={`${
          showNFTState === 0 && "bg-yellow-600 "
        } rounded-full cursor-pointer text-white py-1 px-3 text-[13px]`}
        onClick={() => {
          setShowNFTState(0);
          router.push("?activeTab=items&show=unlisted");
        }}
      >
        Unlisted
      </div>
      <div
        className={`${
          showNFTState === 1 && "bg-yellow-600 "
        } rounded-full cursor-pointer text-white py-1 px-3 text-[13px]`}
        onClick={() => {
          setShowNFTState(1);
          router.push("?activeTab=items&show=listed");
        }}
      >
        Listed
      </div>
    </div>
  );
}
