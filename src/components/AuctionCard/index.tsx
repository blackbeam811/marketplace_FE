/* eslint-disable @next/next/no-img-element */
import { FC } from "react";
import { AuctionNFTCardType, NFTCardType } from "@/types/types";
import { CgCheck } from "react-icons/cg";
import { BiPlus } from "react-icons/bi";
import { VscScreenFull } from "react-icons/vsc";
import { ModalContext } from "@/contexts/ModalContext";
import { useContext } from "react";
import Countdown from "../CountDown";
import Link from "next/link";

const AuctionCard: FC<AuctionNFTCardType> = ({
  imgUrl,
  tokenId,
  mintAddr,
  collectionName,
  solPrice,
  endTime,
  state,
}) => {
  const { openNFTDetailModal } = useContext(ModalContext);

  return (
    <div
      className={`flex items-start justify-start flex-col gap-2 bg-[#0f4223b9] md:min-h-[250px] min-h-[230px] rounded-md pb-2 `}
    >
      <div className="overflow-hidden rounded-t-md aspect-square cursor-pointer group relative">
        <Link href={`/item-details/${mintAddr}?type=auction`}>
          <img
            src={imgUrl}
            alt="NFT Image"
            className="rounded-t-md hover:scale-105 duration-300 w-full"
          />
        </Link>
      </div>
      <div className="w-full flex items-center justify-between pr-2 flex-col bottom-0">
        <div className="w-full flex items-center justify-between">
          <p className="text-gray-300 text-left px-2 text-sm uppercase">
            {state}
          </p>
          <p
            className={`text-gray-100 text-left px-2 text-md uppercase ${
              state === "unlisted" && "hidden"
            }`}
          >
            {solPrice} sol
          </p>
        </div>
        <div className="w-full flex items-center justify-between">
          <p className="text-white text-left px-2 text-md">
            {collectionName} #{tokenId}
          </p>
          <span className="rounded-md text-gray-300 pr-1 hover:text-white duration-300">
            <Countdown timestamp={endTime!} />
          </span>
        </div>
      </div>
    </div>
  );
};

export default AuctionCard;
