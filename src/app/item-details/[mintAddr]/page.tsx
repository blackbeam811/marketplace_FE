"use client";
import { useState } from "react";
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

const ItemDetails: NextPage = () => {
  const [openAboutTag, setOpenAboutTag] = useState(false);
  const [openOfferTable, setOpenOfferTable] = useState(false);
  const [openAttributeTag, setOpenAttributeTag] = useState(false);
  const [openDetailTag, setOpenDetailTag] = useState(false);
  const [openActivityTag, setOpenActivityTag] = useState(false);

  return (
    <MainPageLayout>
      <div className={`w-full max-w-[1240px] pt-3 pb-12`}>
        <div className="w-full grid md:grid-cols-2 grid-cols-1 gap-5 lg:gap-10 md:p-10 p-3">
          <div className="lg:w-full relative lg:h-[450px] xl:h-[550px] h-[350px] cursor-pointer">
            <Image
              src={"/images/collectionSliderImgs/4.png"}
              fill
              className="rounded-lg object-cover"
              alt=""
            />
          </div>
          <div className="w-full flex flex-col justify-start items-start gap-2">
            <div className="flex flex-col gap-1">
              <h1 className="text-white text-2xl">Validat3rs #73</h1>
              <p className="text-yellow-500 texl-md">Validat3rs #73</p>
            </div>
            <div className="w-full flex items-center justify-start gap-2 rounded-md bg-darkgreen border border-customborder min-h-[200px] flex-col p-3">
              <div className="w-full flex items-center justify-between">
                <p className="text-md text-gray-300">List Price</p>
                <span className="text-md text-white">5.614 Sol</span>
              </div>
              <div className="w-full flex items-center justify-between">
                <p className="text-md text-gray-300">Taker Price</p>
                <span className="text-md text-white">5.614 Sol</span>
              </div>
              <div className="w-full flex items-center justify-between">
                <p className="text-md text-gray-300">Royalty Price</p>
                <span className="text-md text-white">5.614 Sol</span>
              </div>
              <div className="w-full flex items-center justify-between">
                <p className="text-2xl text-gray-300">Total Price</p>
                <span className="text-2xl text-white">5.614 Sol</span>
              </div>
              <div className="w-full rounded-md py-2 text-center bg-yellow-600 text-white cursor-pointer">
                Buy now
              </div>
            </div>

            <div
              className="w-full p-3 flex items-center justify-between rounded-md border border-customborder cursor-pointer"
              onClick={() => setOpenAboutTag(!openAboutTag)}
            >
              <span className="text-white font-bold text-md flex items-center justify-center gap-2">
                <TfiAnnouncement color="#EAB308" />
                About Validat3rs
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
              className={`w-full p-3 flex items-center justify-between rounded-md border border-customborder cursor-pointer text-gray-400 ${
                !openAboutTag && "hidden"
              }`}
            >
              Validat3rs NFT provides access to top-tier RPC nodes on the Solana
              blockchain, optimized for speed and efficiency.
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
              <div className="rounded-md bg-darkgreen border border-customborder p-2">
                <p className="text-gray-400">Renewed</p>
                <span className="text-white">False</span>
              </div>
              <div className="rounded-md bg-darkgreen border border-customborder p-2">
                <p className="text-gray-400">Renewed</p>
                <span className="text-white">False</span>
              </div>
              <div className="rounded-md bg-darkgreen border border-customborder p-2">
                <p className="text-gray-400">Renewed</p>
                <span className="text-white">False</span>
              </div>
              <div className="rounded-md bg-darkgreen border border-customborder p-2">
                <p className="text-gray-400">Renewed</p>
                <span className="text-white">False</span>
              </div>
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
                <span className="text-white">9e2tgt..23fgdrg2</span>
              </div>
              <div className="w-full flex items-center justify-between">
                <span>OnChain Collection</span>
                <span className="text-white">9e2tgt..23fgdrg2</span>
              </div>
              <div className="w-full flex items-center justify-between">
                <span>Token Address</span>
                <span className="text-white">9e2tgt..23fgdrg2</span>
              </div>
              <div className="w-full flex items-center justify-between">
                <span>Owner</span>
                <span className="text-white">9e2tgt..23fgdrg2</span>
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
