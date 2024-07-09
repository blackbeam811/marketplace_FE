"use client";
import Image from "next/image";
import { offerTableTH } from "@/data/tableTHData";
import { OfferDataType } from "@/types/types";
import { useAnchorWallet } from "@solana/wallet-adapter-react";

export default function OfferTable(props: {
  data: OfferDataType[];
  handleCancelOffer: (index: number) => void;
}) {
  const wallet = useAnchorWallet();

  return (
    <div className="w-full overflow-x-auto border border-customborder rounded-md mb-10 min-h-[22vh]">
      <table className="min-w-[1024px] lg:w-full bg-transparent">
        <thead className="border-b border-customborder">
          <tr>
            {offerTableTH.map((item, index) => (
              <th
                className="text-left py-3 px-4 uppercase text-gray-300 font-bold text-sm"
                key={index}
              >
                {" "}
                {item}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {props.data.map((row, index) => (
            <tr
              key={index}
              className={`${
                index % 2 === 0 ? "bg-darkgreen" : "bg-[#0f4223b9]"
              }`}
            >
              <td className="py-2 px-4 text-white font-light text-md">
                {index + 1}
              </td>

              <td className="py-2 px-4 text-[#DD7A98]">{row.offerPrice} SOL</td>
              <td className="py-2 px-4 text-white font-light">
                {row.buyer.slice(0, 4) + "...." + row.buyer.slice(-4)}
              </td>
              <td className="py-2 px-4 text-white font-light">
                <button
                  className={`px-2 py-[1px] bg-red-500 duration-300 hover:bg-red-600 rounded-md ${
                    row.buyer !== wallet?.publicKey.toBase58() && "hidden"
                  }`}
                  onClick={() => props.handleCancelOffer(index)}
                >
                  Cancel
                </button>
                <span
                  className={`text-red-400 ${
                    (row.active !== 0 ||
                      row.buyer === wallet?.publicKey.toBase58()) &&
                    "hidden"
                  }`}
                >
                  Expired
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div
        className={`${
          props.data?.length !== 0 && "hidden"
        } w-full flex items-center justify-center my-5`}
      >
        <span className="text-[#ffffff]">Nothing to show 😒</span>
      </div>
    </div>
  );
}
