"use client";
/* eslint-disable @next/next/no-img-element */
import { NextPage } from "next";
import MainPageLayout from "@/components/Layout";
import { SolanaIcon } from "@/components/SvgIcons";
import { useWallet } from "@solana/wallet-adapter-react";
import { Suspense, useContext, useMemo } from "react";
import { NFTDataContext } from "@/contexts/NFTDataContext";
import TabsTip from "@/components/TabsTip";
import NFTCard from "@/components/NFTCard";
import NFTItemSkeleton from "@/components/NFTItemSkeleton";
import Image from "next/image";

export default function MyItem() {
  const { publicKey, connected } = useWallet();
  const { ownNFTs, getOwnNFTsState } = useContext(NFTDataContext);

  const memoizedOwnNFTs = useMemo(() => ownNFTs, [ownNFTs]);

  return (
    <MainPageLayout>
      <div
        className={`w-full flex items-center justify-start min-h-[80vh] flex-col px-3 ${
          !connected && "hidden"
        }`}
      >
        <div className="w-full max-w-screen-2xl flex items-start justify-start mt-5 gap-4 flex-col">
          <div className="flex items-center justify-center gap-3">
            <div className="w-[68px] h-[68px] relative">
              <Image
                src="/svgs/initialAvatar.svg"
                alt="Avatar"
                fill
                className="rounded-full"
              />
            </div>
            <div className="flex items-center justify-center gap-2 bg-gray-900 px-3 rounded-full py-1 border-[1px] border-gray-700">
              <div className="w-[18px] h-[18px] relative">
                <Image
                  src="/svgs/solana-sol-logo.svg"
                  alt="Avatar"
                  fill
                  className=""
                />
              </div>
              <span className="text-white text-sm mt-[1px]">
                {publicKey?.toString().slice(0, 4) +
                  "...." +
                  publicKey?.toString().slice(-4)}
              </span>
            </div>
          </div>
          <Suspense fallback={<div />}>
            <TabsTip />
          </Suspense>

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
          <NFTItemSkeleton />
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
}
