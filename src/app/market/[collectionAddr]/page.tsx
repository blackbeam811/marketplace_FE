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
import { FaDiscord, FaTwitter } from "react-icons/fa";
import { BsTwitterX } from "react-icons/bs";
import CollectionDetail from "@/components/CollectionDetail";
import CollectionItemSkeleton from "@/components/CollectionItemSkeleton";
import { NFTDataContext } from "@/contexts/NFTDataContext";
import NFTCard from "@/components/NFTCard";

const Market: NextPage = () => {
  const { publicKey, connected } = useWallet();
  const params = useParams();
  const { collectionAddr } = params;
  const { ownNFTs, getOwnNFTsState } = useContext(NFTDataContext);

  const memoizedOwnNFTs = useMemo(() => ownNFTs, [ownNFTs]);
  const [collectionData, setCollectionData] = useState<collectionDataType>();
  console.log("collectionAddr ===>", collectionAddr);

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
