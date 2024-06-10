"use client";

import { NFTDataContext } from "@/contexts/NFTDataContext";
import { useContext } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function CollectionItemSkeleton() {
  const { getOwnNFTsState } = useContext(NFTDataContext);
  const router = useRouter();
  const param = useSearchParams();
  const search = param.get("activeTab") || "items";

  return (
    <div
      className={`items-start justify-start w-full grid grid-cols-2 md:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5 px-2 ${
        (!getOwnNFTsState || search !== "items") && "hidden"
      }`}
    >
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          className="w-full aspect-[5/6] animate-pulse bg-green-900 rounded-md"
        />
      ))}
    </div>
  );
}
