/* eslint-disable @next/next/no-img-element */
import { FC } from "react";
import { DetailIcon } from "../SvgIcons";
import { TbListDetails } from "react-icons/tb";
import Link from "next/link";
import { useWindowSize } from "@/hooks/useWindowSize";

interface NFTCardType {
  imgUrl: string;
  tokenId: string;
  tokenAddr: string;
}
const NFTCard: FC<NFTCardType> = ({ imgUrl, tokenId, tokenAddr }) => {
  const { width } = useWindowSize();

  return (
    <div className="flex items-start justify-start flex-col gap-2 bg-gray-800 rounded-md pb-2">
      <div className="overflow-hidden rounded-t-md md:h-[210px] h-[180px]">
        <img
          src={imgUrl}
          alt="NFT Image"
          className="rounded-t-md hover:scale-105 duration-300 w-full"
        />
      </div>
      <div className="w-full flex items-center justify-between pr-2">
        <p className="text-white text-left px-2 text-sm">Mugs #{tokenId}</p>
        <span className="cursor-pointer rounded-md text-gray-400 hover:text-white duration-300">
          <Link
            href={"/item-details/0xed5af388653567af2f388e6224dc7c4b3244c544"}
          >
            <TbListDetails size={20} />
          </Link>
        </span>
      </div>
    </div>
  );
};

export default NFTCard;
