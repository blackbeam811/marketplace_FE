"use client";
import React, { ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import SolanaWalletProvider from "@/contexts/WalletContext";
import { NFTDataProvider } from "@/contexts/NFTDataContext";
import { ModalProvider } from "@/contexts/ModalContext";
import Header from "./Header";

export default function PageProvider({ children }: { children: ReactNode }) {
  return (
    <SolanaWalletProvider>
      <NFTDataProvider>
        <ModalProvider>
          <Header />
          {children}
          <ProgressBar
            height="1px"
            color="#fffd00"
            options={{ showSpinner: true }}
            shallowRouting
          />
          <ToastContainer pauseOnFocusLoss={false} theme="colored" stacked />
        </ModalProvider>
      </NFTDataProvider>
    </SolanaWalletProvider>
  );
}
