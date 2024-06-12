"use client";
import { Suspense, useContext, useEffect, useMemo, useState } from "react";
import { NextPage } from "next";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";

import { FiFilter } from "react-icons/fi";
import { BiSearch } from "react-icons/bi";
import { SlBasket } from "react-icons/sl";
import MainPageLayout from "@/components/Layout";
import TabsTip from "@/components/TabsTip";
import NFTCard from "@/components/NFTCard";
import CollectionDetail from "@/components/CollectionDetail";
import CollectionItemSkeleton from "@/components/CollectionItemSkeleton";
import CollectionFilterSelect from "@/components/CollectionFilterSelect";
import CollectionFilterSidebar from "@/components/CollectionFilterSidebar";

import { NFTDataContext } from "@/contexts/NFTDataContext";

import { collectionItems } from "@/data/collectionItems";
import { collectionFilterOptions } from "@/data/selectTabData";
import { collectionTableData } from "@/data/collectionTableData";
import { collectionDataType } from "@/types/types";
import { useWindowSize } from "@/hooks/useWindowSize";
import ActivityTable from "@/components/ActivityTable";
import ItemMultiSelectbar from "@/components/ItemMultiSelectBar";
import CollectionFilterbar from "@/components/CollectionFilterbar";
import MobileItemMultiSelectBar from "@/components/ItemMultiSelectBar/MobileItemMultiSelectBar";
import MobileTabsTip from "@/components/TabsTip/MobileTabsTip";
import MobileCollectionDetail from "@/components/CollectionDetail/MobileCollectionDetail";
import OfferFilterSelect from "@/components/OfferFilterSelect";
import ActivityFilterSelect from "@/components/ActivityFilterSelect";
import MobileCollectionFilterSidebar from "@/components/CollectionFilterSidebar/MobileCollectionFilterSidebar";

const Market: NextPage = () => {
  const { publicKey, connected } = useWallet();
  const params = useParams();
  const searchParam = useSearchParams();
  const search = searchParam.get("activeTab") || "items";
  const { collectionAddr } = params;
  const { ownNFTs, getOwnNFTsState } = useContext(NFTDataContext);

  const memoizedOwnNFTs = useMemo(() => ownNFTs, [ownNFTs]);
  const [collectionData, setCollectionData] = useState<collectionDataType>();
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    if (collectionAddr) {
      const collection = collectionTableData.filter(
        (item) => item.collectionAddr === collectionAddr
      );
      setCollectionData(collection[0]);
    }
  }, [collectionAddr]);

  return (
    <MainPageLayout>
      <div
        className={`w-full flex items-start justify-start flex-row${
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
            <CollectionDetail collectionData={collectionData} />
          )}
          {collectionData && (
            <MobileCollectionDetail collectionData={collectionData} />
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
            <OfferFilterSelect />
          </div>
          <div className={`${search !== "activity" && "hidden"} px-2`}>
            <ActivityFilterSelect />
          </div>
          <CollectionItemSkeleton />
          <div className="w-full flex items-center justify-center flex-col relative">
            <div
              className={`w-full md:max-h-[60vh] max-h-[62vh] overflow-y-auto px-2 pb-12 ${
                search === "items" || search === null ? "block" : "hidden"
              }`}
            >
              <div className={`relative `}>
                <div
                  className={`w-full grid grid-cols-2 md:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5 ${
                    getOwnNFTsState && "hidden"
                  }`}
                >
                  {collectionItems?.map((item, index) => (
                    <NFTCard
                      imgUrl={item.imgUrl}
                      tokenId={item.tokenId}
                      key={index}
                      mintAddr={item.mintAddr}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div
            className={`w-full flex items-center justify-center px-2 ${
              search === "offers" ? "block" : "hidden"
            }`}
          >
            <ActivityTable />
          </div>
          <div
            className={`w-full flex items-center justify-center px-2 ${
              search === "activity" ? "block" : "hidden"
            }`}
          >
            <ActivityTable />
          </div>
          {/* <div
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
          </div> */}
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

export default Market;
