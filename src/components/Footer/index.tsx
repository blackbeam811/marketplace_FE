"use client";
import { NFTDataContext } from "@/contexts/NFTDataContext";
import Image from "next/image";
import { useContext } from "react";

export default function Footer() {
  const { solPrice } = useContext(NFTDataContext);
  return (
    <div className="w-full fixed bottom-0 left-0 right-0 border-t-[1px] border-customborder z-50 bg-darkgreen p-2">
      <div className="w-full flex items-end justify-end">
        <div className="flex items-center justify-center gap-1">
          <div className="w-[14px] h-[14px] relative">
            <Image
              src="/svgs/solana-sol-logo.svg"
              alt="Avatar"
              fill
              className=""
            />
          </div>
          <span className="text-white text-sm leading-[1] font-bold">
            $ {solPrice?.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
