"use client";

import { COINGECKOAPIKEY, COLLECTION_ID, SOLANA_RPC } from "@/config";
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
import { getAllNFTs } from "@/utils/contractScript";

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
  const { collectionData } = useContext(CollectionContext);

  const getSolPriceFromCoinGeckio = async () => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-cg-demo-api-key": COINGECKOAPIKEY,
      },
    };

    await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd",
      options
    )
      .then((response) => response.json())
      .then((response) => {
        const solanaUsd: number = response.solana.usd;
        setSolPrice(solanaUsd);
      })
      .catch((err) => console.error(err));
  };

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
      collectionName: acc.data.name.split("#")[0].toString(),
      tokenId: acc.data.name.split("#")[1].toString(),
      mintAddr: acc.mint,
      imgUrl: metadata.image,
      description: metadata.description,
      metaDataUrl: acc.data.uri,
      collectionAddr: acc.data.creators[0].address,
      owner: publicKey?.toBase58()!,
      price: 0,
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
    console.log("collectionData2 ===> ", collectionData);
    const data: OwnNFTDataType[] = [];
    await Promise.all(
      nftList
        .filter(
          (acc) =>
            acc.data.creators !== undefined &&
            collectionData.filter(
              (item) => item.collectionAddr === acc.data.creators[0].address
            )
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
    console.log("getOwnNFTs ===> ", data);

    setOwnNFTs(data);
    setGetOwnNFTsState(false);
  };

  const getAllListedNFts = async (): Promise<void> => {
    const data = await getAllNFTs();
    console.log("listedData =====> ", data);
  };

  useEffect(() => {
    const fetchSolPrice = async () => {
      try {
        await getSolPriceFromCoinGeckio();
      } catch (error) {
        console.error("Error fetching Sol Price:", error);
      }
    };

    const interval = setInterval(fetchSolPrice, 6000); // Call the function every 60 seconds (1 minute)

    // Clean up the interval when the component is unmounted
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (wallet) {
      const fetchData = async () => {
        try {
          await getOwnNFTs();
          await getAllListedNFts();
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
