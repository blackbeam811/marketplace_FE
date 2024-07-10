"use client";
import { Suspense, useContext, useEffect, useMemo, useState } from "react";
import { NextPage } from "next";
import { useParams, useSearchParams } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";

import MainPageLayout from "@/components/Layout";
import TabsTip from "@/components/TabsTip";
import NFTCard from "@/components/NFTCard";
import CollectionDetail from "@/components/CollectionDetail";
import CollectionItemSkeleton from "@/components/CollectionItemSkeleton";
import CollectionFilterSidebar from "@/components/CollectionFilterSidebar";

import ItemMultiSelectbar from "@/components/ItemMultiSelectBar";
import CollectionFilterbar from "@/components/CollectionFilterbar";
import MobileItemMultiSelectBar from "@/components/ItemMultiSelectBar/MobileItemMultiSelectBar";
import MobileTabsTip from "@/components/TabsTip/MobileTabsTip";
import MobileCollectionDetail from "@/components/CollectionDetail/MobileCollectionDetail";
import OfferFilterSelect from "@/components/OfferFilterSelect";
import ActivityFilterSelect from "@/components/ActivityFilterSelect";
import MobileCollectionFilterSidebar from "@/components/CollectionFilterSidebar/MobileCollectionFilterSidebar";

import { CollectionContext } from "@/contexts/CollectionContext";
import { NFTDataContext } from "@/contexts/NFTDataContext";

import { CollectionDataType, OwnNFTDataType } from "@/types/types";

const Market: NextPage = () => {
  const { publicKey, connected } = useWallet();
  const params = useParams();
  const searchParam = useSearchParams();
  const search = searchParam.get("activeTab") || "items";
  const { collectionAddr } = params;
  const { ownNFTs, getOwnNFTsState, getAllListedNFTs, listedAllNFTs } =
    useContext(NFTDataContext);
  const { collectionData } = useContext(CollectionContext);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterListedNFTData, setFilterListedNFTData] = useState<
    OwnNFTDataType[]
  >([]);

  const [filterCollectionData, setFilterCollectionData] =
    useState<CollectionDataType>();

  useEffect(() => {
    if (collectionAddr) {
      const collection = collectionData.filter(
        (item) => item.collectionAddr === collectionAddr
      );
      console.log("collection ====> ", collection);
      setFilterCollectionData(collection[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionAddr, listedAllNFTs]);

  useEffect(() => {
    if (collectionAddr !== "" && listedAllNFTs.length !== 0) {
      const filterData = listedAllNFTs.filter(
        (item) => item.collectionAddr === collectionAddr
      );
      setFilterListedNFTData(filterData);
    }
  }, [collectionAddr, listedAllNFTs]);

  return (
    <MainPageLayout>
      <div
        className={`w-full flex items-start justify-start flex-row ${
          !connected && " hidden"
        }`}
      >
        <CollectionFilterSidebar
          filterOpen={filterOpen}
          onClosebar={() => setFilterOpen(false)}
        />

        <MobileCollectionFilterSidebar
          filterOpen={filterOpen}
          onClosebar={() => setFilterOpen(false)}
        />

        <div className="w-full flex items-start justify-start mt-2 md:gap-4 gap-1 flex-col relative">
          {collectionData && (
            <CollectionDetail collectionData={filterCollectionData} />
          )}
          {collectionData && (
            <MobileCollectionDetail collectionData={filterCollectionData} />
          )}
          <Suspense fallback={<div />}>
            <TabsTip />
          </Suspense>

          <div
            className={`${
              (search === "activity" || search === "offers") && "hidden"
            } flex gap-2 w-full flex-col`}
          >
            <CollectionFilterbar
              setFilterOpen={() => setFilterOpen(!filterOpen)}
              filterOpen={filterOpen}
            />
            <ItemMultiSelectbar />
          </div>
          <div className={`${search !== "offers" && "hidden"} px-2`}>
            {/* <OfferFilterSelect /> */}
          </div>
          <div className={`${search !== "activity" && "hidden"} px-2`}>
            {/* <ActivityFilterSelect /> */}
          </div>
          <CollectionItemSkeleton />
          <div className="w-full max-h-[70vh] overflow-y-auto pb-10">
            <div
              className={`relative ${
                search === "items" || search === null ? "block" : "hidden"
              }`}
            >
              <div className={`relative `}>
                <div
                  className={`w-full grid grid-cols-2 md:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5 ${
                    getOwnNFTsState && "hidden"
                  }`}
                >
                  {filterListedNFTData?.map((item, index) => (
                    <NFTCard
                      imgUrl={item.imgUrl}
                      collectionName={item.collectionName}
                      tokenId={item.tokenId}
                      key={index}
                      mintAddr={item.mintAddr}
                      solPrice={item.solPrice}
                      state={item.solPrice === 0 ? "unlisted" : "listed"}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div
              className={`w-full flex items-center justify-center px-2 ${
                search === "offers" ? "block" : "hidden"
              }`}
            >
              {/* <ActivityTable /> */}
            </div>
            <div
              className={`w-full flex items-center justify-center px-2 ${
                search === "activity" ? "block" : "hidden"
              }`}
            >
              {/* <ActivityTable /> */}
            </div>
            <div
              className={`${
                connected && filterListedNFTData.length === 0
                  ? "flex"
                  : "hidden"
              } items-center justify-center min-h-[40vh] w-full`}
            >
              <p className="text-gray-400 text-center">
                Nothing to show
                <br />
                Items you own will appear here in your Portfolio
              </p>
            </div>
          </div>
        </div>

        <MobileItemMultiSelectBar />
        <Suspense>
          <MobileTabsTip />
        </Suspense>
      </div>
      {/* <div
        className={`${
          connected && !getOwnNFTsState && filterListedNFTData.length === 0
            ? "flex"
            : "hidden"
        } items-center justify-center min-h-[40vh] w-full`}
      >
        <p className="text-gray-400 text-center">
          Nothing to show
          <br />
          Items you own will appear here in your Portfolio
        </p>
      </div> */}
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

export default Market;
