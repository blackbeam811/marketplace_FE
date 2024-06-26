/* eslint-disable @next/next/no-img-element */
"use client";
import { Suspense, useContext, useMemo } from "react";
import { NextPage } from "next";
import { useSearchParams } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";

import { BiSearch } from "react-icons/bi";

import MainPageLayout from "@/components/Layout";
import TabsTip from "@/components/TabsTip";
import CollectionItemSkeleton from "@/components/CollectionItemSkeleton";
import NFTCard from "@/components/NFTCard";
import CollectionFilterSelect from "@/components/CollectionFilterSelect";
import MyItemDetail from "@/components/MyItemDetail";
import { NFTDataContext } from "@/contexts/NFTDataContext";
import ActivityTable from "@/components/ActivityTable";
import ActivityFilterSelect from "@/components/ActivityFilterSelect";
import OfferFilterSelect from "@/components/OfferFilterSelect";

import {
  collectionFilterOptions,
  myItemFilterOptions,
} from "@/data/selectTabData";
import MobileItemMultiSelectBar from "@/components/ItemMultiSelectBar/MobileItemMultiSelectBar";
import MobileTabsTip from "@/components/TabsTip/MobileTabsTip";
import ItemMultiSelectbar from "@/components/ItemMultiSelectBar";

const MyItem: NextPage = () => {
  const param = useSearchParams();
  const search = param.get("activeTab") || "items";
  const { publicKey, connected } = useWallet();
  const { ownNFTs, getOwnNFTsState } = useContext(NFTDataContext);

  const memoizedOwnNFTs = useMemo(() => ownNFTs, [ownNFTs]);

  return (
    <MainPageLayout>
      <div
        className={`w-full flex items-start justify-start flex-row ${
          !connected && "hidden"
        }`}
      >
        <div className="w-full flex items-start justify-start mt-5 gap-4 flex-col px-2">
          <MyItemDetail />
          <TabsTip />
          <div className="w-full flex items-center justify-between flex-col md:flex-row gap-3">
            <div
              className={`w-full flex items-center justify-start px-2 rounded-md border border-customborder ${
                (search === "activity" || search === "offers") && "hidden"
              }`}
            >
              <BiSearch color="white" />
              <input
                placeholder="Search items"
                className="outline-none bg-transparent w-full text-white py-1 px-1 font-thin placeholder:text-gray-600"
              />
            </div>
            <div
              className={`${
                (search === "activity" || search === "offers") && "hidden"
              } flex gap-2`}
            >
              <CollectionFilterSelect options={collectionFilterOptions} />
              <CollectionFilterSelect options={myItemFilterOptions} />
            </div>

            <div className={`${search !== "offers" && "hidden"} `}>
              <OfferFilterSelect />
            </div>
            <div className={`${search !== "activity" && "hidden"}`}>
              <ActivityFilterSelect />
            </div>
          </div>
          <div
            className={`${
              (search === "activity" || search === "offers") && "hidden"
            } w-full`}
          >
            <ItemMultiSelectbar />
          </div>
          <div className="w-full max-h-[70vh] overflow-y-auto pb-10">
            <div
              className={`relative ${
                search === "items" || search === null ? "block" : "hidden"
              }`}
            >
              <CollectionItemSkeleton />
              <div
                className={`w-full grid grid-cols-2 md:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5 ${
                  getOwnNFTsState && "hidden"
                }`}
              >
                {ownNFTs?.map((item, index) => (
                  <NFTCard
                    imgUrl={item.imgUrl}
                    collectionName={item.collectionName}
                    tokenId={item.tokenId}
                    key={index}
                    mintAddr={item.mintAddr}
                  />
                ))}
              </div>
            </div>
            <div
              className={`w-full flex items-center justify-center ${
                search === "offers" ? "block" : "hidden"
              }`}
            >
              <ActivityTable />
            </div>
            <div
              className={`w-full flex items-center justify-center ${
                search === "activity" ? "block" : "hidden"
              }`}
            >
              <ActivityTable />
            </div>
          </div>
          <div
            className={`${
              connected && !getOwnNFTsState && memoizedOwnNFTs.length === 0
                ? "flex"
                : "hidden"
            } items-center justify-center min-h-[70vh] w-full`}
          >
            <p className="text-gray-400 text-center">
              Nothing to show
              <br />
              Items you own will appear here in your Portfolio
            </p>
          </div>
        </div>
        <MobileItemMultiSelectBar />
        <MobileTabsTip />
      </div>
      <div
        className={`${
          !publicKey ? "flex" : "hidden"
        } items-center justify-center min-h-[80vh] w-full`}
      >
        <p className="text-gray-400 text-center">
          Connect wallet to see your profile page
        </p>
      </div>
    </MainPageLayout>
  );
};

export default function MePage() {
  return (
    <Suspense>
      <MyItem />
    </Suspense>
  );
}
