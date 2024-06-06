"use client";
import { useWallet } from "@solana/wallet-adapter-react";
import Image from "next/image";
import { BsTwitterX } from "react-icons/bs";
import { FaDiscord } from "react-icons/fa";

export default function MyItemDetail() {
  const { publicKey } = useWallet();
  return (
    <div className="flex items-start justify-center gap-3 md:flex-row flex-col">
      <div className="flex items-center justify-center gap-2">
        <div className="w-[68px] h-[68px] relative">
          <Image
            src={"/svgs/initialAvatar.svg"}
            alt="Avatar"
            fill
            className="rounded-full"
          />
        </div>
        <div className="flex items-center justify-center gap-2 bg-transparent px-3 rounded-full py-1 border border-customborder">
          <div className="w-[18px] h-[18px] relative">
            <Image
              src="/svgs/solana-sol-logo.svg"
              alt="Avatar"
              fill
              className=""
            />
          </div>
          <span className="text-white text-sm mt-[1px]">
            {publicKey?.toString().slice(0, 4) +
              "...." +
              publicKey?.toString().slice(-4)}
          </span>
        </div>
        <div className="flex items-start justify-center flex-col">
          <div className="flex items-center justify-start gap-4">
            <span className="cursor-pointer hover:text-white text-gray-300 duration-300 border border-customborder rounded-full px-3 py-1">
              <FaDiscord size={14} />
            </span>
            <span className="cursor-pointer hover:text-white text-gray-300 duration-300 border border-customborder rounded-full px-3 py-1">
              <BsTwitterX size={12} />
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center md:justify-start justify-between md:gap-10 gap-7 md:ml-10 mt-3 w-full md:w-auto">
        <div className="flex items-start justify-center flex-col gap-2">
          <p className="text-[12px] text-gray-400">Portfolio Value</p>
          <span className="text-white text-sm">123 Sol</span>
        </div>
        <div className="flex items-start justify-center flex-col gap-2">
          <p className="text-[12px] text-gray-400">Total Cost</p>
          <span className="text-white text-sm">68.25 Sol</span>
        </div>
      </div>
    </div>
  );
}
