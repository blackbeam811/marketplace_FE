"use client";

import { FC, useContext, useEffect, useMemo, useState } from "react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import Modal from "react-responsive-modal";
import { ArrowIcon, CloseIcon } from "@/components/SvgIcons";
import { NFTDataContext } from "@/contexts/NFTDataContext";
import { ModalContext } from "@/contexts/ModalContext";
import Image from "next/image";
import { TfiAnnouncement } from "react-icons/tfi";
import { MdOutlineLocalOffer, MdOutlineSecurity } from "react-icons/md";
import { BiDetail, BiLineChart } from "react-icons/bi";
import ActivityTable from "../ActivityTable";
import { ModalTabMenu } from "@/data/tabMenuData";
import { CgClose } from "react-icons/cg";
import { GoLinkExternal } from "react-icons/go";

import { collectionItems } from "@/data/collectionItems";
import { NFTCardType } from "@/types/types";
import Link from "next/link";

const NFTDetailModal = () => {
  const { connected, publicKey } = useWallet();
  const { closeNFTDetailModal, nftDetailModalShow, selectedNFTDetail } =
    useContext(ModalContext);
  const [showState, setShowState] = useState(0);
  const [selectedNFT, setSelectedNFT] = useState<NFTCardType>();

  const memoSelectedNFTDetail = useMemo(
    () => selectedNFTDetail,
    [selectedNFTDetail]
  );
  useEffect(() => {
    const data = collectionItems.filter(
      (item) => item.mintAddr === memoSelectedNFTDetail[0]
    );
    setSelectedNFT(data[0]!);
  }, [memoSelectedNFTDetail]);
  return (
    <Modal open={nftDetailModalShow} onClose={closeNFTDetailModal} center>
      <div
        className={`xl:w-[1200px] lg:w-[950px] md:w-[680px] w-[290px] sm:w-[500px] relative`}
      >
        <div className="absolute top-0 right-0 cursor-pointer flex items-center justify-center gap-3">
          <div className="cursor-pointer" onClick={closeNFTDetailModal}>
            <Link href={`/item-details/${memoSelectedNFTDetail[0]}`}>
              <GoLinkExternal color="#DB2777" size={22} />
            </Link>
          </div>
          <div className="cursor-pointer" onClick={closeNFTDetailModal}>
            <CgClose color="white" size={23} />
          </div>
        </div>

        <div className="top-10 z-[9999] w-[290px] py-2">
          <h1 className="text-2xl text-white py-1">Mugs# 14</h1>
          <div className="border-[1px] border-gray-700 rounded-md flex w-full">
            {ModalTabMenu.map((item, index) => (
              <div
                className={`px-2 cursor-pointer ${
                  showState === index && "bg-pink-600 "
                } rounded-md w-[100px] text-white text-center text-[12px] py-1`}
                onClick={() => setShowState(index)}
                key={index}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="w-full flex items-start justify-start max-h-[70vh] overflow-y-auto md:min-h-[70vh] min-h-[70vh] relative">
          <div
            className={`w-full grid md:grid-cols-2 grid-cols-1 gap-5 lg:gap-10 pr-2 ${
              showState !== 0 && "hidden"
            }`}
          >
            <div className="lg:w-full relative lg:h-[450px] xl:h-[550px] h-[350px] cursor-pointer">
              <Image
                src={selectedNFT?.imgUrl!}
                fill
                className="rounded-lg object-cover"
                alt=""
              />
            </div>
            <div className="w-full flex flex-col justify-start items-start gap-2">
              <div className="flex flex-col gap-1">
                <h1 className="text-white text-2xl">Validat3rs #73</h1>
                <p className="text-pink-600 texl-md">Validat3rs #73</p>
              </div>
              <div className="w-full flex items-center justify-start gap-2 rounded-md bg-gray-800 min-h-[200px] flex-col p-3">
                <div className="w-full flex items-center justify-between">
                  <p className="text-md text-gray-300">List Price</p>
                  <span className="text-md text-white">5.614 Sol</span>
                </div>
                <div className="w-full flex items-center justify-between">
                  <p className="text-md text-gray-300">Taker Price</p>
                  <span className="text-md text-white">5.614 Sol</span>
                </div>
                <div className="w-full flex items-center justify-between">
                  <p className="text-md text-gray-300">Royalty Price</p>
                  <span className="text-md text-white">5.614 Sol</span>
                </div>
                <div className="w-full flex items-center justify-between">
                  <p className="text-2xl text-gray-300">Total Price</p>
                  <span className="text-2xl text-white">5.614 Sol</span>
                </div>
                <div className="w-full rounded-md py-2 text-center bg-pink-600 text-white cursor-pointer">
                  Buy now
                </div>
              </div>

              <div className="w-full p-3 flex items-center justify-between rounded-md border-[1px] border-gray-700 cursor-pointer">
                <span className="text-white font-bold text-md flex items-center justify-center gap-2">
                  <TfiAnnouncement color="#DB2777" />
                  About Validat3rs
                </span>
              </div>
              <div
                className={`w-full p-3 flex items-center justify-between rounded-md border-[1px] border-gray-700 cursor-pointer text-gray-400 `}
              >
                Validat3rs NFT provides access to top-tier RPC nodes on the
                Solana blockchain, optimized for speed and efficiency.
              </div>

              <div className="w-full p-3 flex items-center justify-between rounded-md border-[1px] border-gray-700 cursor-pointer">
                <span className="text-white font-bold text-md flex items-center justify-center gap-2">
                  <MdOutlineSecurity color="#DB2777" size={18} />
                  Attributes
                </span>
              </div>
              <div
                className={`w-full p-3 grid grid-cols-3 gap-3 rounded-md border-[1px] border-gray-700`}
              >
                <div className="rounded-md bg-gray-800 p-2">
                  <p className="text-gray-400">Renewed</p>
                  <span className="text-white">False</span>
                </div>
                <div className="rounded-md bg-gray-800 p-2">
                  <p className="text-gray-400">Renewed</p>
                  <span className="text-white">False</span>
                </div>
                <div className="rounded-md bg-gray-800 p-2">
                  <p className="text-gray-400">Renewed</p>
                  <span className="text-white">False</span>
                </div>
                <div className="rounded-md bg-gray-800 p-2">
                  <p className="text-gray-400">Renewed</p>
                  <span className="text-white">False</span>
                </div>
              </div>

              <div className="w-full p-3 flex items-center justify-between rounded-md border-[1px] border-gray-700 cursor-pointer">
                <span className="text-white font-bold text-md flex items-center justify-center gap-2">
                  <BiDetail color="#DB2777" size={19} />
                  Detail
                </span>
              </div>
              <div
                className={`w-full p-3 flex items-center justify-between flex-col gap-1 rounded-md border-[1px] border-gray-700 cursor-pointer text-gray-400`}
              >
                <div className="w-full flex items-center justify-between">
                  <span>Mint Address</span>
                  <span>9e2tgt..23fgdrg2</span>
                </div>
                <div className="w-full flex items-center justify-between">
                  <span>OnChain Collection</span>
                  <span>9e2tgt..23fgdrg2</span>
                </div>
                <div className="w-full flex items-center justify-between">
                  <span>Token Address</span>
                  <span>9e2tgt..23fgdrg2</span>
                </div>
                <div className="w-full flex items-center justify-between">
                  <span>Owner</span>
                  <span>9e2tgt..23fgdrg2</span>
                </div>
              </div>
            </div>
          </div>
          <div
            className={`w-full flex items-start justify-start gap-2 flex-col ${
              showState !== 1 && "hidden"
            }`}
          >
            <ActivityTable />
          </div>
          <div
            className={`w-full flex items-start justify-start gap-2 flex-col ${
              showState !== 2 && "hidden"
            }`}
          >
            <ActivityTable />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default NFTDetailModal;
