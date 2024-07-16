/* eslint-disable @next/next/no-img-element */
"use client";
import { LoadingContext } from "@/contexts/LoadingContext";
import { NFTDataContext } from "@/contexts/NFTDataContext";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import { OwnNFTDataType } from "@/types/types";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useRef, useState } from "react";
import { CgClose } from "react-icons/cg";
import { SlBasket } from "react-icons/sl";
import { errorAlert, successAlert } from "../ToastGroup";
import {
  listPNftForSale,
  pNftDelist,
  purchasePNft,
} from "@/utils/contractScript";
import { delistNftApi, listNftApi, purchaseNFT } from "@/utils/api";
import { CollectionContext } from "@/contexts/CollectionContext";

export default function ItemMultiSelectbar(props: {
  nftLength: number;
  functionState: string;
  selectedNFTLists: OwnNFTDataType[];
  setSelectedNFTs: () => void;
  toggleSelection: (item: OwnNFTDataType) => void;
  rangeSelection: (length: number) => void;
}) {
  const elem = useRef(null);
  const wallet = useAnchorWallet();
  const route = useRouter();

  const { myBalance, getAllListedNFTs, getOwnNFTs, getAllListedNFTsBySeller } =
    useContext(NFTDataContext);
  const { openFunctionLoading, closeFunctionLoading } =
    useContext(LoadingContext);
  const { getAllCollectionData } = useContext(CollectionContext);

  const [openBasket, setOpenBasket] = useState(false);
  useOnClickOutside(elem, () => setOpenBasket(false));

  const totalPrice = props.selectedNFTLists.reduce(
    (total, nft) => total + nft.solPrice,
    0
  );

  // Buy NFT Function
  const handleBuyNFTFunc = async () => {
    if (props.selectedNFTLists.length === 0) {
      errorAlert("Please select the nfts");
    } else {
      if (
        wallet &&
        props.selectedNFTLists !== undefined &&
        props.selectedNFTLists.length !== 0
      ) {
        if (myBalance < totalPrice) {
          errorAlert("You don't have enough sol.");
        } else {
          try {
            openFunctionLoading();
            const tx = await purchasePNft(wallet, props.selectedNFTLists);
            if (tx) {
              const result = await purchaseNFT(
                tx.transactions,
                tx.purchaseData,
                tx.mintAddrArray
              );
              if (result.type === "success") {
                await Promise.all([
                  getOwnNFTs(),
                  getAllListedNFTsBySeller(),
                  getAllListedNFTs(),
                  getAllCollectionData(),
                  props.setSelectedNFTs(),
                ]);
                closeFunctionLoading();
                successAlert("Success");
                route.push("/me");
              } else {
                closeFunctionLoading();
                errorAlert("Something went wrong.");
              }
            } else {
              closeFunctionLoading();
              errorAlert("Something went wrong.");
            }
          } catch (e) {
            console.log("err =>", e);
            errorAlert("Something went wrong.");
            closeFunctionLoading();
          }
        }
      }
    }
  };

  // NFT Delist Function
  const handleDelistMyNFTFunc = async () => {
    if (!wallet || props.selectedNFTLists === undefined) {
      return;
    }

    try {
      openFunctionLoading();

      // Delist the NFT
      const tx = await pNftDelist(wallet, props.selectedNFTLists);

      if (tx) {
        const result = await delistNftApi(
          tx.transactions,
          tx.delistData,
          tx.mintAddrArray
        );

        if (result.type === "success") {
          // Refresh data after successful delist
          await Promise.all([
            getOwnNFTs(),
            getAllListedNFTsBySeller(),
            getAllListedNFTs(),
            getAllCollectionData(),
            props.setSelectedNFTs(),
          ]);
          successAlert("Success");
        } else {
          errorAlert("Something went wrong.");
        }
      } else {
        errorAlert("Something went wrong.");
      }
    } catch (e) {
      console.error("Error:", e);
      errorAlert("Something went wrong.");
    } finally {
      closeFunctionLoading();
    }
  };

  const handleSetMultiPrice = async (index: number, price: number) => {
    props.selectedNFTLists[index].solPrice = price;
  };

  // NFT List Function
  const handleListMyNFTFunc = async () => {
    if (
      !wallet ||
      props.selectedNFTLists === undefined ||
      props.selectedNFTLists.length === 0
    ) {
      return;
    }
    if (props.selectedNFTLists.some((data) => data.solPrice === 0)) {
      errorAlert("Please enter the price.");
      return;
    }

    try {
      openFunctionLoading();

      // Update the itemDetail price
      // List the NFT for sale
      const tx = await listPNftForSale(wallet, props.selectedNFTLists);

      if (tx) {
        const result = await listNftApi(tx.transactions, tx.listData);

        if (result.type === "success") {
          // Refresh data after successful listing
          await Promise.all([
            getOwnNFTs(),
            getAllListedNFTsBySeller(),
            getAllListedNFTs(),
            getAllCollectionData(),
            props.setSelectedNFTs(),
          ]);
          successAlert("Success");
        } else {
          errorAlert("Something went wrong.");
        }
      } else {
        errorAlert("Something went wrong.");
      }
    } catch (e) {
      console.error("Error:", e);
      errorAlert("Something went wrong.");
    } finally {
      closeFunctionLoading();
    }
  };

  return (
    <div className="bg-darkgreen w-full md:flex hidden items-center justify-between md:flex-row flex-col border-t px-2 border-customborder pt-3">
      <div className="flex items-center justify-center gap-2 w-full md:w-auto">
        <div className="items-center gap-2 justify-center flex border border-customborder rounded-md px-1">
          <input
            placeholder="0"
            type="number"
            className="outline-none bg-transparent w-[50px] text-white px-2 py-1"
            value={
              props.selectedNFTLists.length === 0
                ? ""
                : Math.min(props.selectedNFTLists.length, props.nftLength)
            }
            max={props.nftLength}
            onChange={(e) => {
              const newValue = Math.min(
                Number(e.target.value),
                props.nftLength
              );
              props.rangeSelection(newValue);
            }}
          />
          <p className="text-sm text-gray-200 uppercase">items</p>
        </div>
        <input
          type="range"
          className="focus:outline-none outline-none"
          max={props.nftLength}
          value={props.selectedNFTLists.length}
          onChange={(e) => props.rangeSelection(Number(e.target.value))}
        />
      </div>
      <div className="flex items-center justify-center gap-2 relative">
        <button
          className="bg-yellow-600 rounded-md py-1 text-white px-10 cursor-pointer hover:bg-yellow-500 duration-300 uppercase"
          onClick={() =>
            props.functionState === "buy"
              ? handleBuyNFTFunc()
              : props.functionState === "delist"
              ? handleDelistMyNFTFunc()
              : handleListMyNFTFunc()
          }
        >
          {props.functionState}
        </button>
        <div
          className="p-2 rounded-md bg-white cursor-pointer relative"
          onClick={() => setOpenBasket(!openBasket)}
        >
          <SlBasket color="black" />
          <div
            className={`bg-red-500 flex items-center justify-center text-white rounded-full absolute -top-2 -right-2 text-sm w-3 h-3 p-[10px]
            ${props.selectedNFTLists.length === 0 && "hidden"}`}
          >
            {props.selectedNFTLists.length}
          </div>
        </div>
        <div
          className={`w-[350px] absolute right-0 top-10 rounded-md border border-customborder
            bg-darkgreen shadow-sm shadow-black z-50 duration-300 origin-top ${
              openBasket
                ? "scale-100 opacity-100 pointer-events-auto"
                : "scale-75 opacity-0 pointer-events-none"
            }`}
          ref={elem}
        >
          <div
            className={`w-full ${
              props.selectedNFTLists.length === 0 && "hidden"
            }`}
          >
            <div
              className={`w-full flex items-center justify-start flex-col gap-2 min-h-[20vh] max-h-[30vh] overflow-y-auto bg-[#14532d44] border-b border-customborder p-2
              `}
            >
              {props.selectedNFTLists.map((_, index) => (
                <div
                  className="w-full flex justify-between items-center"
                  key={index}
                >
                  <div className="flex items-center justify-center gap-2 relative">
                    <div className="relative flex">
                      <img
                        src={_.imgUrl}
                        className="w-[50px] h-[50px] object-cover rounded-md"
                        alt="Avatar"
                      />
                      <span
                        className="absolute -top-2 p-[2px] -right-2 rounded-full bg-gray-800 cursor-pointer"
                        onClick={() =>
                          props.toggleSelection(props.selectedNFTLists[index])
                        }
                      >
                        <CgClose color="white" />
                      </span>
                    </div>
                    <span className="text-white text-md">{_.tokenId}</span>
                  </div>
                  <div
                    className={`flex items-center justfiy-center gap-2 text-white ${
                      props.functionState !== "list" && "hidden"
                    }`}
                  >
                    <input
                      className={`outline-none bg-transparent border-customborder border rounded-md w-[70px] text-white py-1 px-1 `}
                      placeholder="0"
                      onChange={(e) =>
                        handleSetMultiPrice(index, Number(e.target.value))
                      }
                    />
                    sol
                  </div>
                  <div
                    className={`flex items-center justify-center gap-2 ${
                      props.functionState === "list" && "hidden"
                    }`}
                  >
                    <img
                      src="/svgs/solana-sol-logo.svg"
                      className="w-[10px] h-[10px] object-cover"
                      alt="Sol SVG"
                    />
                    <span className="text-white text-md">{_.solPrice}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="w-full flex items-center justify-center flex-col gap-1 p-2">
              <div className="w-full flex items-center justify-between">
                <p className="text-gray-200">Total Price</p>
                <span className="text-white">{totalPrice.toFixed(2)} SOL</span>
              </div>
              {/* <div className="w-full flex items-center justify-between">
                <p className="text-gray-200">Royalty</p>
                <span className="text-white">262.8 SOL</span>
              </div>{" "}
              <div className="w-full flex items-center justify-between">
                <p className="text-gray-200">Taker Fee</p>
                <span className="text-white">262.8 SOL</span>
              </div>{" "} */}
              <span className="text-gray-400 text-sm">
                By clicking "Buy", you agree to the Mugs Terms of service.
              </span>
            </div>
          </div>
          <div
            className={`w-full flex items-center justify-center flex-col gap-2 h-[10vh] text-white bg-[#14532d44]
              ${props.selectedNFTLists.length !== 0 && "hidden"}`}
          >
            No Items
          </div>
        </div>
      </div>
    </div>
  );
}
