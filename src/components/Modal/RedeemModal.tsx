"use client";

import { FC, useContext, useMemo, useState } from "react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import Modal from "react-responsive-modal";
import { CloseIcon } from "@/components/SvgIcons";
import { NFTDataContext } from "@/contexts/NFTDataContext";
import { ModalContext } from "@/contexts/ModalContext";
import { errorAlert } from "../ToastGroup";
import { RedeemModalProps } from "@/types/types";

const RedeemModal: FC<RedeemModalProps> = ({ handleRedeemFunc }) => {
  const { connected, publicKey } = useWallet();
  const { redeemModalShow, closeRedeemModal } = useContext(ModalContext);
  const { ownNFTs } = useContext(NFTDataContext);
  const { setVisible } = useWalletModal();
  const [email, setEmail] = useState("");
  const [homeAddr, setHomeAddr] = useState("");

  const memoizedOwnNFTs = useMemo(() => ownNFTs, [ownNFTs]);

  const checkValue = async () => {
    if (homeAddr === "" || email === "") {
      errorAlert("Please input all value correctly!");
    } else {
      closeRedeemModal();
      handleRedeemFunc(email, homeAddr);
    }
  };

  return (
    <Modal open={redeemModalShow} onClose={closeRedeemModal} center>
      <div className="rounded-lg flex items-start gap-3 justify-start relative flex-col">
        <div
          className="absolute top-0 right-0 cursor-pointer z-20"
          onClick={closeRedeemModal}
        >
          <CloseIcon />
        </div>
        <div className="w-full flex items-center justify-center">
          <h1 className="text-white text-2xl font-bold mt-1 text-center">
            MUGS REDEEM
          </h1>
        </div>

        <div className="w-full flex items-center justify-start">
          <div className="items-start justify-start flex flex-col">
            <span className="text-white font-normal text-md text-center text-sm">
              You have :
            </span>
          </div>

          {/* <div className="bg-white rounded-md flex items-center justify-center gap-4 py-1">
            <div
              className="text-black font-bold text-lg cursor-pointer flex items-center justify-center px-3"
              onClick={() => setCounts(counts <= 1 ? 1 : counts - 1)}
            >
              -
            </div>
            <span className="text-black font-bold text-xl">{counts}</span>
            <div
              className="text-black font-bold text-lg cursor-pointer px-3"
              onClick={() =>
                setCounts(
                  counts >= ownNFTs?.length ? ownNFTs?.length : counts + 1
                )
              }
            >
              +
            </div>
          </div> */}
        </div>
        <div
          className="bg-darkgreen border border-customborder rounded-md p-1 text-white w-[290px] sm:w-[350px] text-center flex items-center justify-start gap-2 flex-col
        max-h-[150px] overflow-y-auto"
        >
          {memoizedOwnNFTs &&
            memoizedOwnNFTs.map((item, index) => (
              <div
                className="w-full flex items-center justify-between px-1"
                key={index}
              >
                <p className="text-sm text-gray-400">
                  {"Mugs #" + item.tokenId}
                </p>
                <p className="text-sm text-gray-400">
                  {item.mintAddr.slice(0, 5) +
                    " ... " +
                    item.mintAddr.slice(-5)}
                </p>
              </div>
            ))}
        </div>
        <div className="bg-drakgreen border border-customborder rounded-md p-1 text-white w-[290px] sm:w-[350px] text-center flex items-center justify-start gap-2">
          <input
            className="outline-none bg-transparent text-gray-400 py-1 w-full px-1 text-sm"
            placeholder="Wallet Address"
            value={
              "My Wallet Addr : " +
              publicKey?.toBase58().slice(0, 10) +
              "..." +
              publicKey?.toBase58().slice(-10)
            }
            readOnly
          />
        </div>
        <div className="bg-drakgreen border border-customborder rounded-md p-1 text-white w-[290px] sm:w-[350px] text-center flex items-center justify-start gap-2">
          <input
            className="outline-none bg-transparent text-white py-1 w-full px-1 placeholder:text-[14px]"
            placeholder="Email"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>
        <div className="bg-drakgreen border border-customborder rounded-md p-1 text-white w-[290px] sm:w-[350px] text-center flex items-center justify-start gap-2">
          <input
            className="outline-none bg-transparent text-white py-1 w-full px-1 placeholder:text-[14px]"
            placeholder="Home Address"
            onChange={(e) => setHomeAddr(e.target.value)}
            value={homeAddr}
          />
        </div>
        <div className="bg-yellow-600 rounded-md px-3 py-2 text-white w-[290px] sm:w-[350px] text-center flex items-center justify-center gap-2">
          <span className="text-[12px]">One NFT will be burned!</span>
        </div>
        <button
          className="w-full p-2 bg-transparent border border-customborder text-white rounded-lg text-sm font-bold hover:border-white duration-300 "
          onClick={() => (connected ? checkValue() : setVisible(true))}
        >
          {connected ? `Redeem` : "Connect wallet"}
        </button>
      </div>
    </Modal>
  );
};

export default RedeemModal;
