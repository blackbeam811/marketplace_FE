import React, { createContext, useState, ReactNode, useEffect } from "react";

// Define the type for your modal context
interface ModalContextType {
  redeemModalShow: boolean;
  auctionModalShow: boolean;
  searchCollectionModalShow: boolean;
  nftDetailModalShow: boolean;
  filterWithSearchCollectionAddr: string;
  selectedNFTDetail: string[];
  openRedeemModal: () => void;
  closeRedeemModal: () => void;
  openAuctionModal: () => void;
  closeAuctionModal: () => void;
  openSearchCollectionModal: () => void;
  closeSearchCollectionModal: () => void;
  openNFTDetailModal: (nftAddr: string, collectionAddr: string) => void;
  closeNFTDetailModal: () => void;
  setFilterWith: (filterData: string) => void;
}

// Create the modal context
export const ModalContext = createContext<ModalContextType>({
  redeemModalShow: false,
  auctionModalShow: false,
  searchCollectionModalShow: false,
  nftDetailModalShow: false,
  filterWithSearchCollectionAddr: "",
  selectedNFTDetail: [],
  openRedeemModal: () => {},
  closeRedeemModal: () => {},
  openAuctionModal: () => {},
  closeAuctionModal: () => {},
  openSearchCollectionModal: () => {},
  closeSearchCollectionModal: () => {},
  openNFTDetailModal: () => {},
  closeNFTDetailModal: () => {},
  setFilterWith: () => {},
});

interface ModalProviderProps {
  children: ReactNode;
}

// Define the modal provider component
export function ModalProvider({ children }: ModalProviderProps) {
  const [redeemModalShow, setRedeemModalShow] = useState(false);
  const [auctionModalShow, setAuctionModalShow] = useState(false);
  const [nftDetailModalShow, setnftDetailModalShow] = useState(false);
  const [selectedNFTMintAddr, setSelectedNFTMintAddr] = useState("");
  const [filterWithSearchCollectionAddr, setFilterWithSearchCollectionAddr] =
    useState("");
  const [searchCollectionModalShow, setSearchCollectionModalShow] =
    useState(false);
  const [selectedNFTDetail, setSelectedNFTDetail] = useState<string[]>([]);

  const openRedeemModal = () => {
    setRedeemModalShow(true);
  };

  const closeRedeemModal = () => {
    setRedeemModalShow(false);
  };

  const openAuctionModal = () => {
    setAuctionModalShow(true);
  };

  const closeAuctionModal = () => {
    setAuctionModalShow(false);
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

  const setFilterWith = (filterData: string) => {
    setFilterWithSearchCollectionAddr(filterData);
  };

  const ModalContextValue: ModalContextType = {
    redeemModalShow: redeemModalShow,
    auctionModalShow: auctionModalShow,
    searchCollectionModalShow: searchCollectionModalShow,
    nftDetailModalShow: nftDetailModalShow,
    selectedNFTDetail: selectedNFTDetail,
    filterWithSearchCollectionAddr: filterWithSearchCollectionAddr,
    openRedeemModal: openRedeemModal,
    closeRedeemModal: closeRedeemModal,
    openAuctionModal: openAuctionModal,
    closeAuctionModal: closeAuctionModal,
    openSearchCollectionModal: openSearchCollectionModal,
    closeSearchCollectionModal: closeSearchCollectionModal,
    openNFTDetailModal: openNFTDetailModal,
    closeNFTDetailModal: closeNFTDetailModal,
    setFilterWith: setFilterWith,
  };

  return (
    <ModalContext.Provider value={ModalContextValue}>
      {children}
    </ModalContext.Provider>
  );
}
