/* eslint-disable @next/next/no-img-element */
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import { useRef, useState } from "react";
import { CgClose } from "react-icons/cg";
import { SlBasket } from "react-icons/sl";

export default function ItemMultiSelectbar() {
  const elem = useRef(null);
  const [openBasket, setOpenBasket] = useState(false);
  useOnClickOutside(elem, () => setOpenBasket(false));

  return (
    <div className="bg-darkgreen w-full md:flex hidden items-center justify-between md:flex-row flex-col border-t px-2 border-customborder pt-3">
      <div className="flex items-center justify-center gap-2 w-full md:w-auto">
        <div className="items-center gap-2 justify-center flex border border-customborder rounded-md px-1">
          <input
            placeholder="0"
            type="number"
            className="outline-none bg-transparent w-[50px] text-white px-2 py-1"
          />
          <p className="text-sm text-gray-200 uppercase">items</p>
        </div>
        <input
          type="range"
          className="focus:outline-none outline-none"
          max={5}
          onChange={(e) => console.log(e.target.value)}
        />
      </div>
      <div className="flex items-center justify-center gap-2">
        <div className="bg-yellow-600 rounded-md py-1 text-white px-10 cursor-pointer hover:bg-yellow-500 duration-300">
          Buy now
        </div>
        <div
          className="p-2 rounded-md bg-white cursor-pointer relative"
          onClick={() => setOpenBasket(!openBasket)}
          ref={elem}
        >
          <SlBasket color="black" />
          <div
            className="w-[350px] absolute right-0 top-10 rounded-md border border-customborder
            bg-darkgreen shadow-lg shadow-black z-50 duration-300 origin-top"
            style={{
              opacity: openBasket ? 1 : 0,
              scale: openBasket ? 1 : 0.6,
              pointerEvents: openBasket ? "all" : "none",
            }}
          >
            <div className="w-full flex items-center justify-start flex-col gap-2 min-h-[20vh] max-h-[30vh] overflow-y-auto bg-[#14532d44] border-b border-customborder p-2">
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
          </div>
        </div>
      </div>
    </div>
  );
}
