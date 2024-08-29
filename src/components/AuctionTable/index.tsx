"use client";
import { useContext } from "react";
import { NFTDataContext } from "@/contexts/NFTDataContext";
import AuctionCard from "../AuctionCard";

export default function AuctionTable() {
  const { allAuctions, listedAllNFTs } = useContext(NFTDataContext);
  return (
    <div
      className={`w-full flex flex-col items-start justify-start mt-10 ${
        allAuctions.length === 0 && "hidden"
      }`}
    >
      <div className="w-full border-b border-customborder py-3">
        <p className="text-gray-300 text-2xl">Created Auctions</p>
      </div>
      <div className="w-full grid xl:grid-cols-5 grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 py-3">
        {listedAllNFTs
          .filter((data) => data.endTime !== undefined)
          .map((item, index) => (
            <AuctionCard
              key={index}
              imgUrl={item.imgUrl}
              tokenId={item.tokenId}
              mintAddr={item.mintAddr}
              collectionName={item.collectionName}
              solPrice={item.solPrice}
              endTime={item.endTime}
              state={"Auction"}
            />
          ))}
      </div>
    </div>
  );
}
