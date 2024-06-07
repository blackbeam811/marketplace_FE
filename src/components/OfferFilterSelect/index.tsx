"use client";
import { useState } from "react";

export default function OfferFilterSelect() {
  const [offerShowType, setOfferShowType] = useState(0);
  return (
    <div className="flex border rounded-full border-customborder">
      <div
        className={`${
          offerShowType === 0 && "bg-yellow-600 "
        } rounded-full cursor-pointer text-white py-2 px-3 text-[13px]`}
        onClick={() => setOfferShowType(0)}
      >
        Item Offers made
      </div>
      <div
        className={`${
          offerShowType === 1 && "bg-yellow-600 "
        } rounded-full cursor-pointer text-white py-2 px-3 text-[13px]`}
        onClick={() => setOfferShowType(1)}
      >
        Item Offers Received
      </div>
    </div>
  );
}
