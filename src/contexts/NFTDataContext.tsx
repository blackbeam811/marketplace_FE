"use client";

import { COINGECKOAPIKEY, SOLANA_RPC } from "@/config";
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
} from "react";
import { CollectionContext } from "./CollectionContext";
import { getAllListed, getAllListedDataBySeller } from "@/utils/api";

export const NFTDataContext = createContext<NFTDataContextType>({
  walletAddr: "",
  solPrice: 0,
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
  const { publicKey } = useWallet();
  const connection = new web3.Connection(SOLANA_RPC);
  const [solPrice, setSolPrice] = useState(0);
  const [getOwnNFTsState, setGetOwnNFTsState] = useState(false);
  const [ownNFTs, setOwnNFTs] = useState<OwnNFTDataType[]>([]);
  const [ownListedNFTs, setOwnListedNFTs] = useState<OwnNFTDataType[]>([]);
  const [listedAllNFTs, setListedAllNFTs] = useState<OwnNFTDataType[]>([]);
  const { collectionData } = useContext(CollectionContext);

  const fetchSolPrice = async () => {
    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd",
        {
          method: "GET",
          headers: {
            accept: "application/json",
            "x-cg-demo-api-key": COINGECKOAPIKEY,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch Solana price");
      const data = await response.json();
      setSolPrice(data.solana.usd);
    } catch (error) {
      console.error("Error fetching Solana price:", error);
    }
  };

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
    const attribute = metadata.attributes.map((attr: any) => ({
      trait_type: attr.trait_type,
      value: attr.value,
    }));

    return listed
      ? {
          collectionName: metadata.name.split("#")[0].toString(),
          tokenId: metadata.name.split("#")[1].toString(),
          mintAddr: acc.mintAddr,
          imgUrl: metadata.image,
          description: metadata.description,
          metaDataUrl: acc.metaDataUrl,
          collectionAddr: acc.collectionAddr,
          seller: acc.seller,
          solPrice: acc.solPrice,
          attribute,
          listed,
        }
      : {
          collectionName: acc.data.name.split("#")[0].toString(),
          tokenId: acc.data.name.split("#")[1].toString(),
          mintAddr: acc.mint,
          imgUrl: metadata.image,
          description: metadata.description,
          metaDataUrl: acc.data.uri,
          collectionAddr: acc.data.creators[0].address,
          seller: publicKey?.toBase58()!,
          solPrice: 0,
          attribute,
          listed,
        };
  };

  const getOwnNFTs = async (): Promise<void> => {
    if (!publicKey) return;
    try {
      setGetOwnNFTsState(true);
      const listedData = await getAllListedDataBySeller(publicKey.toBase58());
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
      listedData = await getAllListedDataBySeller(publicKey.toBase58());
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
      listedData = await getAllListed();
      console.log("========= >listedData", listedData);
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
      console.log("All listed NFTs ==> ", data);

      setListedAllNFTs(data.filter((nft) => nft && nft.tokenId)); // Filter out null values
    } catch (error) {
      console.error("Error fetching listed NFTs:", error);
    }
  };

  useEffect(() => {
    fetchSolPrice();
    const interval = setInterval(fetchSolPrice, 60000); // Call every 60 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getAllListedNFTs();
      } catch (error) {
        console.error("Error fetching NFTs:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (publicKey) {
        try {
          await getOwnNFTs();
          await getAllListedNFTsBySeller();
        } catch (error) {
          console.error("Error fetching NFTs:", error);
        }
      }
    };

    fetchData();
  }, [publicKey, collectionData]);

  const NFTDataContextValue: NFTDataContextType = {
    walletAddr: publicKey?.toBase58(),
    solPrice,
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
