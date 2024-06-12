"use client";

import { NFTDataContext } from "@/contexts/NFTDataContext";
import { useContext } from "react";

export default function NFTItemSkeleton() {
  const { getOwnNFTsState } = useContext(NFTDataContext);
  return (
    <div className="w-full flex items-center justify-start">
      <div
        className={`items-start justify-start w-full grid 2xl:grid-cols-8 xl:grid-cols-7 md:grid-cols-5 lg:grid-cols-6 sm:grid-cols-3 grid-cols-2 gap-5 ${
          !getOwnNFTsState && "hidden"
        }`}
      >
        <div className="w-full aspect-square animate-pulse bg-gray-600 rounded-md" />
        <div className="w-full aspect-square animate-pulse bg-gray-600 rounded-md" />
        <div className="w-full aspect-square animate-pulse bg-gray-600 rounded-md" />
        <div className="w-full aspect-square animate-pulse bg-gray-600 rounded-md" />
      </div>
    </div>
  );
}
