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
  OfferDataType,
  OwnNFTDataType,
} from "@/types/types";
import { ModalContext } from "@/contexts/ModalContext";
import {
  getAllActivitiesByCollectionAddrApi,
  getAllOffersByCollectionAddrApi,
} from "@/utils/api";

const Market: NextPage = () => {
  const { publicKey, connected } = useWallet();
  const { collectionAddr } = useParams();
  const searchParam = useSearchParams();
  const search = searchParam.get("activeTab") || "items";

  const { collectionData, collectionDataState } = useContext(CollectionContext);
  const { ownNFTs, getOwnNFTsState, getAllListedNFTs, listedAllNFTs } =
    useContext(NFTDataContext);
  const { closeNFTDetailModal } = useContext(ModalContext);

  const [filterOpen, setFilterOpen] = useState(false);
  const [filterListedNFTData, setFilterListedNFTData] = useState<
    OwnNFTDataType[]
  >([]);
  const [filterListedByParam, setFilterListedByParam] = useState<
    OwnNFTDataType[]
  >([]);
  const [filterCollectionData, setFilterCollectionData] = useState<
    CollectionDataType | undefined
  >(undefined);
  const [offerData, setOfferData] = useState<OfferDataType[]>([]);
  const [activityData, setActivityData] = useState<ActivityDataType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("high2low");

  useEffect(() => {
    const fetchData = async () => {
      if (!collectionAddr) return;

      try {
        const offers = await getAllOffersByCollectionAddrApi(
          collectionAddr.toString()
        );
        const activities = await getAllActivitiesByCollectionAddrApi(
          collectionAddr.toString()
        );

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
    // setFilterListedByParam(filteredNFTs);
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
        console.log("high2low");

        filteredData.sort((a, b) => b.solPrice - a.solPrice);
        break;
      case "low2high":
        console.log("low2high");
        filteredData.sort((a, b) => a.solPrice - b.solPrice);
        break;
      case "recentlist":
        console.log("recentlist");
        filteredData.sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
        break;
      default:
        break;
    }
    console.log("2filteredData ===>", filteredData);

    // Update state only once after filtering and sorting
    setFilterListedByParam(filteredData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, selectedFilter, filterListedNFTData]); // Dependencies for useEffect

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleFilterSelect = (filter: string) => {
    setSelectedFilter(filter);
  };

  return (
    <MainPageLayout>
      <div
        className={`w-full flex items-start justify-start flex-row ${
          !connected && "hidden"
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
              setFilterOpen={setFilterOpen}
              filterOpen={filterOpen}
              onSearch={handleSearch}
              onSelectFilter={handleFilterSelect}
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
              <div
                className={`w-full grid grid-cols-2 md:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5 px-2 pb-5 ${
                  getOwnNFTsState && "hidden"
                }`}
              >
                {filterListedByParam?.map((item, index) => (
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
              className={`${
                !collectionDataState &&
                !getOwnNFTsState &&
                filterListedByParam.length === 0 &&
                search === "items"
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
          Connect wallet to see your profile page
        </p>
      </div>
    </MainPageLayout>
  );
};

export default Market;
