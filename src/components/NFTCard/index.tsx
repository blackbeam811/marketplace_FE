/* eslint-disable @next/next/no-img-element */
import { FC } from "react";
import { NFTCardType } from "@/types/types";
import { CgCheck } from "react-icons/cg";
import { BiPlus } from "react-icons/bi";
import { VscScreenFull } from "react-icons/vsc";
import { ModalContext } from "@/contexts/ModalContext";
import { useContext } from "react";

interface NFTCardProps extends NFTCardType {
  isSelected: boolean;
  toggleSelection: () => void;
}

const NFTCard: FC<NFTCardProps> = ({
  imgUrl,
  tokenId,
  mintAddr,
  collectionName,
  solPrice,
  state,
  isSelected,
  toggleSelection,
}) => {
  const { openNFTDetailModal } = useContext(ModalContext);

  return (
    <div
      className={`flex items-start justify-start flex-col gap-2 bg-[#0f4223b9] md:min-h-[250px] min-h-[230px] rounded-md pb-2 border ${
        isSelected ? "border-yellow-500" : "border-customborder"
      }`}
    >
      <div
        className="overflow-hidden rounded-t-md aspect-square cursor-pointer group relative"
        onClick={toggleSelection}
      >
        <img
          src={imgUrl}
          alt="NFT Image"
          className="rounded-t-md hover:scale-105 duration-300 w-full"
        />
        <div
          className={`absolute top-2 right-2 p-1 rounded-full ${
            isSelected ? "bg-yellow-600" : "bg-gray-800 bg-opacity-80"
          } group-hover:block ${isSelected ? "block" : "hidden"}`}
        >
          {isSelected ? (
            <CgCheck color="white" size={18} />
          ) : (
            <BiPlus color="white" size={17} />
          )}
        </div>
      </div>
      <div className="w-full flex items-center justify-between pr-2 flex-col">
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
          <span
            className="cursor-pointer rounded-md text-gray-300 hover:text-white duration-300"
            onClick={() => openNFTDetailModal(mintAddr, mintAddr)}
          >
            <VscScreenFull size={22} />
          </span>
        </div>
      </div>
    </div>
  );
};

export default NFTCard;
