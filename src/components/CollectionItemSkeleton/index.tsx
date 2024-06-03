"use client";

import { NFTDataContext } from "@/contexts/NFTDataContext";
import { useContext, useEffect, useState } from "react";

export default function CollectionItemSkeleton() {
  const { getOwnNFTsState } = useContext(NFTDataContext);

  //   const [getOwnNFTsState, setGetOwnNFTsState] = useState(true);
  //   useEffect(() => {
  //     const timer = setInterval(() => {
  //       setGetOwnNFTsState(false);
  //     }, 3000);

  //     return () => clearInterval(timer);
  //   }, []);
  return (
    <div
      className={`items-start justify-start w-full grid 2xl:grid-cols-8 xl:grid-cols-7 md:grid-cols-5 lg:grid-cols-6 sm:grid-cols-3 grid-cols-2 gap-5 ${
        !getOwnNFTsState && "hidden"
      }`}
    >
      <div className="w-full h-[230px] animate-pulse bg-gray-600 rounded-md" />
      <div className="w-full h-[230px] animate-pulse bg-gray-600 rounded-md" />
      <div className="w-full h-[230px] animate-pulse bg-gray-600 rounded-md" />
      <div className="w-full h-[230px] animate-pulse bg-gray-600 rounded-md" />
      <div className="w-full h-[230px] animate-pulse bg-gray-600 rounded-md" />
    </div>
  );
}
