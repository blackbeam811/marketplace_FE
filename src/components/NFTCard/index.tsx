/* eslint-disable @next/next/no-img-element */
import { FC } from "react";
import { DetailIcon } from "../SvgIcons";

interface NFTCardType {
  imgUrl: string;
  tokenId: string;
  tokenAddr: string;
}
const NFTCard: FC<NFTCardType> = ({ imgUrl, tokenId, tokenAddr }) => {
  return (
    <div className="flex items-start justify-start flex-col gap-2 bg-gray-800 rounded-md pb-2">
      <div className="overflow-hidden rounded-t-md h-[230px]">
        <img
          src={imgUrl}
          alt="NFT Image"
          className="rounded-t-md hover:scale-105 duration-300 w-full"
        />
      </div>
      <div className="w-full flex items-center justify-between pr-2">
        <p className="text-white text-left px-2 text-sm">Mugs #{tokenId}</p>
        <div className="cursor-pointer rounded-md">
          <DetailIcon />
        </div>
      </div>
    </div>
  );
};

export default NFTCard;
