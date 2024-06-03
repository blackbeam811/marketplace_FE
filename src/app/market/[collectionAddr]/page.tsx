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

const Market: NextPage = () => {
  const { publicKey, connected } = useWallet();
  const params = useParams();
  const { collectionAddr } = params;
  const { ownNFTs, getOwnNFTsState } = useContext(NFTDataContext);

  const memoizedOwnNFTs = useMemo(() => ownNFTs, [ownNFTs]);
  const [collectionData, setCollectionData] = useState<collectionDataType>();

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
        className={`w-full max-w-[1440px] flex items-center justify-start min-h-[80vh] flex-col ${
          !connected && "hidden"
        }`}
      >
        <div className="w-full flex items-start justify-start mt-5 gap-4 flex-col">
          <CollectionDetail collectionData={collectionData} />
          <Suspense fallback={<div />}>
            <TabsTip />
          </Suspense>
          <div className="w-full flex items-center justify-between gap-3">
            <div className="p-2 bg-gray-700 rounded-md text-gray-300 hover:text-white duration-300 cursor-pointer">
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
          <div
            className={`w-full grid 2xl:grid-cols-8 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 sm:grid-cols-3 grid-cols-2 gap-5 ${
              getOwnNFTsState && "hidden"
            }`}
          >
            {memoizedOwnNFTs?.map((item, index) => (
              <NFTCard
                imgUrl={item.imgUrl}
                tokenId={item.tokenId}
                key={index}
                tokenAddr={item.mintAddr}
              />
            ))}
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
