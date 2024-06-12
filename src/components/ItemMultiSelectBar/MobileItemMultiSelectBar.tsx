/* eslint-disable @next/next/no-img-element */
import { useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CgClose } from "react-icons/cg";
import { SlBasket } from "react-icons/sl";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";

export default function MobileItemMultiSelectBar() {
  const elem = useRef(null);
  const param = useSearchParams();
  const activeTab = param.get("activeTab") || "items";
  const [isBasketOpen, setIsBasketOpen] = useState(false);

  useOnClickOutside(elem, () => setIsBasketOpen(false));

  if (activeTab !== "items") {
    return null;
  }

  const toggleBasket = () => setIsBasketOpen((prevState) => !prevState);

  return (
    <div className="fixed bottom-[3.4rem] left-0 right-0 w-full md:hidden border-t border-customborder bg-darkgreen p-1 z-50 flex items-center justify-between">
      <button className="bg-yellow-600 text-sm rounded-md px-8 py-[5px] text-white">
        Buy now
      </button>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 border border-customborder rounded-md px-1">
          <input
            type="number"
            placeholder="0"
            className="bg-transparent w-[80px] text-white px-2 py-1 outline-none"
          />
          <p className="text-sm text-gray-200 uppercase">items</p>
        </div>
        <div
          className="p-[6px] rounded-md bg-darkgreen cursor-pointer border border-customborder"
          onClick={toggleBasket}
        >
          <SlBasket color="white" />
        </div>
      </div>

      <div
        className={`fixed top-0 bottom-[3.35rem] left-0 right-0 bg-darkgreen z-[51] flex flex-col items-center transition duration-200 origin-bottom ${
          isBasketOpen
            ? "scale-100 opacity-100 pointer-events-auto"
            : "scale-75 opacity-0 pointer-events-none"
        }`}
      >
        <div className="w-full flex items-center justify-between p-3 border-b border-customborder">
          <p className="text-white text-xl">Cart</p>
          <CgClose
            size={25}
            className="cursor-pointer text-white"
            onClick={() => setIsBasketOpen(false)}
          />
        </div>

        <div className="w-full flex flex-col items-start gap-2 p-3 min-h-[45vh] max-h-[45vh] bg-[#14532d44] border-b border-customborder overflow-y-auto">
          {[...Array(9)].map((_, index) => (
            <div
              className="w-full flex justify-between items-center"
              key={index}
            >
              <div className="flex items-center gap-2">
                <div className="relative flex">
                  <img
                    src="/images/collectionSliderImgs/3.png"
                    className="w-[50px] h-[50px] object-cover rounded-md"
                    alt="Avatar"
                  />
                  <CgClose className="absolute -top-2 -right-2 p-[2px] rounded-full bg-gray-800 text-white" />
                </div>
                <span className="text-white text-md">#2234</span>
              </div>
              <div className="flex items-center gap-2">
                <img
                  src="/svgs/solana-sol-logo.svg"
                  className="w-[10px] h-[10px] object-cover"
                  alt="Sol SVG"
                />
                <span className="text-white text-md">1.34 SOL</span>
              </div>
            </div>
          ))}
        </div>

        <div className="w-full flex flex-col items-center gap-1 p-2">
          <div className="w-full flex justify-between">
            <p className="text-gray-200">Price</p>
            <span className="text-white">262.8 SOL</span>
          </div>
          <div className="w-full flex justify-between">
            <p className="text-gray-200">Royalty</p>
            <span className="text-white">262.8 SOL</span>
          </div>
          <div className="w-full flex justify-between">
            <p className="text-gray-200">Taker Fee</p>
            <span className="text-white">262.8 SOL</span>
          </div>
          <span className="text-gray-400 text-sm">
            By clicking "Buy", you agree to the Mugs Terms of Service.
          </span>
        </div>

        <button className="w-[90%] text-center text-white bg-yellow-600 rounded-md py-2 absolute bottom-3">
          Buy 50 items for 250 SOL
        </button>
      </div>
    </div>
  );
}
