import axios from "axios";
import { Transaction, TransactionBuilder } from "@metaplex-foundation/umi";

export async function redeemAPI(
  signedTransaction: Uint8Array,
  nftAddr: string,
  userWallet: string,
  email: string,
  homeAddr: string
) {
  console.log("NEXT_PUBLIC_ENDPOINT", process.env.NEXT_PUBLIC_ENDPOINT);
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
