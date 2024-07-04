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
import { NFTDataContext } from "@/contexts/NFTDataContext";
import { useParams } from "next/navigation";
import { OwnNFTDataType } from "@/types/types";
import {
  DiscordSpinner,
  FoldingCubeSpinner,
  NormalSpinner,
} from "@/components/Spinners";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { LoadingContext } from "@/contexts/LoadingContext";
import {
  listPNftForSale,
  pNftDelist,
  purchasePNft,
  setPrice,
} from "@/utils/contractScript";
import { delistNft, listNft, purchaseNFT, updatePrice } from "@/utils/api";
import { ActivityContext } from "@/contexts/ActivityContext";
import { errorAlert, successAlert } from "@/components/ToastGroup";

const ItemDetails: NextPage = () => {
  const router = useParams();
  const { mintAddr } = router;
  const wallet = useAnchorWallet();

  const [openAboutTag, setOpenAboutTag] = useState(false);
  const [openOfferTable, setOpenOfferTable] = useState(false);
  const [openAttributeTag, setOpenAttributeTag] = useState(false);
  const [openDetailTag, setOpenDetailTag] = useState(false);
  const [openActivityTag, setOpenActivityTag] = useState(false);
  const [itemDetail, setItemDetail] = useState<OwnNFTDataType>();
  const [updatedPrice, setUpdatedPrice] = useState(0);

  const {
    ownNFTs,
    ownListedNFTs,
    listedAllNFTs,
    getAllListedNFTsBySeller,
    getAllListedNFTs,
    getOwnNFTs,
  } = useContext(NFTDataContext);
  const { openFunctionLoading, closeFunctionLoading } =
    useContext(LoadingContext);
  const { activityData, getAllActivityData } = useContext(ActivityContext);

  useEffect(() => {
    console.log("ownNFTs ==>", ownNFTs);
    console.log("listedAllNFTs ==>", listedAllNFTs);
    console.log("mintAddr ==>", mintAddr);
    if (ownNFTs.length === 0) {
      const item = listedAllNFTs.filter((items) => items.mintAddr === mintAddr);
      console.log("1");
      console.log("item ===>", item);
      setItemDetail(item[0]);
    } else {
      if (ownNFTs.some((items) => items.mintAddr === mintAddr)) {
        const item = ownNFTs.filter((items) => items.mintAddr === mintAddr);
        setItemDetail(item[0]);
        console.log("2");
      } else {
        const item = listedAllNFTs.filter(
          (items) => items.mintAddr === mintAddr
        );
        setItemDetail(item[0]);
        console.log("3");
      }
    }
  }, [ownNFTs, mintAddr, listedAllNFTs]);

  // NFT List Function
  const handlelistMyNFTFunc = async () => {
    if (wallet && itemDetail !== undefined) {
      if (updatedPrice === 0) {
        errorAlert("Please enter the price.");
      } else {
        try {
          openFunctionLoading();
          itemDetail.solPrice = updatedPrice;
          const tx = await listPNftForSale(wallet, [itemDetail]);
          if (tx) {
            const result = await listNft(tx.transactions, tx.listData);
            if (result.type === "success") {
              await getOwnNFTs();
              await getAllListedNFTsBySeller();
              await getAllActivityData();
              await getAllListedNFTs();
              closeFunctionLoading();
              successAlert("Success");
            } else {
              itemDetail.solPrice = 0;
              closeFunctionLoading();
              errorAlert("Something went wrong.");
            }
          } else {
            itemDetail.solPrice = 0;
            closeFunctionLoading();
            errorAlert("Something went wrong.");
          }
        } catch (e) {
          itemDetail.solPrice = 0;
          console.log("err =>", e);
          closeFunctionLoading();
          errorAlert("Something went wrong.");
        }
      }
    }
  };

  // NFT Delist Function
  const handleDelistMyNFTFunc = async () => {
    if (wallet && itemDetail !== undefined) {
      try {
        openFunctionLoading();
        const tx = await pNftDelist(wallet, [itemDetail]);
        if (tx) {
          const result = await delistNft(
            tx.transactions,
            tx.delistData,
            tx.mintAddrArray
          );
          if (result.type === "success") {
            await getOwnNFTs();
            await getAllListedNFTsBySeller();
            await getAllActivityData();
            await getAllListedNFTs();
            closeFunctionLoading();
            successAlert("Success");
          } else {
            closeFunctionLoading();
            errorAlert("Something went wrong.");
          }
        } else {
          closeFunctionLoading();
          errorAlert("Something went wrong.");
        }
      } catch (e) {
        console.log("err =>", e);
        errorAlert("Something went wrong.");
        closeFunctionLoading();
      }
    }
  };

  // Listed NFT Price Update Function
  const handleUpdatePriceFunc = async () => {
    if (wallet && itemDetail !== undefined) {
      if (updatedPrice === 0) errorAlert("Please enter the value.");
      try {
        openFunctionLoading();
        itemDetail.solPrice = updatedPrice;
        const tx = await setPrice(wallet, itemDetail);
        if (tx) {
          const result = await updatePrice(
            tx.transactions,
            tx.updatedPriceItems,
            tx.updatedPriceItems.mintAddr
          );
          if (result.type === "success") {
            await getOwnNFTs();
            await getAllListedNFTsBySeller();
            await getAllActivityData();
            await getAllListedNFTs();
            closeFunctionLoading();
            successAlert("Success");
          } else {
            closeFunctionLoading();
            errorAlert("Something went wrong.");
          }
        } else {
          closeFunctionLoading();
          errorAlert("Something went wrong.");
        }
      } catch (e) {
        console.log("err =>", e);
        errorAlert("Something went wrong.");
        closeFunctionLoading();
      }
    }
  };

  // Make Offer Function
  const handleMakeOffer = async () => {};

  // Buy NFT Function
  const handleBuyNFTFunc = async () => {
    if (wallet && itemDetail !== undefined) {
      try {
        openFunctionLoading();
        const tx = await purchasePNft(wallet, [itemDetail]);
        if (tx) {
          const result = await purchaseNFT(
            tx.transactions,
            tx.purchaseData,
            tx.mintAddrArray
          );
          if (result.type === "success") {
            await getOwnNFTs();
            await getAllListedNFTsBySeller();
            await getAllActivityData();
            await getAllListedNFTs();
            closeFunctionLoading();
            successAlert("Success");
          } else {
            closeFunctionLoading();
            errorAlert("Something went wrong.");
          }
        } else {
          closeFunctionLoading();
          errorAlert("Something went wrong.");
        }
      } catch (e) {
        console.log("err =>", e);
        errorAlert("Something went wrong.");
        closeFunctionLoading();
      }
    }
  };

  return (
    <MainPageLayout>
      <div
        className={`w-full flex items-center justify-center min-h-screen ${
          itemDetail !== undefined && "hidden"
        }`}
      >
        <NormalSpinner width={7} height={7} />
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
            <div className="w-full flex items-start justify-start gap-2 rounded-md bg-darkgreen border border-customborder flex-col p-3">
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
              <p
                className={`text-left text-white text-xl ${
                  itemDetail?.solPrice === 0 && "hidden"
                }`}
              >
                Listed Price : {itemDetail?.solPrice}
                {" sol"}
              </p>
              <div className="w-full flex items-center justify-between gap-2">
                <input
                  className="w-full p-2 flex items-center placeholder:text-gray-500 outline-none text-white justify-between rounded-md border border-customborder bg-transparent"
                  placeholder="Input the price"
                  type="number"
                  onChange={(e) => {
                    setUpdatedPrice(Number(e.target.value));
                  }}
                />
                <div
                  className={`w-full rounded-md py-2 text-center bg-yellow-600 duration-200 hover:bg-yellow-700 text-white cursor-pointer flex items-center gap-2 justify-center ${
                    itemDetail?.solPrice === 0 && "hidden"
                  }`}
                  onClick={
                    wallet?.publicKey.toBase58() === itemDetail?.seller
                      ? handleUpdatePriceFunc
                      : handleMakeOffer
                  }
                >
                  {wallet?.publicKey.toBase58() === itemDetail?.seller
                    ? "Update Price"
                    : "Make Offer"}
                </div>
              </div>

              <div
                className={`w-full rounded-md py-2 text-center bg-yellow-600 duration-200 hover:bg-yellow-700 text-white cursor-pointer
                  ${
                    wallet?.publicKey.toBase58() !== itemDetail?.seller &&
                    "hidden"
                  }`}
                onClick={
                  itemDetail?.solPrice === 0
                    ? handlelistMyNFTFunc
                    : handleDelistMyNFTFunc
                }
              >
                {itemDetail?.solPrice === 0 &&
                wallet?.publicKey.toBase58() === itemDetail.seller
                  ? "List Now"
                  : "Delist now"}
              </div>

              <div
                className={`w-full rounded-md py-2 text-center bg-yellow-600 duration-200 hover:bg-yellow-700 text-white cursor-pointer
                  ${
                    wallet?.publicKey.toBase58() === itemDetail?.seller &&
                    "hidden"
                  }`}
                onClick={handleBuyNFTFunc}
              >
                {"Buy now"}
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
                    itemDetail.seller.slice(0, 4) +
                      " ... " +
                      itemDetail.seller.slice(-4)}
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
            {/* <ActivityTable /> */}
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
            {/* <ActivityTable /> */}
          </div>
        </div>
      </div>
    </MainPageLayout>
  );
};

export default ItemDetails;
