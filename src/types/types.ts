import { web3 } from "@project-serum/anchor";

export type collectionDataType = {
  name: string;
  imgUrl: string;
  collectionAddr: string;
  currentPrice: number;
  previousPrice: number;
  volume: number;
  change: number;
  sales: number;
  marketCap: number;
  totalVolume: number;
};

export type activityTableDataType = {
  imgUrl: string;
  name: string;
  type: number;
  total: number;
  seller: string;
  buyer: string;
  time: number;
};

export type ListNFTItemType = {
  tokenId: string;
  listed: boolean;
  collectionName: string;
  collectionAddr: string;
  imgUrl: string;
  mintAddr: string;
  metaDataUrl: string;
  price: number;
  seller: string;
};

export type SelectPropsType = {
  options: string[];
  filterType: string;
};

export type HeaderProps = {
  title?: string;
};

export type BalanceProps = {
  myBalance?: number;
  address: web3.PublicKey | null;
};

export type NFTCardType = {
  imgUrl: string;
  tokenId: string;
  mintAddr: string;
  collectionName: string;
  solPrice: number;
  state: string;
};

export type NFTAttribute = {
  trait_type: string;
  value: string;
};

export type OwnNFTDataType = {
  collectionName: string;
  tokenId: string;
  mintAddr: string;
  imgUrl: string;
  description: string;
  collectionAddr: string;
  owner: string;
  metaDataUrl: string;
  solPrice: number;
  listed: boolean;
  attribute: NFTAttribute[];
};

export type CollectionDataType = {
  imgUrl: string;
  collectionName: string;
  collectionAddr: string;
  twitterLink: string;
  discordLink: string;
  currentPrice: number;
  previousPrice: number;
  volume: number;
  change: number;
  sales: number;
  marketCap: number;
  totalVolume: number;
};

export type ActivityDataType = {
  imgUrl: string;
  tokenId: string;
  mintAddr: string;
  txType: number;
  solPrice: number;
  seller: string;
  buyer: string;
  date: string;
};

export interface NFTDataContextType {
  walletAddr: string | undefined;
  solPrice: number;
  getOwnNFTsState: boolean;
  ownNFTs: OwnNFTDataType[];
  ownListedNFTs: OwnNFTDataType[];
  getOwnNFTs: () => Promise<void>;
  getAllListedNFTs: () => Promise<void>;
}

export interface CollectionContextType {
  collectionDataState: boolean;
  collectionData: CollectionDataType[];
  getAllCollectionData: () => Promise<void>;
}

export interface ActivityContextType {
  activityDataState: boolean;
  activityData: ActivityDataType[];
  getAllActivityData: () => Promise<void>;
}

export interface SidebarPropsType {
  filterOpen: boolean;
  onClosebar: () => void;
}

export interface RedeemModalProps {
  handleRedeemFunc: (email: string, homeAddr: string) => void;
}

export interface CollectionFilterbarProps {
  setFilterOpen: (opened: boolean) => void;
  filterOpen: boolean;
}

export interface CollectionDetailProps {
  collectionData: CollectionDataType | undefined;
}
