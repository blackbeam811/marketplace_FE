import Image from "next/image";

import { BsTwitterX } from "react-icons/bs";
import { FaDiscord } from "react-icons/fa";

import { CollectionDetailProps } from "@/types/types";

export default function CollectionDetail({
  collectionData,
}: CollectionDetailProps) {
  return (
    <div className="md:flex items-start justify-center md:justify-start gap-3 md:flex-row flex-col w-full md:w-auto px-2 hidden">
      <div className="flex items-center justify-start gap-5 w-full">
        <div className="w-[75px] h-[75px] relative">
          <Image
            src={collectionData?.imgUrl}
            alt="Avatar"
            fill
            className="rounded-full"
          />
        </div>
        <div className="flex items-start justify-center flex-col">
          <span className="text-white text-2xl">{collectionData?.name}</span>
          <div className="flex items-center justify-start gap-4">
            <span className="cursor-pointer hover:text-white text-gray-300 duration-300">
              <FaDiscord size={16} />
            </span>
            <span className="cursor-pointer hover:text-white text-gray-300 duration-300">
              <BsTwitterX size={14} />
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center md:justify-start justify-between md:gap-5 gap-4 md:ml-10 mt-3 w-full md:w-auto">
        <div className="flex items-start justify-center flex-col gap-2 w-[70px]">
          <p className="text-[12px] text-gray-200">Floor Price</p>
          <span className="text-white text-sm md:text-lg">123 Sol</span>
        </div>
        <div className="flex items-start justify-center flex-col gap-2 w-[70px]">
          <p className="text-[12px] text-gray-200">Top Offer</p>
          <span className="text-white text-sm md:text-lg">68.25 Sol</span>
        </div>
        <div className="flex items-start justify-center flex-col gap-2 w-[70px]">
          <p className="text-[12px] text-gray-200">24h Vol</p>
          <span className="text-white text-sm md:text-lg">447.6</span>
        </div>
        <div className="flex items-start justify-center flex-col gap-2 w-[70px]">
          <p className="text-[12px] text-gray-200">24h Sales</p>
          <span className="text-white text-sm md:text-lg">5</span>
        </div>
        <div className="flex items-start justify-center flex-col gap-2 w-[70px]">
          <p className="text-[12px] text-gray-200">Owners</p>
          <span className="text-white text-sm md:text-lg">71</span>
        </div>
      </div>
    </div>
  );
}
