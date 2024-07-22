/* eslint-disable @next/next/no-img-element */
"use client";
import { offerTableTH } from "@/data/tableTHData";
import { OfferDataType } from "@/types/types";
import { useAnchorWallet } from "@solana/wallet-adapter-react";

export default function OfferTable(props: {
  canCancel: boolean;
  data: OfferDataType[];
  handleCancelOffer: (mintAddr: string) => void;
}) {
  const wallet = useAnchorWallet();

  return (
    <div className="w-full overflow-x-auto border border-customborder rounded-md mb-10 min-h-[10vh]">
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
              <td className="py-2 px-4 text-white font-light text-md flex gap-2 flex-row items-center justify-start">
                <div className="relative w-[30px] h-[30px]">
                  <img
                    src={row.imgUrl}
                    alt="Collection Image"
                    className="object-cover w-full h-full"
                  />
                </div>
                {row.tokenId}
              </td>

              <td className="py-2 px-4 text-[#DD7A98]">{row.offerPrice} SOL</td>
              <td className="py-2 px-4 text-white font-light">
                {row.buyer.slice(0, 4) + "...." + row.buyer.slice(-4)}
              </td>
              <td className="py-2 px-4 text-white font-light">
                <button
                  className={`px-2 bg-red-500 duration-300 hover:bg-red-600 rounded-sm ${
                    (row.buyer !== wallet?.publicKey.toBase58() ||
                      !props.canCancel) &&
                    "hidden"
                  }`}
                  onClick={() => props.handleCancelOffer(row.mintAddr)}
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
