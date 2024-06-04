"use client";
import React, { ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import SolanaWalletProvider from "@/contexts/WalletContext";
import { NFTDataProvider } from "@/contexts/NFTDataContext";
import { ModalProvider } from "@/contexts/ModalContext";
import Header from "./Header";
import SearchCollectionModal from "./Modal/SearchCollectionModal";

export default function PageProvider({ children }: { children: ReactNode }) {
  return (
    <SolanaWalletProvider>
      <NFTDataProvider>
        <ModalProvider>
          {/* <MobileSearchCollectionBar /> */}
          <Header />
          {children}
          <SearchCollectionModal />
          <ToastContainer pauseOnFocusLoss={false} theme="colored" stacked />
          <div className="z-[9999]">
            <ProgressBar
              height="1px"
              color="#fffd00"
              options={{ showSpinner: true }}
              shallowRouting
            />
          </div>
        </ModalProvider>
      </NFTDataProvider>
    </SolanaWalletProvider>
  );
}
