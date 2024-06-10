"use client";
import { NextPage } from "next";
import { useWallet } from "@solana/wallet-adapter-react";
import MainPageLayout from "@/components/Layout";

const AccountSettings: NextPage = () => {
  const { publicKey } = useWallet();
  return (
    <MainPageLayout>
      <div className="w-[350px] flex items-center justify-center flex-col gap-3 mt-10">
        <h1 className="text-white font-bold text-2xl">Account Settings</h1>
        <div className="w-full flex flex-col gap-1">
          <span className="text-sm text-gray-300">Username</span>
          <input
            className="text-white outline-none placeholder:text-[#ffffff17] border border-customborder py-1 px-2 w-full bg-transparent rounded-md"
            placeholder="zeno"
          />
          <span className="text-[12px] text-gray-500">
            Your profile link /u/
            {publicKey?.toBase58().slice(0, 4) +
              "..." +
              publicKey?.toBase58().slice(-3)}
          </span>
        </div>
        <div className="w-full flex flex-col gap-1">
          <span className="text-sm text-gray-300">Display Name</span>
          <input
            className="text-white outline-none placeholder:text-[#ffffff17] border border-customborder py-1 px-2 w-full bg-transparent rounded-md"
            placeholder="zeno"
          />
        </div>
        <div className="w-full flex flex-col gap-1">
          <span className="text-sm text-gray-300">Email</span>
          <input
            className="text-white outline-none placeholder:text-[#ffffff17] border border-customborder py-1 px-2 w-full bg-transparent rounded-md"
            placeholder="zeno3618@gmail.com"
          />
        </div>
        <div
          className="w-full text-sm flex items-center justify-center text-white rounded-md bg-yellow-600 py-2 mt-5 cursor-pointer hover:bg-yellow-500
        duration-300"
        >
          Save Settings
        </div>
      </div>
    </MainPageLayout>
  );
};

export default AccountSettings;
