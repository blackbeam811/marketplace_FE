"use client";
import { useState, useEffect, useContext, Suspense } from "react";
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
import OfferTable from "@/components/OfferTable";
import ActivityTable from "@/components/ActivityTable";
// import OfferFilterSelect from "@/components/OfferFilterSelect"; // Uncomment if needed
// import ActivityFilterSelect from "@/components/ActivityFilterSelect"; // Uncomment if needed
import MobileCollectionFilterSidebar from "@/components/CollectionFilterSidebar/MobileCollectionFilterSidebar";

import { CollectionContext } from "@/contexts/CollectionContext";
import { NFTDataContext } from "@/contexts/NFTDataContext";

import {
  ActivityDataType,
  CollectionDataType,
  NFTCardType,
  OfferDataType,
  OwnNFTDataType,
} from "@/types/types";
import { ModalContext } from "@/contexts/ModalContext";
import {
  getAllActivitiesByCollectionAddrApi,
  getAllOffersByCollectionAddrApi,
} from "@/utils/api";
import { NormalSpinner } from "@/components/Spinners";

const Market: NextPage = () => {
  const { publicKey, connected } = useWallet();
  const { collectionAddr } = useParams();
  const searchParam = useSearchParams();
  const search = searchParam.get("activeTab") || "items";

  const { collectionData } = useContext(CollectionContext);
  const { listedAllNFTs, getOwnNFTsState } = useContext(NFTDataContext);

  const [filterOpen, setFilterOpen] = useState(false);
  const [filterLoading, setFilterLoading] = useState(true);
  const [filterListedNFTData, setFilterListedNFTData] = useState<
    OwnNFTDataType[]
  >([]);
  const [filterListedByParam, setFilterListedByParam] = useState<
    OwnNFTDataType[]
  >([]);
  const [filterCollectionData, setFilterCollectionData] = useState<
    CollectionDataType | undefined
  >(undefined);
  const [selectedNFTs, setSelectedNFTs] = useState<OwnNFTDataType[]>([]);
  const [offerData, setOfferData] = useState<OfferDataType[]>([]);
  const [activityData, setActivityData] = useState<ActivityDataType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("high2low");

  useEffect(() => {
    const fetchData = async () => {
      if (!collectionAddr) return;

      try {
        const [offers, activities] = await Promise.all([
          getAllOffersByCollectionAddrApi(collectionAddr.toString()),
          getAllActivitiesByCollectionAddrApi(collectionAddr.toString()),
        ]);

        setOfferData(offers);
        setActivityData(activities);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, [collectionAddr]);

  useEffect(() => {
    if (!collectionAddr || !collectionData) return;

    const filteredCollection = collectionData.find(
      (item) => item.collectionAddr === collectionAddr
    );
    setFilterCollectionData(filteredCollection);
  }, [collectionAddr, collectionData]);

  useEffect(() => {
    if (!collectionAddr || !listedAllNFTs.length) return;

    const filteredNFTs = listedAllNFTs.filter(
      (item) => item.collectionAddr === collectionAddr
    );
    setFilterListedNFTData(filteredNFTs);
    setFilterLoading(false);
  }, [collectionAddr, listedAllNFTs]);

  useEffect(() => {
    let filteredData = [...filterListedNFTData];
    console.log("selectedFilter ===>", selectedFilter);

    filteredData = filteredData.filter(
      (item) =>
        item.collectionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tokenId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    switch (selectedFilter) {
      case "high2low":
        filteredData.sort((a, b) => b.solPrice - a.solPrice);
        break;
      case "low2high":
        filteredData.sort((a, b) => a.solPrice - b.solPrice);
        break;
      case "recentlist":
        filteredData.sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
        break;
      default:
        break;
    }

    setFilterListedByParam(filteredData);
  }, [searchTerm, selectedFilter, filterListedNFTData]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleFilterSelect = (filter: string) => {
    setSelectedFilter(filter);
  };

  const toggleNFTSelection = (nft: OwnNFTDataType) => {
    setSelectedNFTs((prevSelectedNFTs) => {
      if (prevSelectedNFTs.find((item) => item.mintAddr === nft.mintAddr)) {
        return prevSelectedNFTs.filter(
          (item) => item.mintAddr !== nft.mintAddr
        );
      } else {
        return [...prevSelectedNFTs, nft];
      }
    });
  };

  return (
    <MainPageLayout>
      <div
        className={`w-full flex items-start justify-start flex-row ${
          !connected && "hidden"
        }`}
      >
        {/* <CollectionFilterSidebar
          filterOpen={filterOpen}
          onClosebar={() => setFilterOpen(false)}
        />
        <MobileCollectionFilterSidebar
          filterOpen={filterOpen}
          onClosebar={() => setFilterOpen(false)}
        /> */}
        <div className="w-full flex items-start justify-start mt-2 md:gap-4 gap-1 flex-col relative">
          {filterCollectionData && (
            <>
              <CollectionDetail collectionData={filterCollectionData} />
              <MobileCollectionDetail collectionData={filterCollectionData} />
            </>
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
              setFilterOpen={setFilterOpen}
              filterOpen={filterOpen}
              onSearch={handleSearch}
              onSelectFilter={handleFilterSelect}
            />
            <ItemMultiSelectbar
              setSelectedNFTs={() => setSelectedNFTs([])}
              selectedNFTLists={selectedNFTs}
              toggleSelection={(item: OwnNFTDataType) =>
                toggleNFTSelection(item)
              }
              functionState="buy"
            />
          </div>
          <CollectionItemSkeleton loadingState={filterLoading} />
          <div className="w-full max-h-[70vh] overflow-y-auto pb-10">
            <div
              className={`relative ${
                search === "items" || search === null ? "block" : "hidden"
              }`}
            >
              <div
                className={`w-full grid grid-cols-2 md:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5 px-2 pb-5 ${
                  filterLoading && "hidden"
                }`}
              >
                {filterListedByParam.map((item, index) => (
                  <NFTCard
                    key={index}
                    imgUrl={item.imgUrl}
                    collectionName={item.collectionName}
                    tokenId={item.tokenId}
                    mintAddr={item.mintAddr}
                    solPrice={item.solPrice}
                    state={item.solPrice === 0 ? "unlisted" : "listed"}
                    isSelected={
                      !!selectedNFTs.find(
                        (nft) => nft.mintAddr === item.mintAddr
                      )
                    }
                    toggleSelection={() => toggleNFTSelection(item)}
                  />
                ))}
              </div>
            </div>
            <div
              className={`w-full flex items-center justify-center px-2 ${
                search === "offers" ? "block" : "hidden"
              }`}
            >
              <OfferTable
                data={offerData}
                handleCancelOffer={(mintAddr: string) =>
                  console.log("mintAddr => ", mintAddr)
                }
              />
            </div>
            <div
              className={`w-full flex items-center justify-center px-2 ${
                search === "activity" ? "block" : "hidden"
              }`}
            >
              <ActivityTable data={activityData} />
            </div>
            <div
              className={`w-full flex items-center justify-center ${
                !filterLoading && "hidden"
              }`}
            >
              <NormalSpinner width={7} height={7} />
            </div>
            <div
              className={`${
                !filterLoading &&
                search === "items" &&
                filterListedByParam.length === 0
                  ? "flex"
                  : "hidden"
              } items-center justify-center min-h-[40vh] w-full`}
            >
              <p className="text-gray-400 text-center">Nothing to show 😞</p>
            </div>
          </div>
        </div>
        <MobileItemMultiSelectBar
          selectedNFTLists={selectedNFTs}
          toggleSelection={(item: OwnNFTDataType) => toggleNFTSelection(item)}
          functionState="buy"
        />
        <Suspense fallback={<div />}>
          <MobileTabsTip />
        </Suspense>
      </div>
      <div
        className={`${
          !publicKey ? "flex" : "hidden"
        } items-center justify-center min-h-[80vh] w-full`}
      >
        <p className="text-gray-400 text-center">
          Connect wallet to see the colection. 🤨
        </p>
      </div>
    </MainPageLayout>
  );
};

export default Market;
