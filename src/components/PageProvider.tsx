"use client";
import React, { ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import SolanaWalletProvider from "@/contexts/WalletContext";
import { NFTDataProvider } from "@/contexts/NFTDataContext";
import { ModalProvider } from "@/contexts/ModalContext";
import Header from "./Header";
import SearchCollectionModal from "./Modal/SearchCollectionModal";
import Footer from "./Footer";
import NFTDetailModal from "./Modal/NFTDetailModal";
import { DiscordSpinner } from "./Spinners";
import { LoadingProvider } from "@/contexts/LoadingContext";
import { CollectionProvider } from "@/contexts/CollectionContext";
import Progressbar from "./Progressbar";

export default function PageProvider({ children }: { children: ReactNode }) {
  return (
    <SolanaWalletProvider>
      <CollectionProvider>
        <NFTDataProvider>
          <ModalProvider>
            <LoadingProvider>
              {/* <MobileSearchCollectionBar /> */}
              <Header />
              {children}
              <Footer />
              <NFTDetailModal />
              <SearchCollectionModal />
              <ToastContainer
                pauseOnFocusLoss={false}
                theme="colored"
                stacked
              />
              <Progressbar />
            </LoadingProvider>
          </ModalProvider>
        </NFTDataProvider>
      </CollectionProvider>
    </SolanaWalletProvider>
  );
}
