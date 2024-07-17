/* eslint-disable @next/next/no-img-element */
"use client";
import { useContext, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CgClose } from "react-icons/cg";
import { SlBasket } from "react-icons/sl";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import { OwnNFTDataType } from "@/types/types";
import { NFTDataContext } from "@/contexts/NFTDataContext";
import { LoadingContext } from "@/contexts/LoadingContext";
import { errorAlert, successAlert } from "../ToastGroup";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import {
  listPNftForSale,
  pNftDelist,
  purchasePNft,
} from "@/utils/contractScript";
import { delistNftApi, listNftApi, purchaseNFT } from "@/utils/api";
import { CollectionContext } from "@/contexts/CollectionContext";

export default function MobileItemMultiSelectBar(props: {
  nftLength: number;
  rangeSelection: (length: number) => void;
  selectedNFTLists: OwnNFTDataType[];
  toggleSelection: (item: OwnNFTDataType) => void;
  functionState: string;
  setSelectedNFTs: () => void;
}) {
  const elem = useRef(null);
  const wallet = useAnchorWallet();
  const param = useSearchParams();
  const route = useRouter();
  const activeTab = param.get("activeTab") || "items";
  const [isBasketOpen, setIsBasketOpen] = useState(false);
  useOnClickOutside(elem, () => setIsBasketOpen(false));

  const { myBalance, getAllListedNFTs, getOwnNFTs, getAllListedNFTsBySeller } =
    useContext(NFTDataContext);
  const { openFunctionLoading, closeFunctionLoading } =
    useContext(LoadingContext);
  const { getAllCollectionData } = useContext(CollectionContext);

  if (activeTab !== "items") {
    return null;
  }

  const toggleBasket = () => setIsBasketOpen((prevState) => !prevState);

  const totalPrice = props.selectedNFTLists.reduce(
    (total, nft) => total + nft.solPrice,
    0
  );

  // Buy NFT Function
  const handleBuyNFTFunc = async () => {
    if (wallet && props.selectedNFTLists !== undefined) {
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
    <div className="fixed bottom-[3.4rem] left-0 right-0 w-full md:hidden border-t border-customborder bg-darkgreen p-1 z-50 flex items-center justify-between">
      <button
        className="bg-yellow-600 text-sm rounded-md px-8 py-[5px] text-white"
        onClick={() =>
          props.functionState === "buy"
            ? handleBuyNFTFunc()
            : props.functionState === "delist"
            ? handleDelistMyNFTFunc()
            : handleListMyNFTFunc()
        }
      >
        {props.functionState === "delist"
          ? "Delist "
          : props.functionState === "buy"
          ? "Buy "
          : "List "}{" "}
        now
      </button>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 border border-customborder rounded-md px-1">
          <input
            placeholder="0"
            type="number"
            className="outline-none bg-transparent w-[70px] text-white px-2 py-1"
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
        <div
          className="p-[6px] rounded-md bg-darkgreen cursor-pointer border border-customborder relative"
          onClick={toggleBasket}
        >
          <SlBasket color="white" />
          <div
            className={`bg-red-500 flex items-center justify-center text-white rounded-full absolute -top-2 right-4 text-sm w-3 h-3 p-[8px]
            ${props.selectedNFTLists.length === 0 && "hidden"}`}
          >
            {props.selectedNFTLists.length}
          </div>
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
          {props.selectedNFTLists.map((_, index) => (
            <div
              className="w-full flex justify-between items-center"
              key={index}
            >
              <div className="flex items-center gap-2">
                <div className="relative flex">
                  <img
                    src={_.imgUrl}
                    className="w-[50px] h-[50px] object-cover rounded-md"
                    alt="Avatar"
                  />
                  <CgClose
                    className="absolute -top-2 -right-2 p-[2px] rounded-full bg-gray-800 text-white"
                    onClick={() =>
                      props.toggleSelection(props.selectedNFTLists[index])
                    }
                  />
                </div>
                <span className="text-white text-md">#{_.tokenId}</span>
              </div>
              <div
                className={`items-center justfiy-center gap-2 text-white ${
                  props.functionState === "list" ? "flex" : "hidden"
                }`}
              >
                <input
                  className={`outline-none bg-transparent border-customborder border rounded-md w-[70px] text-white py-1 px-1`}
                  placeholder="0"
                  onChange={(e) =>
                    handleSetMultiPrice(index, Number(e.target.value))
                  }
                />
                sol
              </div>
              <div
                className={`items-center gap-2 ${
                  props.functionState !== "list" ? "flex" : "hidden"
                }`}
              >
                <img
                  src="/svgs/solana-sol-logo.svg"
                  className="w-[10px] h-[10px] object-cover"
                  alt="Sol SVG"
                />
                <span className="text-white text-md">{_.solPrice} SOL</span>
              </div>
            </div>
          ))}
          <div
            className={`w-full flex items-center justify-center min-h-[40vh] ${
              props.selectedNFTLists.length !== 0 && "hidden"
            }`}
          >
            <p className="text-white text-md">No items</p>
          </div>
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
            By clicking "{" "}
            {props.functionState === "delist"
              ? "Delist "
              : props.functionState === "buy"
              ? "Buy "
              : "List "}
            ", you agree to the Mugs Terms of service.
          </span>
        </div>
        <button
          className="w-[90%] text-center text-white bg-yellow-600 rounded-md py-2 absolute bottom-3"
          onClick={() =>
            props.functionState === "buy"
              ? handleBuyNFTFunc()
              : props.functionState === "delist"
              ? handleDelistMyNFTFunc()
              : handleListMyNFTFunc()
          }
        >
          {props.functionState === "delist"
            ? "Delist "
            : props.functionState === "buy"
            ? "Buy "
            : "List "}{" "}
          {props.selectedNFTLists.length} items for {totalPrice.toFixed(2)} SOL
        </button>
      </div>
    </div>
  );
}
