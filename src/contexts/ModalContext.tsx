import React, { createContext, useState, ReactNode, useEffect } from "react";

// Define the type for your modal context
interface ModalContextType {
  redeemModalShow: boolean;
  openRedeemModal: () => void;
  closeRedeemModal: () => void;
}

// Create the modal context
export const ModalContext = createContext<ModalContextType>({
  redeemModalShow: false,
  openRedeemModal: () => {},
  closeRedeemModal: () => {},
});

interface ModalProviderProps {
  children: ReactNode;
}

// Define the modal provider component
export function ModalProvider({ children }: ModalProviderProps) {
  const [redeemModalShow, setRedeemModalShow] = useState(false);

  const openRedeemModal = () => {
    setRedeemModalShow(true);
  };

  const closeRedeemModal = () => {
    setRedeemModalShow(false);
  };

  const ModalContextValue: ModalContextType = {
    redeemModalShow: redeemModalShow,
    openRedeemModal: openRedeemModal,
    closeRedeemModal: closeRedeemModal,
  };

  return (
    <ModalContext.Provider value={ModalContextValue}>
      {children}
    </ModalContext.Provider>
  );
}
