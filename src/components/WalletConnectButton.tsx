"use client";

import Link from "next/link";
import { FC } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { WalletIcon, ExitIcon, ArrowIcon } from "./SvgIcons";
import { ProfileIcon } from "./SvgIcons/ProfileIcon";

const ConnectButton: FC = () => {
  const { setVisible } = useWalletModal();
  const { publicKey, disconnect } = useWallet();

  return (
    <div className="rounded-lg border cursor-pointer border-yellow-600 bg-transparent shadow-btn-inner text-[#ffffff] py-[6px] px-2 w-[100px] group relative">
      {publicKey ? (
        <>
          <div className="flex items-center justify-center text-sm gap-2 font-bold hover:text-yellow-500 duration-300 text-white">
            <p>
              {publicKey.toBase58().slice(0, 5)}....
              {publicKey.toBase58().slice(-5)}
            </p>
            <div className="group-hover:rotate-90 group-hover:duration-300 w-4 h-4 grid place-content-center">
              <ArrowIcon />
            </div>
          </div>
          <div className="w-[160px] absolute -right-[1px] top-[38px] hidden group-hover:block bg-gray-700 shadow-lg rounded-xl hover:duration-300 z-[9999]">
            <ul className="border border-gray-500 rounded-lg bg-grayborder-gray-500 p-2 mt-1">
              <li className="flex gap-2 items-center mb-3 text-sm hover:text-yellow-600 duration-300 text-white transition-all">
                <ProfileIcon className="brightness-200" />
                <Link href="/myitem">My Items</Link>
              </li>
              <li>
                <div
                  className="flex gap-2 items-center mb-3 text-sm hover:text-yellow-600 duration-300 text-white transition-all"
                  onClick={() => setVisible(true)}
                >
                  <WalletIcon className="brightness-200" /> Change Wallet
                </div>
              </li>
              <li>
                <button
                  className="flex gap-2 items-center text-sm hover:text-yellow-600 duration-300 text-white transition-all"
                  onClick={disconnect}
                >
                  <ExitIcon className="brightness-200" /> Disconnect
                </button>
              </li>
            </ul>
          </div>
        </>
      ) : (
        <div
          className="flex items-center justify-center gap-1 text-sm hover:text-yellow-600 duration-300 transition-all font-bold text-white"
          onClick={() => setVisible(true)}
        >
          Connect
        </div>
      )}
    </div>
  );
};

export default ConnectButton;
