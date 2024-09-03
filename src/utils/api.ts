import axios from "axios";
import { MUGS_ENDPOINT } from "@/config";
import { CollectionDataType, UserDataType } from "@/types/types";

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

// List nfts and save the listed nft data to the database.
export async function listNftApi(transactions: any, listData: any) {
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

// Craete auction nft and save the auction nft data to the database.
export async function createAuctionNftApi(transaction: any, auction: any) {
  try {
    const response = await axios.post(`${MUGS_ENDPOINT}/nft/createAuction`, {
      transaction: transaction,
      auction: auction,
    });
    return response?.data;
  } catch (err) {
    console.log("Auction NFTs err = ", err);
  }
}

// Delist nfts and save the delisted nft data to the database.
export async function delistNftApi(
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
    console.log("Delist NFTs err = ", err);
  }
}

// Cancel auction and save the canceled auction nft data to the database.
export async function cancelAuctionApi(transaction: any, delistData: any) {
  try {
    const response = await axios.post(
      `${MUGS_ENDPOINT}/nft/deleteListedAuctionNfts`,
      {
        transaction: transaction,
        delistData: delistData,
      }
    );
    return response?.data;
  } catch (err) {
    console.log("Delist NFTs err = ", err);
  }
}

// Update the listed nft price and save the updated price to the database.
export async function updatePriceApi(
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

// Purchase the listed nfts and save the purchased nft data to the database
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

// Claim the listed nft and save the claimed nft data to the database
export async function claimAuctionPnftApi(
  transactions: any,
  purchaseData: any,
  mintAddrArray: any
) {
  try {
    const response = await axios.post(`${MUGS_ENDPOINT}/nft/claimauction`, {
      transaction: transactions,
      purchaseData: purchaseData,
      mintAddrArray: mintAddrArray,
    });
    return response?.data;
  } catch (err) {
    console.log("Purchase NFT err = ", err);
  }
}

// Make the offer for the listed nft and save the offer data to the database
export async function makeOfferApi(transactions: any, offerData: any) {
  try {
    const response = await axios.post(`${MUGS_ENDPOINT}/offer/create`, {
      transaction: transactions,
      offerData: offerData,
    });
    return response?.data;
  } catch (err) {
    console.log("Make offer err = ", err);
  }
}

// Place the bid for the auction nft and save the bid data to the database
export async function placeBidApi(transaction: any, bidData: any) {
  try {
    const response = await axios.post(`${MUGS_ENDPOINT}/bid/create`, {
      transaction: transaction,
      bidData: bidData,
    });
    return response?.data;
  } catch (err) {
    console.log("Make bid err = ", err);
  }
}

// Place the bid for the auction nft and save the bid data to the database
export async function getBidByBidder(bidder: any, mintAddr: any) {
  try {
    const response = await axios.post(
      `${MUGS_ENDPOINT}/bid/getBidDataByBidderAndMintAddr`,
      {
        bidder: bidder,
        mintAddr: mintAddr,
      }
    );
    return response?.data;
  } catch (err) {
    console.log("Make bid err = ", err);
  }
}

// Cancel the made offer and save the offer data to the database
export async function cancelOfferApi(
  mintAddr: string,
  offerData: any,
  transactions: any
) {
  try {
    const response = await axios.post(`${MUGS_ENDPOINT}/offer/canceloffer`, {
      mintAddr: mintAddr,
      offerData: offerData,
      transaction: transactions,
    });
    return response?.data;
  } catch (err) {
    console.log("Cancel offer err = ", err);
  }
}

// Accept the offer and save the purchased data to the database
export async function acceptOfferPNftApi(
  mintAddr: string,
  offerData: any,
  transactions: any
) {
  try {
    const response = await axios.post(`${MUGS_ENDPOINT}/offer/acceptOffer`, {
      mintAddr: mintAddr,
      offerData: offerData,
      transaction: transactions,
    });
    return response?.data;
  } catch (err) {
    console.log("Accept offer err = ", err);
  }
}

// Add the new collection to the database by owner
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

// Add the new user to the database
export async function createUserDataApi(data: UserDataType) {
  try {
    const response = await axios.post(`${MUGS_ENDPOINT}/user/create`, {
      data: data,
    });
    return response?.data;
  } catch (err) {
    console.log("Collection create err = ", err);
  }
}

// Get all collection data from the database
export async function getAllCollectionsApi() {
  try {
    const response = await axios.get(`${MUGS_ENDPOINT}/collection/`);
    return response?.data;
  } catch (err) {
    console.log("Getting all collection data err = ", err);
  }
}

// Get all listed nfts data from the database
export async function getAllListedApi() {
  try {
    const response = await axios.get(`${MUGS_ENDPOINT}/nft/`);

    return response?.data;
  } catch (err) {
    console.log("Getting all listed data err = ", err);
  }
}

// Get all listed nfts data by seller from the database
export async function getAllListedDataBySellerApi(seller: string) {
  try {
    const response = await axios.get(
      `${MUGS_ENDPOINT}/nft/findAllBySeller/${seller}`
    );

    return response?.data;
  } catch (err) {
    console.log("Getting all listed data by seller err = ", err);
  }
}

// Get all activity data by seller from the database
export async function getAllActivitiesApi(seller: string) {
  try {
    const response = await axios.get(
      `${MUGS_ENDPOINT}/activity/findAllBySeller/${seller}`
    );

    return response?.data;
  } catch (err) {
    console.log("Getting all activity data err = ", err);
  }
}

// Get all activity data by seller from the database
export async function getAllActivitiesByCollectionAddrApi(
  collectionAddr: string
) {
  try {
    const response = await axios.get(
      `${MUGS_ENDPOINT}/activity/findByCollectionAddr/${collectionAddr}`
    );

    return response?.data;
  } catch (err) {
    console.log("Getting all activity data err = ", err);
  }
}

// Get all activity data by seller from the database
export async function getAllActivitiesByMakerApi(maker: string) {
  try {
    const response = await axios.get(
      `${MUGS_ENDPOINT}/activity/findAllByMaker/${maker}`
    );

    return response?.data;
  } catch (err) {
    console.log("Getting all activity data err = ", err);
  }
}

// Get all activity data by mintaddr from the database
export async function getAllActivitiesByMintAddrApi(seller: string) {
  try {
    const response = await axios.get(
      `${MUGS_ENDPOINT}/activity/findAllByMintAddr/${seller}`
    );

    return response?.data;
  } catch (err) {
    console.log("Getting all activity data by mintaddr err = ", err);
  }
}

// Get all offers by mintaddr from the database
export async function getAllOffersByMintAddrApi(mintAddr: string) {
  try {
    const response = await axios.get(
      `${MUGS_ENDPOINT}/offer/findAllByMintAddr/${mintAddr}`
    );

    return response?.data;
  } catch (err) {
    console.log("Getting all offers data by mintaddr err = ", err);
  }
}

// Get all offers by maker from the database
export async function getAllOffersByMakerApi(maker: string) {
  try {
    const response = await axios.get(
      `${MUGS_ENDPOINT}/offer/findAllByMaker/${maker}`
    );

    return response?.data;
  } catch (err) {
    console.log("Getting all offers data by mintaddr err = ", err);
  }
}

// Get all offers by collectionAddr from the database
export async function getAllOffersByCollectionAddrApi(collectionAddr: string) {
  try {
    const response = await axios.get(
      `${MUGS_ENDPOINT}/offer/findAllByCollectionAddr/${collectionAddr}`
    );

    return response?.data;
  } catch (err) {
    console.log("Getting all offers data by collectionAddr err = ", err);
  }
}

// Get highest offer by mintaddr from the database
export async function getHighOfferByMintAddr(mintAddr: string) {
  try {
    const response = await axios.get(
      `${MUGS_ENDPOINT}/offer/findHighOffer/${mintAddr}`
    );

    return response?.data;
  } catch (err) {
    console.log("Getting highest offer data err = ", err);
  }
}
