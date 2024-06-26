/* eslint-disable @next/next/no-img-element */

"use client";
import { useContext, useEffect, useMemo, useState } from "react";
import { NextPage } from "next";
import Image from "next/image";

import { TfiAnnouncement } from "react-icons/tfi";
import { MdOutlineSecurity } from "react-icons/md";
import { BiDetail } from "react-icons/bi";
import { BiLineChart } from "react-icons/bi";
import { MdOutlineLocalOffer } from "react-icons/md";

import MainPageLayout from "@/components/Layout";
import { ArrowIcon } from "@/components/SvgIcons";
import ActivityTable from "@/components/ActivityTable";
import MobileItemMultiSelectBar from "@/components/ItemMultiSelectBar/MobileItemMultiSelectBar";
import MobileTabsTip from "@/components/TabsTip/MobileTabsTip";
import { NFTDataContext } from "@/contexts/NFTDataContext";
import { useParams } from "next/navigation";
import { OwnNFTDataType } from "@/types/types";
import { DiscordSpinner, FoldingCubeSpinner } from "@/components/Spinners";

const ItemDetails: NextPage = () => {
  const router = useParams();
  const { mintAddr } = router;

  const [openAboutTag, setOpenAboutTag] = useState(false);
  const [openOfferTable, setOpenOfferTable] = useState(false);
  const [openAttributeTag, setOpenAttributeTag] = useState(false);
  const [openDetailTag, setOpenDetailTag] = useState(false);
  const [openActivityTag, setOpenActivityTag] = useState(false);
  const [itemDetail, setItemDetail] = useState<OwnNFTDataType | undefined>(
    undefined
  );

  const { getOwnNFTs, ownNFTs } = useContext(NFTDataContext);

  const item = useMemo(() => {
    if (ownNFTs.length !== 0 && mintAddr !== "") {
      return ownNFTs.filter((items) => items.mintAddr === mintAddr);
    }
  }, [ownNFTs, mintAddr]);

  useEffect(() => {
    if (item && item.length !== 0) {
      console.log("item =>", item);
      setItemDetail(item[0]);
    }
  }, [item]);

  return (
    <MainPageLayout>
      <div
        className={`w-full flex items-center justify-center min-h-screen ${
          itemDetail !== undefined && "hidden"
        }`}
      >
        <DiscordSpinner />
      </div>
      <div
        className={`w-full max-w-[1240px] pt-3 pb-12 relative ${
          itemDetail === undefined && "hidden"
        }`}
      >
        <div className="w-full grid lg:grid-cols-2 grid-cols-1 gap-5 lg:gap-10 md:p-10 p-3 relative">
          <div className="w-full flex items-start justify-center">
            <div className="lg:w-[450px] relative xl:w-full w-[350px] md:w-[450px] aspect-square cursor-pointer">
              <img
                src={itemDetail?.imgUrl}
                className="rounded-lg object-cover w-full h-full"
                alt=""
              />
            </div>
          </div>
          <div className="w-full flex flex-col justify-start items-start gap-2">
            <div className="flex flex-col gap-1">
              <h1 className="text-white text-2xl">
                {itemDetail && itemDetail.collectionName}
              </h1>
              <p className="text-yellow-500 texl-md">
                {itemDetail && itemDetail.collectionName} #73
              </p>
            </div>
            <div className="w-full flex items-center justify-start gap-2 rounded-md bg-darkgreen border border-customborder flex-col p-3">
              {/* <div className="w-full flex items-center justify-between">
                <p className="md:text-md text-sm text-gray-300">List Price</p>
                <span className="md:text-md text-sm text-white">5.614 Sol</span>
              </div>
              <div className="w-full flex items-center justify-between">
                <p className="md:text-md text-sm text-gray-300">Taker Price</p>
                <span className="md:text-md text-sm text-white">5.614 Sol</span>
              </div>
              <div className="w-full flex items-center justify-between">
                <p className="md:text-md text-sm text-gray-300">
                  Royalty Price
                </p>
                <span className="md:text-md text-sm text-white">5.614 Sol</span>
              </div>
              <div className="w-full flex items-center justify-between">
                <p className="md:text-3xl text-xl text-gray-300">Total Price</p>
                <span className="md:text-3xl text-xl text-white">
                  5.614 Sol
                </span>
              </div> */}
              <input
                className="w-full p-3 flex items-center placeholder:text-gray-500 outline-none text-white justify-between rounded-md border border-customborder bg-transparent"
                placeholder="Input the price"
                type="number"
              />
              <div className="w-full rounded-md py-2 text-center bg-yellow-600 duration-300 hover:bg-yellow-700 text-white cursor-pointer">
                Buy now
              </div>
            </div>

            <div
              className="w-full p-3 flex items-center justify-between rounded-md border border-customborder cursor-pointer"
              onClick={() => setOpenAboutTag(!openAboutTag)}
            >
              <span className="text-white font-bold text-md flex items-center justify-center gap-2">
                <TfiAnnouncement color="#EAB308" />
                Description
              </span>
              <span
                className={`duration-300 ${
                  openAboutTag ? "-rotate-90" : "rotate-90"
                }`}
              >
                <ArrowIcon />
              </span>
            </div>
            <div
              className={`w-full p-3 flex items-center justify-between rounded-md border border-customborder cursor-pointer text-sm text-gray-200 ${
                !openAboutTag && "hidden"
              }`}
            >
              {itemDetail && itemDetail?.description}
            </div>

            <div
              className="w-full p-3 flex items-center justify-between rounded-md border border-customborder cursor-pointer"
              onClick={() => setOpenAttributeTag(!openAttributeTag)}
            >
              <span className="text-white font-bold text-md flex items-center justify-center gap-2">
                <MdOutlineSecurity color="#EAB308" size={18} />
                Attributes
              </span>
              <span
                className={`duration-300 ${
                  openAttributeTag ? "-rotate-90" : "rotate-90"
                }`}
              >
                <ArrowIcon />
              </span>
            </div>
            <div
              className={`w-full p-3 grid grid-cols-3 gap-3 rounded-md border border-customborder ${
                !openAttributeTag && "hidden"
              }`}
            >
              {itemDetail &&
                itemDetail.attribute.map((detail, index) => (
                  <div
                    className="rounded-md bg-darkgreen border border-customborder p-2"
                    key={index}
                  >
                    <p className="text-gray-400 text-sm">{detail.trait_type}</p>
                    <span className="text-white text-lg">{detail.value}</span>
                  </div>
                ))}
            </div>

            <div
              className="w-full p-3 flex items-center justify-between rounded-md border border-customborder cursor-pointer"
              onClick={() => setOpenDetailTag(!openDetailTag)}
            >
              <span className="text-white font-bold text-md flex items-center justify-center gap-2">
                <BiDetail color="#EAB308" size={19} />
                Detail
              </span>
              <span
                className={`duration-300 ${
                  openDetailTag ? "-rotate-90" : "rotate-90"
                }`}
              >
                <ArrowIcon />
              </span>
            </div>
            <div
              className={`w-full p-3 flex items-center justify-between flex-col gap-1 rounded-md border border-customborder cursor-pointer text-gray-400 ${
                !openDetailTag && "hidden"
              }`}
            >
              {" "}
              <div className="w-full flex items-center justify-between">
                <span>Mint Address</span>
                <span className="text-white">
                  {itemDetail &&
                    itemDetail.mintAddr.slice(0, 4) +
                      " ... " +
                      itemDetail.mintAddr.slice(-4)}
                </span>
              </div>
              <div className="w-full flex items-center justify-between">
                <span>OnChain Collection</span>
                <span className="text-white">
                  {" "}
                  {itemDetail &&
                    itemDetail.collectionAddr.slice(0, 4) +
                      " ... " +
                      itemDetail.collectionAddr.slice(-4)}
                </span>
              </div>
              <div className="w-full flex items-center justify-between">
                <span>Owner</span>
                <span className="text-white">
                  {" "}
                  {itemDetail &&
                    itemDetail.owner.slice(0, 4) +
                      " ... " +
                      itemDetail.owner.slice(-4)}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full flex items-center justify-center gap-2 flex-col md:px-10 px-3">
          <div
            className="w-full p-3 flex items-center justify-between rounded-md border border-customborder cursor-pointer "
            onClick={() => setOpenOfferTable(!openOfferTable)}
          >
            <span className="text-white font-bold text-md flex items-center justify-center gap-2">
              <MdOutlineLocalOffer color="#EAB308" size={20} />
              Offers
            </span>
            <span
              className={`duration-300 ${
                openOfferTable ? "-rotate-90" : "rotate-90"
              }`}
            >
              <ArrowIcon />
            </span>
          </div>
          <div className={`w-full ${!openOfferTable && "hidden"}`}>
            <ActivityTable />
          </div>
        </div>
        <div className="w-full flex items-center justify-center gap-2 flex-col md:px-10 px-3 mt-3">
          <div
            className="w-full p-3 flex items-center justify-between rounded-md border border-customborder cursor-pointer "
            onClick={() => setOpenActivityTag(!openActivityTag)}
          >
            <span className="text-white font-bold text-md flex items-center justify-center gap-2">
              <BiLineChart color="#EAB308" size={20} />
              Activities
            </span>
            <span
              className={`duration-300 ${
                openActivityTag ? "-rotate-90" : "rotate-90"
              }`}
            >
              <ArrowIcon />
            </span>
          </div>
          <div className={`w-full ${!openActivityTag && "hidden"}`}>
            <ActivityTable />
          </div>
        </div>
      </div>
    </MainPageLayout>
  );
};

export default ItemDetails;
