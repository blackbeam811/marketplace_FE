"use client";

import React, { FC, useCallback, useEffect, useState } from "react";
import { web3 } from "@project-serum/anchor";
import { useWallet } from "@solana/wallet-adapter-react";
import { FireIcon, SolanaIcon } from "../SvgIcons";
import ConnectButton from "../WalletConnectButton";
import { SOLANA_RPC, SOL_DECIMAL } from "@/config";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { BiMenu } from "react-icons/bi";
import { CgClose } from "react-icons/cg";
import Image from "next/image";

interface HeaderProps {
  title?: string;
}

interface BalanceProps {
  myBalance?: number;
  address: web3.PublicKey | null;
}

const Header: FC<HeaderProps> = ({ title = "" }) => {
  const router = usePathname();
  const { publicKey, disconnect, connected } = useWallet();
  const [myBalance, setMyBalance] = useState<number>(0);
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

  return (
    <header className="border-b border-gray-600">
      <div className="py-2 px-4 flex items-center justify-between">
        <div className="flex items-center justify-center gap-3">
          <div className="w-[30px] h-[30px] rounded-full relative hidden md:block">
            <Image
              src="/images/logo.png"
              fill
              alt=""
              className="object-cover rounded-md"
            />
          </div>

          <h2 className="text-white text-3xl uppercase font-extrabold">
            <Link href={"/"}>MUGS.DC</Link>
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <ul className="md:flex items-center justify-center gap-3 hidden">
            <li
              className={` text-white text-sm mr-5 font-bold cursor-pointer duration-300 hover:text-yellow-400 ${
                router === "/" ? "text-yellow-400 list-disc" : "list-none"
              }`}
            >
              <Link href={"/"}>Mint</Link>
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
          <ConnectButton />
          <div
            className="cursor-pointer flex md:hidden"
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
  return (
    <div className="border p-2 py-[9px] hidden sm:flex items-center gap-3 rounded-md border-gray-500">
      <div className="w-[18px] h-[18px] relative">
        <Image src="/svgs/solana-sol-logo.svg" alt="Avatar" fill className="" />
      </div>
      <span className="text-yellow-400 text-sm leading-[1] font-bold">
        {myBalance?.toFixed(2)} SOL
      </span>
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
      className={`fixed top-0 bottom-0 left-0 right-0 bg-black bg-opacity-60 backdrop-blur-sm z-[9999] flex items-center justify-center md:hidden
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
