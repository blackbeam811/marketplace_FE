"use client";

import React, {
  FC,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { web3 } from "@project-serum/anchor";
import { useWallet } from "@solana/wallet-adapter-react";
import { ExitIcon } from "../SvgIcons";
import ConnectButton from "../WalletConnectButton";
import { SOLANA_RPC, SOL_DECIMAL } from "@/config";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { FaWallet } from "react-icons/fa";
import { FaCopy } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";
import { FaUser } from "react-icons/fa";
import { BiMenu, BiSearch } from "react-icons/bi";
import { TfiWorld } from "react-icons/tfi";
import { FaExchangeAlt } from "react-icons/fa";

import { MdSettings } from "react-icons/md";
import { CgClose, CgWebsite } from "react-icons/cg";
import Image from "next/image";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { ModalContext } from "@/contexts/ModalContext";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import { BsDiscord, BsTwitterX } from "react-icons/bs";
import { BalanceProps, HeaderProps } from "@/types/types";

const Header: FC<HeaderProps> = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = usePathname();
  const { publicKey, connected } = useWallet();
  const { openSearchCollectionModal, setFilterWith } = useContext(ModalContext);
  const [myBalance, setMyBalance] = useState<number>(0);
  const [isFocused, setIsFocused] = useState(false);
  const [openMobileMenu, setOpenMobileMenu] = useState(false);

  useOnClickOutside(inputRef, () => setIsFocused(false));

  const getBalanceFunc = useCallback(async () => {
    const solConnection = new web3.Connection(SOLANA_RPC);
    if (publicKey) {
      let balance = await solConnection.getBalance(publicKey);
      setMyBalance(balance / SOL_DECIMAL);
    } else {
      setMyBalance(0);
    }
  }, [publicKey]);

  useEffect(() => {
    getBalanceFunc();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicKey]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "k") {
        event.preventDefault();
        setIsFocused(true);
        inputRef.current?.focus();
        openSearchCollectionModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <header className="border-b border-customborder fixed w-full bg-darkgreen z-10">
      <div className="py-2 px-4 flex items-center justify-between relative">
        <Link href={"/"} className="z-[1]">
          <div className="flex items-center justify-center gap-3">
            <div className="w-[30px] h-[30px] relative">
              <Image
                src="/images/logo6.png"
                fill
                alt=""
                className="object-cover"
              />
            </div>

            <h2 className="text-white text-xl uppercase font-extrabold hidden lg:block">
              MUGS
            </h2>
          </div>
        </Link>
        <div className="md:absolute left-0 right-0 flex items-center justify-center z-0">
          <div
            className={`2xl:min-w-[600px] xl:min-w-[500px] md:w-[350px] w-[150px] border rounded-md border-customborder hover:border-gray-400 duration-300 flex items-center justify-center gap-2 md:px-3 px-2 py-[1px]
          ${isFocused && "border-gray-400"}`}
          >
            <BiSearch color="white" />
            <input
              ref={inputRef}
              placeholder="Search all of Mugs"
              className={`outline-none bg-transparent w-full text-white py-2 md:py-[5px] md:px-1 font-thin text-[12px] md:text-sm placeholder:text-gray-300 ${
                isFocused && "border-gray-400"
              }`}
              onFocus={() => {
                setIsFocused(true);
              }}
              onClick={openSearchCollectionModal}
              onChange={(e) => setFilterWith(e.target.value)}
            />
            <div className="bg-gray-300 rounded-sm text-[12px] text-gray-900 px-1 hidden md:block">
              CTRL+K
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 z-[1]">
          <ul className="lg:flex items-center justify-center gap-3 hidden">
            <li
              className={` text-white text-sm mr-5 cursor-pointer uppercase font-bold duration-300 hover:text-yellow-600 ${
                router === "/" ? "text-yellow-600 list-disc" : "list-none"
              }`}
            >
              <Link href={"/"}>Collection</Link>
            </li>
            <li
              className={` text-white text-sm mr-5 cursor-pointer uppercase font-bold duration-300 hover:text-yellow-600 ${
                router === "/mint" ? "text-yellow-600 list-disc" : "list-none"
              }`}
            >
              <Link href={"/mint"}>Mint</Link>
            </li>
          </ul>

          {connected && (
            <BalanceBox myBalance={myBalance} address={publicKey} />
          )}
          {!connected && <ConnectButton />}
          <div
            className="cursor-pointer flex lg:hidden bg-transparent border border-customborder rounded-md p-1"
            onClick={() => setOpenMobileMenu(true)}
          >
            <BiMenu size={22} color="white" />
          </div>
        </div>
        <MobileMenu
          openMobileMenu={openMobileMenu}
          close={() => setOpenMobileMenu(false)}
        />
      </div>
    </header>
  );
};

export default Header;

