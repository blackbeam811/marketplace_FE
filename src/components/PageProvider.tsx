"use client";
import React, { ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import SolanaWalletProvider from "@/contexts/WalletContext";
import { NFTDataProvider } from "@/contexts/NFTDataContext";
import { ModalProvider } from "@/contexts/ModalContext";
import Header from "./Header";
import SearchCollectionModal from "./Modal/SearchCollectionModal";
import Footer from "./Footer";
import NFTDetailModal from "./Modal/NFTDetailModal";
import { LoadingProvider } from "@/contexts/LoadingContext";
import { CollectionProvider } from "@/contexts/CollectionContext";
import Progressbar from "./Progressbar";
import FuncSpinner from "./FuncSpinner";
import { ActivityProvider } from "@/contexts/ActivityContext";

export default function PageProvider({ children }: { children: ReactNode }) {
  return (
    <SolanaWalletProvider>
      <CollectionProvider>
        {/* <ActivityProvider> */}
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
              <FuncSpinner />
              <Progressbar />
            </LoadingProvider>
          </ModalProvider>
        </NFTDataProvider>
        {/* </ActivityProvider> */}
      </CollectionProvider>
    </SolanaWalletProvider>
  );
}
