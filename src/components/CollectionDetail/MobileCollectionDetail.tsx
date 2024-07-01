/* eslint-disable @next/next/no-img-element */
import { useRef, useState } from "react";

import { BsTwitterX } from "react-icons/bs";
import { FaDiscord } from "react-icons/fa";

import { CollectionDetailProps } from "@/types/types";
import { ArrowIcon } from "../SvgIcons";
import { BiArrowFromLeft } from "react-icons/bi";
import { TiArrowSortedDown } from "react-icons/ti";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import { PINATA_URL } from "@/config";

export default function MobileCollectionDetail({
  collectionData,
}: CollectionDetailProps) {
  const elem = useRef(null);
  const [showDetail, setShowDetail] = useState(false);
  useOnClickOutside(elem, () => setShowDetail(false));

  return (
    <div
      className="md:hidden flex items-center justify-between gap-3 w-full md:w-auto px-2
    border-b border-customborder pb-1 relative"
      ref={elem}
    >
      <div
        className="flex items-center justify-start gap-2 w-full"
        onClick={() => setShowDetail(!showDetail)}
      >
        <div className="w-[25px] h-[25px] relative">
          <img
            src={PINATA_URL + collectionData?.imgUrl}
            alt="Avatar"
            className="rounded-full"
          />
        </div>
        <span className="text-white text-2xl">
          {collectionData?.collectionName}
        </span>
      </div>
      <span className={`duration-300 cursor-pointer`}>
        <TiArrowSortedDown color="white" />
      </span>
      <div
        className={`absolute z-[9999] p-4 top-[2.5rem] min-h-[60vh] bg-darkgreen rounded-b-md shadow-sm shadow-green-800 left-0 right-0 bottom-0 
        duration-200 origin-top`}
        style={{
          opacity: showDetail ? 1 : 0,
          scale: showDetail ? 1 : 0.6,
          pointerEvents: showDetail ? "all" : "none",
        }}
      >
        <div className="flex items-center justify-start">
          <div className="flex items-center justify-start gap-2 w-full">
            <div className="w-[50px] h-[50px] relative">
              <img
                src={PINATA_URL + collectionData?.imgUrl}
                alt="Avatar"
                className="rounded-full w-full h-full"
              />
            </div>
            <span className="text-white text-2xl">
              {collectionData?.collectionName}
            </span>
          </div>
          <div className="flex items-start justify-center flex-col">
            <div className="flex items-center justify-start gap-4">
              <span className="cursor-pointer hover:text-white text-gray-300 duration-300">
                <a
                  className={`${
                    collectionData?.discordLink === "" && "hidden"
                  }`}
                  href={collectionData?.discordLink}
                  target="_blank"
                  rel="referrer"
                >
                  <FaDiscord size={16} />
                </a>
              </span>
              <span className="cursor-pointer hover:text-white text-gray-300 duration-300">
                <a
                  className={`${
                    collectionData?.twitterLink === "" && "hidden"
                  }`}
                  href={collectionData?.twitterLink}
                  target="_blank"
                  rel="referrer"
                >
                  <BsTwitterX size={14} />
                </a>
              </span>
            </div>
          </div>
        </div>

        <div className="items-center justify-center grid grid-cols-3 md:gap-5 gap-4 md:ml-10 mt-3 w-full md:w-auto">
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
    </div>
  );
}
