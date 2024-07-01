"use client";

import { CollectionContextType, CollectionDataType } from "@/types/types";
import { getAllCollections } from "@/utils/api";
import { createContext, ReactNode, useEffect, useState } from "react";

export const CollectionContext = createContext<CollectionContextType>({
  collectionDataState: false,
  collectionData: [],
  getAllCollectionData: async () => {},
});

interface CollectionProviderProps {
  children: ReactNode;
}

export function CollectionProvider({ children }: CollectionProviderProps) {
  const [collectionData, setCollectionData] = useState<CollectionDataType[]>(
    []
  );
  const [collectionDataState, setCollectionDataState] =
    useState<boolean>(false);

  const getAllCollectionData = async (): Promise<void> => {
    const result = await getAllCollections();
    console.log("collection getting  ===> ", result);

    const data: CollectionDataType[] = [];
    await Promise.all(
      result.map(async (item: CollectionDataType) => {
        data.push(item);
      })
    );

    console.log("data ===>", data);
    setCollectionData(data);
    setCollectionDataState(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getAllCollectionData();
      } catch (error) {
        console.error("Error fetching collection data:", error);
      }
    };

    fetchData(); // Fetch data immediately when component mounts

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
