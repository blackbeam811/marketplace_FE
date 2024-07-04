import { MUGS_ENDPOINT } from "@/config";
import { CollectionDataType } from "@/types/types";
import axios from "axios";

export async function redeemAPI(
  signedTransaction: Uint8Array,
  nftAddr: string,
  userWallet: string,
  email: string,
  homeAddr: string
) {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_ENDPOINT}/users/redeem`,
      {
        signedTransaction: signedTransaction,
        nftAddr: nftAddr,
        userWallet: userWallet,
        email: email,
        homeAddr: homeAddr,
      }
    );
    return response?.data;
  } catch (err) {
    console.log("Sell NFTs err = ", err);
  }
}

export async function listNft(transactions: any, listData: any) {
  try {
    const response = await axios.post(`${MUGS_ENDPOINT}/nft/create`, {
      transactions: transactions,
      listData: listData,
    });
    return response?.data;
  } catch (err) {
    console.log("List NFTs err = ", err);
  }
}

export async function delistNft(
  transactions: any,
  delistData: any,
  mintAddrArray: any
) {
  try {
    const response = await axios.post(`${MUGS_ENDPOINT}/nft/delist`, {
      transactions: transactions,
      delistData: delistData,
      mintAddrArray: mintAddrArray,
    });
    return response?.data;
  } catch (err) {
    console.log("List NFTs err = ", err);
  }
}

export async function updatePrice(
  transactions: any,
  updateData: any,
  mintAddr: any
) {
  try {
    const response = await axios.post(`${MUGS_ENDPOINT}/nft/updateprice`, {
      transaction: transactions,
      updateData: updateData,
      mintAddr: mintAddr,
    });
    return response?.data;
  } catch (err) {
    console.log("Update Price err = ", err);
  }
}

export async function purchaseNFT(
  transactions: any,
  purchaseData: any,
  mintAddrArray: any
) {
  try {
    const response = await axios.post(`${MUGS_ENDPOINT}/nft/purchase`, {
      transaction: transactions,
      purchaseData: purchaseData,
      mintAddrArray: mintAddrArray,
    });
    return response?.data;
  } catch (err) {
    console.log("Purchase NFT err = ", err);
  }
}

// Add collection data to databse by marketplace owner
export async function createCollection(data: CollectionDataType) {
  try {
    const response = await axios.post(`${MUGS_ENDPOINT}/collection/create`, {
      data: data,
    });
    return response?.data;
  } catch (err) {
    console.log("Collection create err = ", err);
  }
}

// Get all collection data from the database
export async function getAllCollections() {
  try {
    const response = await axios.get(`${MUGS_ENDPOINT}/collection/`);
    return response?.data;
  } catch (err) {
    console.log("Getting all collection data err = ", err);
  }
}

// Get all listed data by seller from the database
export async function getAllListed() {
  try {
    const response = await axios.get(`${MUGS_ENDPOINT}/nft/`);

    return response?.data;
  } catch (err) {
    console.log("Getting all listed data err = ", err);
  }
}

// Get all listed data by seller from the database
export async function getAllListedDataBySeller(seller: string) {
  try {
    const response = await axios.get(
      `${MUGS_ENDPOINT}/nft/findAllBySeller/${seller}`
    );
    console.log("getAllListedDataBySeller getting  ===> ", response.data);

    return response?.data;
  } catch (err) {
    console.log("Getting all listed data err = ", err);
  }
}

// Get all activity data by seller
export async function getAllActivities(seller: string) {
  try {
    const response = await axios.get(
      `${MUGS_ENDPOINT}/activity/findAllBySeller/${seller}`
    );

    return response?.data;
  } catch (err) {
    console.log("Getting all listed data err = ", err);
  }
}
