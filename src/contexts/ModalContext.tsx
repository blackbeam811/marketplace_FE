import React, { createContext, useState, ReactNode, useEffect } from "react";

// Define the type for your modal context
interface ModalContextType {
  redeemModalShow: boolean;
  searchCollectionModalShow: boolean;
  nftDetailModalShow: boolean;
  selectedNFTDetail: string[];
  openRedeemModal: () => void;
  closeRedeemModal: () => void;
  openSearchCollectionModal: () => void;
  closeSearchCollectionModal: () => void;
  openNFTDetailModal: (nftAddr: string, collectionAddr: string) => void;
  closeNFTDetailModal: () => void;
}

// Create the modal context
export const ModalContext = createContext<ModalContextType>({
  redeemModalShow: false,
  searchCollectionModalShow: false,
  nftDetailModalShow: false,
  selectedNFTDetail: [],
  openRedeemModal: () => {},
  closeRedeemModal: () => {},
  openSearchCollectionModal: () => {},
  closeSearchCollectionModal: () => {},
  openNFTDetailModal: () => {},
  closeNFTDetailModal: () => {},
});

interface ModalProviderProps {
  children: ReactNode;
}

// Define the modal provider component
export function ModalProvider({ children }: ModalProviderProps) {
  const [redeemModalShow, setRedeemModalShow] = useState(false);
  const [nftDetailModalShow, setnftDetailModalShow] = useState(false);
  const [searchCollectionModalShow, setSearchCollectionModalShow] =
    useState(false);
  const [selectedNFTDetail, setSelectedNFTDetail] = useState<string[]>([]);

  const openRedeemModal = () => {
    setRedeemModalShow(true);
  };

  const closeRedeemModal = () => {
    setRedeemModalShow(false);
  };

  const openSearchCollectionModal = () => {
    setSearchCollectionModalShow(true);
  };

  const closeSearchCollectionModal = () => {
    setSearchCollectionModalShow(false);
  };

  const openNFTDetailModal = (nftAddr: string, collectionAddr: string) => {
    setSelectedNFTDetail([nftAddr, collectionAddr]);
    setnftDetailModalShow(true);
  };

  const closeNFTDetailModal = () => {
    setnftDetailModalShow(false);
  };

  const ModalContextValue: ModalContextType = {
    redeemModalShow: redeemModalShow,
    searchCollectionModalShow: searchCollectionModalShow,
    nftDetailModalShow: nftDetailModalShow,
    selectedNFTDetail: selectedNFTDetail,
    openRedeemModal: openRedeemModal,
    closeRedeemModal: closeRedeemModal,
    openSearchCollectionModal: openSearchCollectionModal,
    closeSearchCollectionModal: closeSearchCollectionModal,
    openNFTDetailModal: openNFTDetailModal,
    closeNFTDetailModal: closeNFTDetailModal,
  };

  return (
    <ModalContext.Provider value={ModalContextValue}>
      {children}
    </ModalContext.Provider>
  );
}
