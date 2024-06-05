/* eslint-disable @next/next/no-img-element */
import { FC, useContext, useState } from "react";
import { TbListDetails } from "react-icons/tb";
import Link from "next/link";
import { NFTCardType } from "@/types/types";
import { PiPlus } from "react-icons/pi";
import { CgCheck } from "react-icons/cg";
import { BiPlus } from "react-icons/bi";
import { VscScreenFull } from "react-icons/vsc";
import { ModalContext } from "@/contexts/ModalContext";

const NFTCard: FC<NFTCardType> = ({ imgUrl, tokenId, mintAddr }) => {
  const { openNFTDetailModal } = useContext(ModalContext);
  const [seleted, setSeleted] = useState(false);
  return (
    <>
      <div
        className={`flex items-start justify-start flex-col gap-2 bg-gray-800 rounded-md pb-2 border-[1px] ${
          seleted ? "border-pink-600" : "border-gray-700"
        }`}
      >
        <div
          className="overflow-hidden rounded-t-md md:h-[230px] h-[170px] sm:h-[180px] cursor-pointer group relative"
          onClick={() => setSeleted(!seleted)}
        >
          <img
            src={imgUrl}
            alt="NFT Image"
            className="rounded-t-md hover:scale-105 duration-300 w-full"
          />
          <div
            className={`absolute top-2 right-2 p-1 rounded-full ${
              seleted ? "bg-pink-500" : "bg-gray-700"
            } group-hover:block ${seleted ? "block" : "hidden"}`}
          >
            {seleted ? (
              <CgCheck color="white" size={18} />
            ) : (
              <BiPlus color="white" size={17} />
            )}
          </div>
        </div>
        <div className="w-full flex items-center justify-between pr-2">
          <p className="text-white text-left px-2 text-lg">Mugs #{tokenId}</p>
          {/* <span className="cursor-pointer rounded-md text-gray-400 hover:text-white duration-300">
          <Link
            href={"/item-details/0xed5af388653567af2f388e6224dc7c4b3244c544"}
          >
            <VscScreenFull size={22} />
          </Link>
        </span> */}
          <span
            className="cursor-pointer rounded-md text-gray-400 hover:text-white duration-300"
            onClick={() => openNFTDetailModal(mintAddr, mintAddr)}
          >
            <VscScreenFull size={22} />
          </span>
        </div>
      </div>
    </>
  );
};

export default NFTCard;
