/* eslint-disable @next/next/no-img-element */
"use client";
import { FC, useContext, useEffect, useMemo, useState } from "react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { PublicKey } from "@solana/web3.js";
import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";
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
import { NFTCardType, OwnNFTDataType } from "@/types/types";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { listPNftForSale } from "@/utils/contractScript";
import { errorAlert, successAlert } from "../ToastGroup";
import { listNft } from "@/utils/api";
import { CollectionContext } from "@/contexts/CollectionContext";

const NFTDetailModal = () => {
  const wallet = useAnchorWallet();
  const { connected, publicKey } = useWallet();
  const pathName = usePathname();
  const currentRouter = pathName.split("/")[1];
  const { closeNFTDetailModal, nftDetailModalShow, selectedNFTDetail } =
    useContext(ModalContext);
  const [showState, setShowState] = useState(0);
  const [selectedNFT, setSelectedNFT] = useState<OwnNFTDataType | undefined>(
    undefined
  );
  const { ownNFTs } = useContext(NFTDataContext);
  const memoSelectedNFTDetail = useMemo(
    () => selectedNFTDetail,
    [selectedNFTDetail]
  );
  useEffect(() => {
    const data = ownNFTs.filter(
      (item) => item.mintAddr === memoSelectedNFTDetail[0]
    );
    setSelectedNFT(data[0]!);
  }, [ownNFTs, memoSelectedNFTDetail]);

  // NFT List Function
  const handlelistMyNFTFunc = async () => {
    if (wallet && selectedNFT !== undefined) {
      try {
        const tx = await listPNftForSale(wallet, [selectedNFT]);
        if (tx) {
          const result = await listNft(tx.transactions, tx.listData);
          if (result.type === "success") {
            successAlert("Success");
          } else {
            errorAlert("Something went wrong.");
          }
        } else {
          errorAlert("Something went wrong.");
        }
      } catch (e) {
        console.log("err =>", e);
        errorAlert("Something went wrong.");
      }
    }
  };
  return (
    <Modal open={nftDetailModalShow} onClose={closeNFTDetailModal} center>
      <div
        className={`xl:w-[1200px] lg:w-[950px] md:w-[680px] w-[290px] sm:w-[500px] relative`}
      >
        <div className="absolute top-0 right-0 cursor-pointer flex items-center justify-center gap-3">
          <div
            className="cursor-pointer outline-none"
            onClick={closeNFTDetailModal}
          >
            <Link href={`/item-details/${memoSelectedNFTDetail[0]}`}>
              <GoLinkExternal color="#CA8A04" size={22} />
            </Link>
          </div>
          <div className="cursor-pointer" onClick={closeNFTDetailModal}>
            <CgClose color="white" size={23} />
          </div>
        </div>

        <div className="top-10 z-[9999] w-[290px] py-2">
          <h1 className="text-2xl text-white py-1">Mugs# 14</h1>
          <div className="border border-customborder rounded-md flex w-full">
            {ModalTabMenu.map((item, index) => (
              <div
                className={`px-2 cursor-pointer ${
                  showState === index && "bg-yellow-600"
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
            <div className="lg:w-full relative aspect-square cursor-pointer">
              <img
                src={selectedNFT?.imgUrl!}
                className="rounded-lg object-cover w-full h-full"
                alt=""
              />
            </div>
            <div className="w-full flex flex-col justify-start items-start gap-2">
              <div className="flex flex-col gap-1">
                <h1 className="text-white text-2xl">Validat3rs #73</h1>
                <p className="text-yellow-500 texl-md">Validat3rs #73</p>
              </div>
              <div className="w-full flex items-center justify-start gap-2 rounded-md bg-transparant border border-customborder flex-col p-3">
                {/* <div className="w-full flex items-center justify-between">
                  <p className="text-sm text-gray-300">List Price</p>
                  <span className="text-md text-white">5.614 Sol</span>
                </div>
                <div className="w-full flex items-center justify-between">
                  <p className="text-sm text-gray-300">Taker Price</p>
                  <span className="text-md text-white">5.614 Sol</span>
                </div>
                <div className="w-full flex items-center justify-between">
                  <p className="text-sm text-gray-300">Royalty Price</p>
                  <span className="text-md text-white">5.614 Sol</span>
                </div>
                <div className="w-full flex items-center justify-between">
                  <p className="text-2xl text-gray-300">Total Price</p>
                  <span className="text-2xl text-white">5.614 Sol</span>
                </div> */}
                <input
                  className="w-full p-3 flex items-center placeholder:text-gray-500 outline-none text-white justify-between rounded-md border border-customborder bg-transparent"
                  placeholder="Input the price"
                  type="number"
                  onChange={(e) => {
                    if (selectedNFT) {
                      selectedNFT.price = Number(e.target.value);
                    }
                  }}
                />
                <div
                  className="w-full rounded-md py-2 text-center bg-yellow-600 text-white cursor-pointer"
                  onClick={handlelistMyNFTFunc}
                >
                  {currentRouter === "me" ? "List Now" : "Buy now"}
                </div>
              </div>

              <div className="w-full p-3 flex items-center justify-between rounded-md border-b border-customborder cursor-pointer">
                <span className="text-white font-bold text-md flex items-center justify-center gap-2">
                  <MdOutlineSecurity color="#EAB308" size={18} />
                  Attributes
                </span>
              </div>
              <div className={`w-full py-3 grid grid-cols-3 gap-3 rounded-md`}>
                {selectedNFT &&
                  selectedNFT.attribute.map((detail, index) => (
                    <div
                      className="rounded-md bg-darkgreen border border-customborder p-2"
                      key={index}
                    >
                      <p className="text-gray-400 text-sm">
                        {detail.trait_type}
                      </p>
                      <span className="text-white text-lg">{detail.value}</span>
                    </div>
                  ))}
              </div>

              <div className="w-full p-3 flex items-center justify-between rounded-md border-b border-customborder cursor-pointer">
                <span className="text-white font-bold text-md flex items-center justify-center gap-2">
                  <BiDetail color="#EAB308" size={19} />
                  Detail
                </span>
              </div>
              <div
                className={`w-full py-3 flex items-center justify-between flex-col gap-1 rounded-md cursor-pointer text-gray-400`}
              >
                <div className="w-full flex items-center justify-between">
                  <span>Mint Address</span>
                  <span className="text-white">
                    {selectedNFT &&
                      selectedNFT.mintAddr.slice(0, 4) +
                        " ... " +
                        selectedNFT.mintAddr.slice(-4)}
                  </span>
                </div>
                <div className="w-full flex items-center justify-between">
                  <span>OnChain Collection</span>
                  <span className="text-white">
                    {" "}
                    {selectedNFT &&
                      selectedNFT.collectionAddr.slice(0, 4) +
                        " ... " +
                        selectedNFT.collectionAddr.slice(-4)}
                  </span>
                </div>
                <div className="w-full flex items-center justify-between">
                  <span>Owner</span>
                  <span className="text-white">
                    {" "}
                    {selectedNFT &&
                      selectedNFT.owner.slice(0, 4) +
                        " ... " +
                        selectedNFT.owner.slice(-4)}
                  </span>
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
