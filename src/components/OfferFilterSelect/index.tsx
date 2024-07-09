"use client";
import { useState } from "react";

export default function OfferFilterSelect(props: {
  setOfferShowType: (index: number) => void;
  offerShowType: number;
}) {
  return (
    <div className="flex border rounded-full border-customborder">
      <div
        className={`${
          props.offerShowType === 0 && "bg-yellow-600 "
        } rounded-full cursor-pointer text-white py-1 px-3 text-[13px]`}
        onClick={() => props.setOfferShowType(0)}
      >
        Item Offers made
      </div>
      <div
        className={`${
          props.offerShowType === 1 && "bg-yellow-600 "
        } rounded-full cursor-pointer text-white py-1 px-3 text-[13px]`}
        onClick={() => props.setOfferShowType(1)}
      >
        Item Offers Received
      </div>
    </div>
  );
}
