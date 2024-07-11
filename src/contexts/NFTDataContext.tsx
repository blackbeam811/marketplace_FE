"use client";

import { COINGECKOAPIKEY, SOL_DECIMAL, SOLANA_RPC } from "@/config";
import { NFTDataContextType, OwnNFTDataType } from "@/types/types";
import { getParsedNftAccountsByOwner } from "@nfteyez/sol-rayz";
import { web3 } from "@project-serum/anchor";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
  useCallback,
} from "react";
import { CollectionContext } from "./CollectionContext";
import { getAllListedApi, getAllListedDataBySellerApi } from "@/utils/api";

export const NFTDataContext = createContext<NFTDataContextType>({
  solPrice: 0,
  myBalance: 0,
  ownNFTs: [],
  ownListedNFTs: [],
  listedAllNFTs: [],
  getOwnNFTsState: false,
  getOwnNFTs: async () => {},
  getAllListedNFTsBySeller: async () => {},
  getAllListedNFTs: async () => {},
});

interface NFTDataProviderProps {
  children: ReactNode;
}

export function NFTDataProvider({ children }: NFTDataProviderProps) {
  const connection = new web3.Connection(SOLANA_RPC);
  const { publicKey } = useWallet();
  const { collectionData } = useContext(CollectionContext);
  const [solPrice, setSolPrice] = useState(0);
  const [myBalance, setMyBalance] = useState(0);
  const [getOwnNFTsState, setGetOwnNFTsState] = useState(false);
  const [ownNFTs, setOwnNFTs] = useState<OwnNFTDataType[]>([]);
  const [ownListedNFTs, setOwnListedNFTs] = useState<OwnNFTDataType[]>([]);
  const [listedAllNFTs, setListedAllNFTs] = useState<OwnNFTDataType[]>([]);

  const getBalanceFunc = useCallback(async () => {
    const solConnection = new web3.Connection(SOLANA_RPC);
    if (publicKey) {
      let balance = await solConnection.getBalance(publicKey);
      setMyBalance(balance / SOL_DECIMAL);
    } else {
      setMyBalance(0);
    }
  }, [publicKey]);

  useEffect(() => {
    getBalanceFunc();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicKey]);

  // const fetchSolPrice = async () => {
  //   try {
  //     const response = await fetch(
  //       "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd",
  //       {
  //         method: "GET",
  //         headers: {
  //           accept: "application/json",
  //           "x-cg-demo-api-key": COINGECKOAPIKEY,
  //         },
  //       }
  //     );
  //     if (!response.ok) throw new Error("Failed to fetch Solana price");
  //     const data = await response.json();
  //     setSolPrice(data.solana.usd);
  //   } catch (error) {
  //     console.error("Error fetching Solana price:", error);
  //   }
  // };

  const fetchNFTMetadata = async (uri: string): Promise<any> => {
    const response = await fetch(uri);
    if (!response.ok) throw new Error("Failed to fetch metadata from URI");
    return await response.json();
  };

  const constructNFTData = (
    acc: any,
    metadata: any,
    listed: boolean
  ): OwnNFTDataType => {
    const { name, image, description, attributes } = metadata;
    const {
      mintAddr,
      metaDataUrl,
      collectionAddr,
      seller,
      solPrice,
      data,
      mint,
    } = acc;

    const attribute = attributes.map((attr: any) => ({
      trait_type: attr.trait_type,
      value: attr.value,
    }));

    const [collectionName, tokenId] = listed
      ? name.split("#")
      : data.name.split("#");

    return {
      collectionName: collectionName.toString(),
      tokenId: tokenId.toString(),
      mintAddr: listed ? mintAddr : mint,
      imgUrl: image,
      description,
      metaDataUrl: listed ? metaDataUrl : data.uri,
      collectionAddr: listed ? collectionAddr : data.creators?.[0]?.address,
      seller: listed ? seller : publicKey?.toBase58()!,
      solPrice: listed ? solPrice : 0,
      attribute,
      listed,
    };
  };

  const getOwnNFTs = async (): Promise<void> => {
    if (!publicKey) return;
    try {
      setGetOwnNFTsState(true);
      const listedData = await getAllListedDataBySellerApi(
        publicKey.toBase58()
      );
      const nftList = await getParsedNftAccountsByOwner({
        publicAddress: publicKey.toBase58(),
        connection,
      });
      const data: OwnNFTDataType[] = [];
      await Promise.all(
        nftList
          .filter(
            (acc) =>
              acc.data.creators !== undefined &&
              collectionData.some(
                (item) => item.collectionAddr === acc.data.creators[0].address
              )
          )
          .map(async (nfts) => {
            try {
              const metadata = await fetchNFTMetadata(nfts.data.uri);
              const nft = constructNFTData(nfts, metadata, false);
              const isListed = listedData.some(
                (item: any) => item.mintAddr === nft.mintAddr
              );
              if (!isListed && nft.tokenId) data.push(nft);
            } catch (error) {
              console.error("Error fetching NFT metadata:", error);
            }
          })
      );
      setOwnNFTs(data);
    } catch (error) {
      console.error("Error fetching own NFTs:", error);
    } finally {
      setGetOwnNFTsState(false);
    }
  };

  const getAllListedNFTsBySeller = async (): Promise<void> => {
    if (!publicKey) return;
    try {
      let listedData = [];
      listedData = await getAllListedDataBySellerApi(publicKey.toBase58());
      const data: OwnNFTDataType[] = await Promise.all(
        listedData.length !== 0
          ? listedData.map(async (acc: any) => {
              try {
                const metadata = await fetchNFTMetadata(acc.metaDataUrl);
                return constructNFTData(acc, metadata, true);
              } catch (error) {
                console.error("Error fetching NFT metadata:", error);
                return null; // Return null if there's an error
              }
            })
          : [] // Return an empty array if listedData is empty
      );

      setOwnListedNFTs(data.filter((nft) => nft && nft.tokenId)); // Filter out null values
    } catch (error) {
      console.error("Error fetching listed NFTs:", error);
    }
  };

  const getAllListedNFTs = async (): Promise<void> => {
    try {
      let listedData = [];
      listedData = await getAllListedApi();
      const data: OwnNFTDataType[] = await Promise.all(
        listedData.length !== 0
          ? listedData.map(async (acc: any) => {
              try {
                const metadata = await fetchNFTMetadata(acc.metaDataUrl);
                return constructNFTData(acc, metadata, true);
              } catch (error) {
                console.error("Error fetching NFT metadata:", error);
                return null; // Return null if there's an error
              }
            })
          : [] // Return an empty array if listedData is empty
      );
      setListedAllNFTs(data.filter((nft) => nft && nft.tokenId)); // Filter out null values
    } catch (error) {
      console.error("Error fetching listed NFTs:", error);
    }
  };

  // useEffect(() => {
  //   fetchSolPrice();
  //   const interval = setInterval(fetchSolPrice, 120000); // Call every 60 seconds
  //   return () => clearInterval(interval);
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getAllListedNFTs();
      } catch (error) {
        console.error("Error fetching NFTs:", error);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (publicKey && collectionData) {
        try {
          await getOwnNFTs();
          await getAllListedNFTsBySeller();
        } catch (error) {
          console.error("Error fetching NFTs:", error);
        }
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicKey, collectionData]);

  const NFTDataContextValue: NFTDataContextType = {
    solPrice,
    myBalance,
    getOwnNFTsState,
    ownNFTs,
    ownListedNFTs,
    listedAllNFTs,
    getOwnNFTs,
    getAllListedNFTsBySeller,
    getAllListedNFTs,
  };

  return (
    <NFTDataContext.Provider value={NFTDataContextValue}>
      {children}
    </NFTDataContext.Provider>
  );
}
