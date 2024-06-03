import React, { createContext, useState, ReactNode, useEffect } from "react";

// Define the type for your modal context
interface ModalContextType {
  redeemModalShow: boolean;
  searchCollectionModalShow: boolean;
  openRedeemModal: () => void;
  closeRedeemModal: () => void;
  openSearchCollectionModal: () => void;
  closeSearchCollectionModal: () => void;
}

// Create the modal context
export const ModalContext = createContext<ModalContextType>({
  redeemModalShow: false,
  searchCollectionModalShow: false,
  openRedeemModal: () => {},
  closeRedeemModal: () => {},
  openSearchCollectionModal: () => {},
  closeSearchCollectionModal: () => {},
});

interface ModalProviderProps {
  children: ReactNode;
}

// Define the modal provider component
export function ModalProvider({ children }: ModalProviderProps) {
  const [redeemModalShow, setRedeemModalShow] = useState(false);
  const [searchCollectionModalShow, setSearchCollectionModalShow] =
    useState(false);

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

  const ModalContextValue: ModalContextType = {
    redeemModalShow: redeemModalShow,
    searchCollectionModalShow: searchCollectionModalShow,
    openRedeemModal: openRedeemModal,
    closeRedeemModal: closeRedeemModal,
    openSearchCollectionModal: openSearchCollectionModal,
    closeSearchCollectionModal: closeSearchCollectionModal,
  };

  return (
    <ModalContext.Provider value={ModalContextValue}>
      {children}
    </ModalContext.Provider>
  );
}
