"use client";
import { NextPage } from "next";
import MainPageLayout from "@/components/Layout";
import { useParams, usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useWallet } from "@solana/wallet-adapter-react";
import TabsTip from "@/components/TabsTip";
import { Suspense, useContext, useEffect, useMemo, useState } from "react";
import {
  collectionDataType,
  collectionTableData,
} from "@/data/collectionTableData";
import CollectionDetail from "@/components/CollectionDetail";
import CollectionItemSkeleton from "@/components/CollectionItemSkeleton";
import { NFTDataContext } from "@/contexts/NFTDataContext";
import NFTCard from "@/components/NFTCard";
import { FiFilter } from "react-icons/fi";
import { BiSearch } from "react-icons/bi";
import CollectionFilterSelect from "@/components/CollectionFilterSelect";
import { ArrowIcon, CloseIcon } from "@/components/SvgIcons";
import CollectionFilterSidebar from "@/components/CollectionFilterSidebar";
import { collectionItems } from "@/data/collectionItems";
import { Size, useWindowSize } from "@/hooks/useWindowSize";

const Market: NextPage = () => {
  const { publicKey, connected } = useWallet();
  const params = useParams();
  const { collectionAddr } = params;
  const { ownNFTs, getOwnNFTsState } = useContext(NFTDataContext);

  const memoizedOwnNFTs = useMemo(() => ownNFTs, [ownNFTs]);
  const [collectionData, setCollectionData] = useState<collectionDataType>();
  const [windowSize, setWindowSize] = useState<Size>();
  const [filterOpen, setFilterOpen] = useState(false);
  const { width } = useWindowSize();
  console.log("width", width);

  useEffect(() => {
    if (collectionAddr) {
      const collection = collectionTableData.filter(
        (item) => item.collectionAddr === collectionAddr
      );
      setCollectionData(collection[0]);
    }
  }, [collectionAddr]);

  const getColumns = () => {
    if (width >= 1536) return Math.floor(width / 150); // 2xl
    if (width >= 1280) return 7; // xl
    if (width >= 1024) return 6; // lg
    if (width >= 768) return 5; // md
    if (width >= 640) return 3; // sm
    return 2; // default case for small screens
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
        <div className="w-full flex items-start justify-start mt-5 gap-4 flex-col px-2">
          {collectionData && (
            <CollectionDetail collectionData={collectionData} />
          )}
          <Suspense fallback={<div />}>
            <TabsTip />
          </Suspense>
          <div className="w-full flex items-center justify-between gap-3">
            <div
              className={`p-2 ${
                filterOpen
                  ? "bg-pink-500 text-white"
                  : "bg-gray-700 text-gray-300"
              } rounded-md hover:text-white duration-300 cursor-pointer`}
              onClick={() => setFilterOpen(!filterOpen)}
            >
              <FiFilter />
            </div>
            <div className="w-full flex items-center justify-start px-2 rounded-md border-[1px] border-gray-600">
              <BiSearch color="white" />
              <input
                placeholder="Search items"
                className="outline-none bg-transparent w-full text-white py-1 px-1 font-thin"
              />
            </div>
            <CollectionFilterSelect />
          </div>
          <CollectionItemSkeleton />
          <div className="w-full max-h-[70vh] overflow-y-auto p-3">
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
                  tokenAddr={item.mintAddr}
                />
              ))}
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
