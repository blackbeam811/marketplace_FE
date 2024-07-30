"use client";
import { NextPage } from "next";
import { Suspense, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import MainPageLayout from "@/components/Layout";
import { errorAlert, successAlert } from "@/components/ToastGroup";
import { UserDataType } from "@/types/types";
import { createUserDataApi } from "@/utils/api";
import { NormalSpinner } from "@/components/Spinners";

const AccountSettings: NextPage = () => {
  const { publicKey } = useWallet();
  const [saveLoadingState, setSaveLoadingState] = useState<boolean>(false);
  const [userAddr, setUserAddr] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [isEmailValid, setIsEmailValid] = useState<boolean>(true);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setUserEmail(email);
    setIsEmailValid(validateEmail(email));
  };

  const handleSaveUserData = async () => {
    console.log("isEmail => ", isEmailValid);
    if (userAddr === "" || userName === "" || !isEmailValid) {
      errorAlert("Please enter the value correctly.");
    } else {
      setSaveLoadingState(true);

      const dataToSave: UserDataType = {
        userName: userName,
        userAddr: userAddr,
        email: userEmail,
        userWallet: publicKey?.toBase58()!,
      };

      try {
        const result = await createUserDataApi(dataToSave);
        if (result.type === "success") {
          setSaveLoadingState(false);
          successAlert("Success");
        }
      } catch (error) {
        setSaveLoadingState(false);
        console.log("err ===>", error);
        errorAlert("Something went wrong.");
      }
    }
  };
  return (
    <MainPageLayout>
      <div className="w-[350px] flex items-center justify-center flex-col gap-3 mt-10">
        <h1 className="text-white font-bold text-2xl">Account Settings</h1>
        <div className="w-full flex flex-col gap-1">
          <span className="text-sm text-gray-300">Username</span>
          <input
            className="text-white outline-none placeholder:text-[#ffffff17] border border-customborder py-1 px-2 w-full bg-transparent rounded-md"
            placeholder="zeno"
            onChange={(e) => setUserName(e.target.value)}
          />
          {/* <span className="text-[12px] text-gray-500">
            Your profile link /u/
            {publicKey?.toBase58().slice(0, 4) +
              "..." +
              publicKey?.toBase58().slice(-3)}
          </span> */}
        </div>
        <div className="w-full flex flex-col gap-1">
          <span className="text-sm text-gray-300">Address</span>
          <input
            className="text-white outline-none placeholder:text-[#ffffff17] border border-customborder py-1 px-2 w-full bg-transparent rounded-md"
            placeholder="ontario, canada"
            onChange={(e) => setUserAddr(e.target.value)}
          />
        </div>
        <div className="w-full flex flex-col gap-1">
          <span className="text-sm text-gray-300">Email</span>
          <input
            className="text-white outline-none placeholder:text-[#ffffff17] border border-customborder py-1 px-2 w-full bg-transparent rounded-md"
            placeholder="zeno3618@gmail.com"
            onChange={handleEmailChange}
          />
          {!isEmailValid && (
            <p className="text-red-500 text-sm">
              Please enter a valid email address.
            </p>
          )}
        </div>

        <button
          className={`w-full text-sm flex items-center justify-center text-white rounded-md bg-yellow-600 py-1 mt-5 ${
            !saveLoadingState && "hover:bg-yellow-500 cursor-pointer"
          }
        duration-300 gap-3 ${saveLoadingState && "cursor-not-allowed"}`}
          onClick={() => !saveLoadingState && handleSaveUserData()}
        >
          Save Settings
          <span
            className={`${
              saveLoadingState
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 w-0 pr-0 pointer-events-none"
            } duration-300`}
          >
            <NormalSpinner width={5} height={5} />
          </span>
        </button>
      </div>
    </MainPageLayout>
  );
};

export default function AccountSettingsPage() {
  return (
    <Suspense>
      <AccountSettings />
    </Suspense>
  );
}
