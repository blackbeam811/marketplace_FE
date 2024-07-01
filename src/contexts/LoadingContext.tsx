import React, { createContext, useState, ReactNode, useEffect } from "react";

// Define the type for your modal context
interface LoadingContextType {
  functionLoadingShow: boolean;
  openFunctionLoading: () => void;
  closeFunctionLoading: () => void;
}

// Create the modal context
export const LoadingContext = createContext<LoadingContextType>({
  functionLoadingShow: false,
  openFunctionLoading: () => {},
  closeFunctionLoading: () => {},
});

interface ModalProviderProps {
  children: ReactNode;
}

// Define the modal provider component
export function LoadingProvider({ children }: ModalProviderProps) {
  const [functionLoadingShow, setfunctionLoadingShow] = useState(false);

  const openFunctionLoading = () => {
    setfunctionLoadingShow(true);
  };

  const closeFunctionLoading = () => {
    setfunctionLoadingShow(false);
  };

  const LoadingContextValue: LoadingContextType = {
    functionLoadingShow: functionLoadingShow,
    openFunctionLoading: openFunctionLoading,
    closeFunctionLoading: closeFunctionLoading,
  };

  return (
    <LoadingContext.Provider value={LoadingContextValue}>
      {children}
    </LoadingContext.Provider>
  );
}