const BalanceBox: FC<BalanceProps> = ({ myBalance }) => {
  const { setVisible } = useWalletModal();
  const { publicKey, disconnect } = useWallet();
  const [openModal, setOpenModal] = useState(false);
  const [showCheck, setShowCheck] = useState(false);
  const elem = useRef(null);
  useOnClickOutside(elem, () => setOpenModal(false));

  const handleCopy = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey.toBase58());
      setShowCheck(true);
      setTimeout(() => {
        setShowCheck(false);
      }, 1000);
    }
  };
  return (
    <div className="border p-2 py-2 flex items-center gap-3 rounded-md border-yellow-600">
      <div
        className={`flex gap-2 items-center justify-center cursor-pointer`}
        onClick={() => setOpenModal(true)}
      >
        <div className="w-[18px] h-[18px] relative">
          <Image
            src="/svgs/solana-sol-logo.svg"
            alt="Avatar"
            fill
            className=""
          />
        </div>
        <span className="text-yellow-600 text-md leading-[1] font-bold">
          {myBalance?.toFixed(2)} SOL
        </span>
      </div>
      <div
        className={`w-[300px] absolute right-[10px] top-1 bg-darkgreen border-yellow-600 border-opacity-30 shadow-md shadow-[#ebdb6042] border rounded-md hover:duration-300 z-[9999]
       duration-200 origin-top-right`}
        ref={elem}
        style={{
          opacity: openModal ? 1 : 0,
          scale: openModal ? 1 : 0.6,
          pointerEvents: openModal ? "all" : "none",
        }}
      >
        <div className="w-full flex items-center justify-between px-2 py-2 border-b border-customborder">
          <div className="flex items-center justify-center gap-2">
            <div className="relative w-[30px] h-[30px] rounded-full gap-3">
              <Image
                alt="Avatar"
                src={"/svgs/initialAvatar.svg"}
                fill
                className="rounded-full"
              />
            </div>
            <span className="text-white">
              {" "}
              {publicKey?.toBase58().slice(0, 4) +
                "...." +
                publicKey?.toBase58().slice(-4)}
            </span>
          </div>
          <span
            className="cursor-pointer mb-3"
            onClick={() => setOpenModal(false)}
          >
            <CgClose color="white" size={22} />
          </span>
        </div>
        <ul className=" border-gray-500 rounded-lg bg-darkgreen p-2 mt-1 pt-2">
          <li className="flex gap-2 items-center mb-3 text-sm duration-300 text-white transition-all w-full justify-between">
            <span className="flex items-center justify-center gap-[7px]">
              <FaWallet color="#86B0A8" size={15} className="pl-[2px]" />
              My Wallet :
            </span>
            <span className="flex items-center justify-center gap-1">
              {" "}
              {publicKey?.toBase58().slice(0, 4) +
                "...." +
                publicKey?.toBase58().slice(-4)}
              <span className="cursor-pointer">
                {!showCheck && <FaCopy onClick={handleCopy} />}
                {showCheck && <FaCheck />}
              </span>
            </span>
          </li>
          <li className="flex gap-2 items-center mb-3 text-sm hover:text-yellow-600 duration-300 text-white transition-all cursor-pointer">
            <FaUser size={14} color="#86B0A8" className="pl-[2px]" />
            <Link href="/me">My Items</Link>
          </li>
          <li className="flex gap-[5px] items-center mb-3 text-sm hover:text-yellow-600 duration-300 text-white transition-all cursor-pointer">
            <MdSettings size={17} color="#86B0A8" />
            <Link href="/account/settings">Account Settings</Link>
          </li>
          <li>
            <div
              className="flex gap-2 items-center mb-3 text-sm hover:text-yellow-600 duration-300 text-white transition-all cursor-pointer"
              onClick={() => setVisible(true)}
            >
              <FaExchangeAlt size={14} color="#86B0A8" className="pl-[2px]" />{" "}
              Change Wallet
            </div>
          </li>
          <li className="border-b-[1px] border-white border-opacity-15 pb-3">
            <button
              className="flex gap-[6px] items-center text-sm hover:text-yellow-600 duration-300 text-white transition-all cursor-pointer"
              onClick={disconnect}
            >
              <ExitIcon className="brightness-200" /> Disconnect
            </button>
          </li>
          <li className="flex items-center justify-start gap-3 p-2">
            <span className="text-white bg-gray-600 p-1 rounded-md hover:bg-gray-700 duration-300 cursor-pointer">
              <BsTwitterX />
            </span>
            <span className="text-white bg-gray-600 p-1 rounded-md hover:bg-gray-700 duration-300 cursor-pointer">
              <BsDiscord />
            </span>
            <span className="text-white bg-gray-600 p-1 rounded-md hover:bg-gray-700 duration-300 cursor-pointer">
              <TfiWorld />
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

const MobileMenu: FC<{ openMobileMenu: boolean; close: () => void }> = ({
  openMobileMenu,
  close,
}) => {
  const router = usePathname();

  return (
    <div
      className={`fixed top-0 bottom-0 left-0 right-0 bg-gray-900 z-[9999] flex items-center justify-center lg:hidden
    ${!openMobileMenu && "hidden"}`}
    >
      <div className="absolute top-4 right-3" onClick={close}>
        <CgClose size={25} color="white" />
      </div>
      <ul className="flex items-center justify-center gap-4 flex-col">
        <li
          className={`text-white font-normal uppercase text-3xl ${
            router === "/" && "border-b-[1px] border-white"
          }`}
        >
          <Link href={"/"}>Mint</Link>
        </li>
        <li
          className={`text-white font-normal uppercase text-3xl ${
            router === "/market" && "border-b-[1px] border-white"
          }`}
        >
          <Link href={"/market"}>Marketplace</Link>
        </li>
      </ul>
    </div>
  );
};
