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
import {
  ExitIcon,
  FireIcon,
  ProfileIcon,
  SolanaIcon,
  WalletIcon,
} from "../SvgIcons";
import ConnectButton from "../WalletConnectButton";
import { SOLANA_RPC, SOL_DECIMAL } from "@/config";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { BiMenu, BiSearch } from "react-icons/bi";
import { CgClose } from "react-icons/cg";
import Image from "next/image";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { ModalContext } from "@/contexts/ModalContext";

interface HeaderProps {
  title?: string;
}

interface BalanceProps {
  myBalance?: number;
  address: web3.PublicKey | null;
}

const Header: FC<HeaderProps> = ({ title = "" }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = usePathname();
  const { publicKey, disconnect, connected } = useWallet();
  const { openSearchCollectionModal } = useContext(ModalContext);

  const [myBalance, setMyBalance] = useState<number>(0);
  const [isFocused, setIsFocused] = useState(false);
  const [openMobileMenu, setOpenMobileMenu] = useState(false);

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
  }, []);

  return (
    <header className="border-b border-gray-600 fixed w-full bg-[#111827] z-10">
      <div className="py-2 px-4 flex items-center justify-between">
        <div className="flex items-center justify-center gap-3">
          <div className="w-[30px] h-[30px] rounded-full relative">
            <Image
              src="/images/logo.png"
              fill
              alt=""
              className="object-cover rounded-md"
            />
          </div>

          <h2 className="text-white text-3xl uppercase font-extrabold hidden lg:block">
            <Link href={"/"}>MUGS.DC</Link>
          </h2>
        </div>
        <div className="2xl:min-w-[700px] xl:min-w-[500px] w-[350px] border-[1px] rounded-md border-gray-600 flex items-center justify-center gap-2 px-3">
          <BiSearch color="white" />
          <input
            ref={inputRef}
            placeholder="Search all of Mugs"
            className="outline-none bg-transparent w-full text-white py-1 px-1 font-thin"
            onFocus={() => {
              setIsFocused(true);
            }}
            onClick={openSearchCollectionModal}
          />
          <div className="bg-gray-700 rounded-md text-[12px] text-white px-1">
            CTRL+K
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ul className="lg:flex items-center justify-center gap-3 hidden">
            <li
              className={` text-white text-sm mr-5 font-bold cursor-pointer duration-300 hover:text-yellow-400 ${
                router === "/" ? "text-yellow-400 list-disc" : "list-none"
              }`}
            >
              <Link href={"/"}>Collection</Link>
            </li>
            <li
              className={` text-white text-sm mr-5 font-bold cursor-pointer duration-300 hover:text-yellow-400 ${
                router === "/mint" ? "text-yellow-400 list-disc" : "list-none"
              }`}
            >
              <Link href={"/mint"}>Mint</Link>
            </li>
            <li
              className={` text-white text-sm mr-5 font-bold cursor-pointer duration-300 hover:text-yellow-400 ${
                router === "/market" ? "text-yellow-400 list-disc" : "list-none"
              }`}
            >
              <Link href={"/market"}>Marketplace</Link>
            </li>
          </ul>

          {/* <div
            className="border p-[10px] py-[9px] flex items-center gap-3 rounded-md border-gray-500
          hover:bg-gray-800 duration-300 cursor-pointer"
            onClick={onOpenModal}
          >
            <FireIcon />
          </div> */}
          {connected && (
            <BalanceBox myBalance={myBalance} address={publicKey} />
          )}
          {!connected && <ConnectButton />}
          <div
            className="cursor-pointer flex lg:hidden"
            onClick={() => setOpenMobileMenu(true)}
          >
            <BiMenu size={23} color="white" />
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

const BalanceBox: FC<BalanceProps> = ({ myBalance, address }) => {
  const { setVisible } = useWalletModal();
  const { publicKey, disconnect } = useWallet();

  return (
    <div className="border p-2 py-[9px] hidden sm:flex items-center gap-3 rounded-md border-gray-500 group">
      <div className="w-[18px] h-[18px] relative">
        <Image src="/svgs/solana-sol-logo.svg" alt="Avatar" fill className="" />
      </div>
      <span className="text-yellow-400 text-sm leading-[1] font-bold">
        {myBalance?.toFixed(2)} SOL
      </span>
      <div className="w-[160px] absolute right-[18px] top-[58px] hidden group-hover:block bg-gray-700 shadow-lg rounded-xl hover:duration-300 z-[9999]">
        <ul className="border border-gray-500 rounded-lg bg-grayborder-gray-500 p-2 mt-1">
          <li className="flex gap-2 items-center mb-3 text-sm hover:text-yellow-400 duration-300 text-white transition-all">
            <ProfileIcon className="brightness-200" />
            <Link href="/myitem">My Items</Link>
          </li>
          <li>
            <div
              className="flex gap-2 items-center mb-3 text-sm hover:text-yellow-400 duration-300 text-white transition-all"
              onClick={() => setVisible(true)}
            >
              <WalletIcon className="brightness-200" /> Change Wallet
            </div>
          </li>
          <li>
            <button
              className="flex gap-2 items-center text-sm hover:text-yellow-400 duration-300 text-white transition-all"
              onClick={disconnect}
            >
              <ExitIcon className="brightness-200" /> Disconnect
            </button>
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
      className={`fixed top-0 bottom-0 left-0 right-0 bg-black bg-opacity-60 backdrop-blur-sm z-[9999] flex items-center justify-center lg:hidden
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
