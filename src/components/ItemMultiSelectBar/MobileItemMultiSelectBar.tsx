/* eslint-disable @next/next/no-img-element */
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { CgClose } from "react-icons/cg";
import { SlBasket } from "react-icons/sl";

export default function MobileItemMultiSelectBar() {
  const param = useSearchParams();
  const search = param.get("activeTab") || "items";
  const [openBasket, setOpenBasket] = useState(false);
  return (
    <div
      className={`w-full md:hidden fixed bottom-[3.4rem] border-t border-customborder bg-darkgreen left-0 right-0 p-1 z-50 flex items-center justify-between
    ${search !== "items" && "hidden"}`}
    >
      <div className="bg-yellow-600 text-sm rounded-md px-8 py-[5px] text-white">
        Buy now
      </div>

      <div className="flex items-center justify-center gap-2">
        <div className="items-center gap-2 justify-center flex border border-customborder rounded-md px-1">
          <input
            placeholder="0"
            type="number"
            className="outline-none bg-transparent w-[80px] text-white px-2 py-1"
          />
          <p className="text-sm text-gray-200 uppercase">items</p>
        </div>
        <div
          className="p-[6px] rounded-md bg-darkgreen cursor-pointer border border-customborder"
          onClick={() => setOpenBasket(!openBasket)}
        >
          <SlBasket color="white" />
        </div>{" "}
      </div>
      <div
        className={`fixed top-0 bottom-[3.35rem] left-0 right-0 bg-darkgreen z-[51] flex flex-col justify-start items-center ${
          !openBasket && "hidden"
        }`}
      >
        <div className="w-full flex items-center justify-between p-3 border-b border-customborder">
          <p className="text-white text-xl">Cart</p>
          <span
            className="cursor-pointer text-white"
            onClick={() => setOpenBasket(false)}
          >
            <CgClose size={25} />
          </span>
        </div>
        <div
          className="w-full flex items-center justify-start gap-2 flex-col min-h-[45vh] bg-[#14532d44] border-b border-customborder max-h-[45vh]
        overflow-y-auto p-3"
        >
          {[...Array(9)].map((_, index) => (
            <div
              className="w-full flex justify-between items-center"
              key={index}
            >
              <div className="flex items-center justify-center gap-2 relative">
                <div className="relative flex">
                  <img
                    src="/images/collectionSliderImgs/3.png"
                    className="w-[50px] h-[50px] object-cover rounded-md"
                    alt="Avatar"
                  />
                  <span className="absolute -top-2 p-[2px] -right-2 rounded-full bg-gray-800">
                    <CgClose color="white" />
                  </span>
                </div>
                <span className="text-white text-md">#2234</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <img
                  src="/svgs/solana-sol-logo.svg"
                  className="w-[10px] h-[10px] object-cover"
                  alt="Sol SVG"
                />
                <span className="text-white text-md">1.34SOL</span>
              </div>
            </div>
          ))}
        </div>
        <div className="w-full flex items-center justify-center flex-col gap-1 p-2">
          <div className="w-full flex items-center justify-between">
            <p className="text-gray-200">Price</p>
            <span className="text-white">262.8 SOL</span>
          </div>
          <div className="w-full flex items-center justify-between">
            <p className="text-gray-200">Royalty</p>
            <span className="text-white">262.8 SOL</span>
          </div>{" "}
          <div className="w-full flex items-center justify-between">
            <p className="text-gray-200">Taker Fee</p>
            <span className="text-white">262.8 SOL</span>
          </div>{" "}
          <span className="text-gray-400 text-sm">
            By clicking "Buy", you agree to the Mugs Terms of service.
          </span>
        </div>
        <div className="w-[90%] text-center text-white bg-yellow-600 rounded-md py-2 absolute bottom-3">
          Buy 50 items for 250 SOl
        </div>
      </div>
    </div>
  );
}
