"use client";

import { COLLECTION_ID, SOLANA_RPC } from "@/config";
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

export const NFTDataContext = createContext<NFTDataContextType>({
  walletAddr: "",
  solPrice: 0,
  ownNFTs: [],
  getOwnNFTsState: false,
  getOwnNFTs: async () => {},
});

interface NFTDataProviderProps {
  children: ReactNode;
}

export function NFTDataProvider({ children }: NFTDataProviderProps) {
  const wallet = useWallet();
  const { publicKey } = useWallet();
  const connection = new web3.Connection(SOLANA_RPC);
  const [solPrice, setSolPrice] = useState(0);
  const [getOwnNFTsState, setGetOwnNFTsState] = useState(false);
  const [ownNFTs, setOwnNFTs] = useState<OwnNFTDataType[]>([]);

  const fetchNFTMetadata = async (uri: string): Promise<any> => {
    const metadataRes = await fetch(uri);
    if (!metadataRes.ok) {
      throw new Error("Failed to fetch metadata from URI");
    }
    return await metadataRes.json();
  };

  const constructNFTData = (acc: any, metadata: any): OwnNFTDataType => {
    const attribute = metadata.attributes.map((attr: any) => ({
      trait_type: attr.trait_type,
      value: attr.value,
    }));

    return {
      tokenId: acc.data.name.split("#")[1].toString(),
      mintAddr: acc.mint,
      imgUrl: metadata.image,
      attribute,
    };
  };

  const getOwnNFTs = async (): Promise<void> => {
    setGetOwnNFTsState(true);
    if (!wallet.publicKey) return;

    const nftList = await getParsedNftAccountsByOwner({
      publicAddress: wallet.publicKey.toBase58(),
      connection: connection,
    });

    const data: OwnNFTDataType[] = [];
    await Promise.all(
      nftList
        .filter(
          (acc) =>
            acc.data.creators !== undefined &&
            acc.data.creators[0].address === COLLECTION_ID
        )
        .map(async (acc) => {
          try {
            const metadata = await fetchNFTMetadata(acc.data.uri);
            const nft = constructNFTData(acc, metadata);
            nft.tokenId && data.push(nft);
          } catch (error) {
            console.error("Error fetching NFT metadata:", error);
          }
        })
    );

    setOwnNFTs(data);
    setGetOwnNFTsState(false);
  };
  useEffect(() => {
    if (wallet) {
      const fetchData = async () => {
        try {
          await getOwnNFTs();
        } catch (error) {
          console.error("Error fetching Own NFTs:", error);
        }
      };

      fetchData(); // Fetch data immediately when component mounts
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet]);

  const NFTDataContextValue: NFTDataContextType = {
    walletAddr: publicKey?.toBase58(),
    solPrice,
    getOwnNFTsState,
    ownNFTs,
    getOwnNFTs,
  };

  return (
    <NFTDataContext.Provider value={NFTDataContextValue}>
      {children}
    </NFTDataContext.Provider>
  );
}
