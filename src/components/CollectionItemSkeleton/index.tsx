"use client";

import { NFTDataContext } from "@/contexts/NFTDataContext";
import { useContext } from "react";

export default function CollectionItemSkeleton() {
  const { getOwnNFTsState } = useContext(NFTDataContext);

  return (
    <div
      className={`items-start justify-start w-full grid grid-cols-2 md:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5 ${
        !getOwnNFTsState && "hidden"
      }`}
    >
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          className="w-full md:h-[250px] h-[200px] animate-pulse bg-green-900 rounded-md"
        />
      ))}
    </div>
  );
}
