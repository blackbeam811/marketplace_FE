"use client";

import { CollectionContextType, CollectionDataType } from "@/types/types";
import { getAllCollectionsApi } from "@/utils/api";
import { createContext, ReactNode, useEffect, useState } from "react";

// Creating a context with default values
export const CollectionContext = createContext<CollectionContextType>({
  collectionDataState: true,
  collectionData: [],
  getAllCollectionData: async () => {},
});

interface CollectionProviderProps {
  children: ReactNode;
}

export function CollectionProvider({ children }: CollectionProviderProps) {
  // State to hold collection data
  const [collectionData, setCollectionData] = useState<CollectionDataType[]>(
    []
  );
  // State to indicate if collection data is being fetched
  const [collectionDataState, setCollectionDataState] = useState<boolean>(true);

  // Function to fetch all collection data
  const getAllCollectionData = async (): Promise<void> => {
    try {
      setCollectionDataState(true); // Set loading state
      const result = await getAllCollectionsApi();

      // Set the fetched data to state
      setCollectionData(result);
    } catch (error) {
      console.error("Error fetching collection data:", error);
    } finally {
      setCollectionDataState(false); // Reset loading state
    }
  };

  // Fetch data immediately when component mounts
  useEffect(() => {
    getAllCollectionData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Context value to be provided to children components
  const CollectionContextValue: CollectionContextType = {
    collectionDataState,
    collectionData,
    getAllCollectionData,
  };

  return (
    <CollectionContext.Provider value={CollectionContextValue}>
      {children}
    </CollectionContext.Provider>
  );
}
