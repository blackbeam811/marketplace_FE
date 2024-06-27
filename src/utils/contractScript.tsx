import { Program, web3 } from "@project-serum/anchor";
import * as anchor from "@project-serum/anchor";
import { Keypair, PublicKey } from "@solana/web3.js";
import fs from "fs";
import path from "path";
import NodeWallet from "@project-serum/anchor/dist/cjs/nodewallet";

import {
  AUCTION_DATA_SEED,
  MARKETPLACE_PROGRAM_ID,
  OFFER_DATA_SEED,
  SELL_DATA_SEED,
} from "./libs/types";
import {
  createAcceptOfferTx,
  createAcceptOfferPNftTx,
  createCancelAuctionTx,
  createCancelOfferTx,
  createClaimAuctionTx,
  createCreateAuctionTx,
  createDelistNftTx,
  createDelistPNftTx,
  createInitAuctionDataTx,
  createInitOfferDataTx,
  createInitSellDataTx,
  createInitUserTx,
  createListForSellNftTx,
  createListForSellPNftTx,
  createMakeOfferTx,
  createPlaceBidTx,
  createPurchaseTx,
  createPurchasePNftTx,
  createSetPriceTx,
  createUpdateFeeTx,
  createUpdateReserveTx,
  getAllListedNFTs,
  getAllOffersForListedNFT,
  getAllStartedAuctions,
  getAuctionDataState,
  getGlobalState,
  getOfferDataState,
  createCreateAuctionPnftTx,
  createCancelAuctionPnftTx,
  createClaimAuctionPnftTx,
} from "./libs/scripts";
import { isInitializedUser } from "./libs/utils";
import { MugsMarketplace } from "./libs/mugs_marketplace";
import { SOLANA_RPC, SOL_DECIMAL } from "@/config";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { ListNFTItemType, OwnNFTDataType } from "@/types/types";

let solConnection = new web3.Connection(SOLANA_RPC);

// Address of the deployed program.
let programId = new anchor.web3.PublicKey(MARKETPLACE_PROGRAM_ID);

export const initUserPool = async (payer: AnchorWallet) => {
  let cloneWindow = window;
  let provider = new anchor.AnchorProvider(
    solConnection,
    cloneWindow["solana"],
    anchor.AnchorProvider.defaultOptions()
  );
  const program = new anchor.Program(
    MugsMarketplace as anchor.Idl,
    MARKETPLACE_PROGRAM_ID,
    provider
  );
  const tx = await createInitUserTx(payer.publicKey, program);
  const { blockhash } = await solConnection.getLatestBlockhash("confirmed");

  tx.feePayer = payer.publicKey;
  tx.recentBlockhash = blockhash;

  let stx = (await payer.signTransaction(tx)).serialize();

  const txId = await solConnection.sendRawTransaction(stx, {
    skipPreflight: true,
    maxRetries: 2,
  });
  await solConnection.confirmTransaction(txId, "finalized");
  console.log("Your transaction signature", txId);
};

export const initSellData = async (payer: AnchorWallet, mint: PublicKey) => {
  let cloneWindow = window;
  let provider = new anchor.AnchorProvider(
    solConnection,
    cloneWindow["solana"],
    anchor.AnchorProvider.defaultOptions()
  );
  const program = new anchor.Program(
    MugsMarketplace as anchor.Idl,
    MARKETPLACE_PROGRAM_ID,
    provider
  );

  const tx = await createInitSellDataTx(mint, payer.publicKey, program);
  const { blockhash } = await solConnection.getLatestBlockhash("confirmed");

  tx.feePayer = payer.publicKey;
  tx.recentBlockhash = blockhash;

  let stx = (await payer.signTransaction(tx)).serialize();

  const txId = await solConnection.sendRawTransaction(stx, {
    skipPreflight: true,
    maxRetries: 2,
  });
  await solConnection.confirmTransaction(txId, "finalized");
  console.log("Your transaction signature", txId);
};

export const initAuctionData = async (payer: AnchorWallet, mint: PublicKey) => {
  let cloneWindow = window;
  let provider = new anchor.AnchorProvider(
    solConnection,
    cloneWindow["solana"],
    anchor.AnchorProvider.defaultOptions()
  );
  const program = new anchor.Program(
    MugsMarketplace as anchor.Idl,
    MARKETPLACE_PROGRAM_ID,
    provider
  );
  const tx = await createInitAuctionDataTx(mint, payer.publicKey, program);
  const { blockhash } = await solConnection.getLatestBlockhash("confirmed");

  tx.feePayer = payer.publicKey;
  tx.recentBlockhash = blockhash;

  let stx = (await payer.signTransaction(tx)).serialize();

  const txId = await solConnection.sendRawTransaction(stx, {
    skipPreflight: true,
    maxRetries: 2,
  });
  await solConnection.confirmTransaction(txId, "finalized");
  console.log("Your transaction signature", txId);
};

export const updateFee = async (payer: AnchorWallet, solFee: number) => {
  let cloneWindow = window;
  let provider = new anchor.AnchorProvider(
    solConnection,
    cloneWindow["solana"],
    anchor.AnchorProvider.defaultOptions()
  );
  const program = new anchor.Program(
    MugsMarketplace as anchor.Idl,
    MARKETPLACE_PROGRAM_ID,
    provider
  );
  console.log(solFee);
  const tx = await createUpdateFeeTx(payer.publicKey, program, solFee);
  const { blockhash } = await solConnection.getRecentBlockhash("confirmed");
  tx.feePayer = payer.publicKey;
  tx.recentBlockhash = blockhash;
  payer.signTransaction(tx);
  let txId = await solConnection.sendTransaction(tx, [
    (payer as NodeWallet).payer,
  ]);
  await solConnection.confirmTransaction(txId, "confirmed");
  console.log("Your transaction signature", txId);
};

export const listNftForSale = async (
  payer: AnchorWallet,
  mint: PublicKey,
  priceSol: number
) => {
  let cloneWindow = window;
  let provider = new anchor.AnchorProvider(
    solConnection,
    cloneWindow["solana"],
    anchor.AnchorProvider.defaultOptions()
  );
  const program = new anchor.Program(
    MugsMarketplace as anchor.Idl,
    MARKETPLACE_PROGRAM_ID,
    provider
  );

  if (!(await isInitializedUser(payer.publicKey, solConnection))) {
    await initUserPool(payer);
  }

  const [sellData, _] = await PublicKey.findProgramAddress(
    [Buffer.from(SELL_DATA_SEED), mint.toBuffer()],
    MARKETPLACE_PROGRAM_ID
  );
  console.log("Sell Data PDA: ", sellData.toBase58());

  let poolAccount = await solConnection.getAccountInfo(sellData);
  if (poolAccount === null || poolAccount.data === null) {
    await initSellData(payer, mint);
  }

  const [auctionData] = await PublicKey.findProgramAddress(
    [Buffer.from(AUCTION_DATA_SEED), mint.toBuffer()],
    MARKETPLACE_PROGRAM_ID
  );
  console.log("Auction Data PDA: ", auctionData.toBase58());

  poolAccount = await solConnection.getAccountInfo(auctionData);
  if (poolAccount === null || poolAccount.data === null) {
    await initAuctionData(payer, mint);
  }

  const tx = await createListForSellNftTx(
    mint,
    payer.publicKey,
    program,
    solConnection,
    priceSol
  );
  const { blockhash } = await solConnection.getRecentBlockhash("confirmed");
  tx.feePayer = payer.publicKey;
  tx.recentBlockhash = blockhash;
  payer.signTransaction(tx);
  let txId = await solConnection.sendTransaction(tx, [
    (payer as NodeWallet).payer,
  ]);
  await solConnection.confirmTransaction(txId, "confirmed");
  console.log("Your transaction signature", txId);
};

export const listPNftForSale = async (
  payer: AnchorWallet,
  mint: PublicKey,
  items: OwnNFTDataType[],
  price: number
) => {
  let cloneWindow = window;
  let provider = new anchor.AnchorProvider(
    solConnection,
    cloneWindow["solana"],
    anchor.AnchorProvider.defaultOptions()
  );
  const program = new anchor.Program(
    MugsMarketplace as anchor.Idl,
    MARKETPLACE_PROGRAM_ID,
    provider
  );
  if (!(await isInitializedUser(payer.publicKey, solConnection))) {
    await initUserPool(payer);
  }

  const [sellData, _] = await PublicKey.findProgramAddress(
    [Buffer.from(SELL_DATA_SEED), mint.toBuffer()],
    MARKETPLACE_PROGRAM_ID
  );
  console.log("Sell Data PDA: ", sellData.toBase58());

  let poolAccount = await solConnection.getAccountInfo(sellData);
  if (poolAccount === null || poolAccount.data === null) {
    await initSellData(payer, mint);
  }

  const [auctionData] = await PublicKey.findProgramAddress(
    [Buffer.from(AUCTION_DATA_SEED), mint.toBuffer()],
    MARKETPLACE_PROGRAM_ID
  );
  console.log("Auction Data PDA: ", auctionData.toBase58());

  poolAccount = await solConnection.getAccountInfo(auctionData);
  if (poolAccount === null || poolAccount.data === null) {
    await initAuctionData(payer, mint);
  }

  const { blockhash } = await solConnection.getRecentBlockhash("confirmed");

  //   //   const txs = [];
  //   //   for (let i = 0; i < items.length; i++) {
  //   //     const listTx = await createListForSellPNftTx(
  //   //       new PublicKey(items[i].mintAddr),
  //   //       payer.publicKey,
  //   //       program,
  //   //       solConnection,
  //   //       price * SOL_DECIMAL
  //   //     );
  //   //     if (!listTx) return;
  //   //     listTx.feePayer = payer.publicKey;
  //   //     txs.push(listTx);
  //   //   }

  //   //   const listData = [];

  //   //   for (let i = 0; i < items.length; i++) {
  //   //     txs[i].recentBlockhash = blockhash;

  //   //     listData.push({
  //   //       tokenId: items[i].tokenId,
  //   //       imgUrl: items[i].imgUrl,
  //   //       mintAddr: items[i].mintAddr,
  //   //       seller: payer?.publicKey.toBase58(),
  //   //       buyer: "",
  //   //       collectionAddr: items[i].collectionAddr,
  //   //       metaDataUrl: items[i].metaDataUrl,
  //   //       solPrice: items[i].price,
  //   //       txType: 0,
  //   //     });
  //   //   }

  //   let signedTxs = await payer.signAllTransactions(txs);
  //   let serializedTxs = signedTxs.map((tx) => tx.serialize());

  //   return { listData, transactions: serializedTxs };
  //   let txId = await solConnection.sendTransaction(tx, [
  //     (payer as NodeWallet).payer,
  //   ]);
  //   await solConnection.confirmTransaction(txId, "confirmed");
  //   console.log("Your transaction signature", txId);
};

export const delistNft = async (payer: AnchorWallet, mint: PublicKey) => {
  let cloneWindow = window;
  let provider = new anchor.AnchorProvider(
    solConnection,
    cloneWindow["solana"],
    anchor.AnchorProvider.defaultOptions()
  );
  const program = new anchor.Program(
    MugsMarketplace as anchor.Idl,
    MARKETPLACE_PROGRAM_ID,
    provider
  );
  console.log(mint.toBase58());
  if (!(await isInitializedUser(payer.publicKey, solConnection))) {
    console.log(
      "User PDA is not Initialized. Should Init User PDA for first usage"
    );
    await initUserPool(payer);
  }

  const tx = await createDelistNftTx(
    mint,
    payer.publicKey,
    program,
    solConnection
  );
  const { blockhash } = await solConnection.getRecentBlockhash("confirmed");
  tx.feePayer = payer.publicKey;
  tx.recentBlockhash = blockhash;
  payer.signTransaction(tx);
  let txId = await solConnection.sendTransaction(tx, [
    (payer as NodeWallet).payer,
  ]);
  await solConnection.confirmTransaction(txId, "confirmed");
  console.log("Your transaction signature", txId);
};

export const pNftDelist = async (payer: AnchorWallet, mint: PublicKey) => {
  let cloneWindow = window;
  let provider = new anchor.AnchorProvider(
    solConnection,
    cloneWindow["solana"],
    anchor.AnchorProvider.defaultOptions()
  );
  const program = new anchor.Program(
    MugsMarketplace as anchor.Idl,
    MARKETPLACE_PROGRAM_ID,
    provider
  );
  console.log(mint.toBase58());
  if (!(await isInitializedUser(payer.publicKey, solConnection))) {
    console.log(
      "User PDA is not Initialized. Should Init User PDA for first usage"
    );
    await initUserPool(payer);
  }

  console.log("delist start");
  const tx = await createDelistPNftTx(
    mint,
    payer.publicKey,
    program,
    solConnection
  );
  const { blockhash } = await solConnection.getRecentBlockhash("confirmed");
  tx.feePayer = payer.publicKey;
  tx.recentBlockhash = blockhash;
  payer.signTransaction(tx);
  const simulatieTx = await solConnection.simulateTransaction(tx);
  console.log("tx =====>", simulatieTx);
  let txId = await solConnection.sendTransaction(tx, [
    (payer as NodeWallet).payer,
  ]);
  await solConnection.confirmTransaction(txId, "confirmed");
  console.log("Your transaction signature", txId);
};

export const setPrice = async (
  payer: AnchorWallet,
  mint: PublicKey,
  newPrice: number
) => {
  console.log(mint.toBase58(), newPrice);
  let cloneWindow = window;
  let provider = new anchor.AnchorProvider(
    solConnection,
    cloneWindow["solana"],
    anchor.AnchorProvider.defaultOptions()
  );
  const program = new anchor.Program(
    MugsMarketplace as anchor.Idl,
    MARKETPLACE_PROGRAM_ID,
    provider
  );
  if (!(await isInitializedUser(payer.publicKey, solConnection))) {
    console.log(
      "User PDA is not Initialized. Should Init User PDA for first usage"
    );
    await initUserPool(payer);
  }

  const tx = await createSetPriceTx(mint, payer.publicKey, newPrice, program);
  const { blockhash } = await solConnection.getRecentBlockhash("confirmed");
  tx.feePayer = payer.publicKey;
  tx.recentBlockhash = blockhash;
  payer.signTransaction(tx);
  let txId = await solConnection.sendTransaction(tx, [
    (payer as NodeWallet).payer,
  ]);
  await solConnection.confirmTransaction(txId, "confirmed");
  console.log("Your transaction signature", txId);
};

export const purchase = async (payer: AnchorWallet, mint: PublicKey) => {
  let cloneWindow = window;
  let provider = new anchor.AnchorProvider(
    solConnection,
    cloneWindow["solana"],
    anchor.AnchorProvider.defaultOptions()
  );
  const program = new anchor.Program(
    MugsMarketplace as anchor.Idl,
    MARKETPLACE_PROGRAM_ID,
    provider
  );
  console.log(mint.toBase58());

  if (!(await isInitializedUser(payer.publicKey, solConnection))) {
    console.log(
      "User PDA is not Initialized. Should Init User PDA for first usage"
    );
    await initUserPool(payer);
  }

  const globalPool: any = await getGlobalState(program);

  const tx = await createPurchaseTx(
    mint,
    payer.publicKey,
    globalPool.teamTreasury.slice(0, globalPool.teamCount.toNumber()),
    program,
    solConnection
  );
  const { blockhash } = await solConnection.getRecentBlockhash("confirmed");
  tx.feePayer = payer.publicKey;
  tx.recentBlockhash = blockhash;
  payer.signTransaction(tx);
  let txId = await solConnection.sendTransaction(tx, [
    (payer as NodeWallet).payer,
  ]);
  await solConnection.confirmTransaction(txId, "confirmed");
  console.log("Your transaction signature", txId);
};

export const purchasePNft = async (payer: AnchorWallet, mint: PublicKey) => {
  console.log(mint.toBase58());
  let cloneWindow = window;
  let provider = new anchor.AnchorProvider(
    solConnection,
    cloneWindow["solana"],
    anchor.AnchorProvider.defaultOptions()
  );
  const program = new anchor.Program(
    MugsMarketplace as anchor.Idl,
    MARKETPLACE_PROGRAM_ID,
    provider
  );
  if (!(await isInitializedUser(payer.publicKey, solConnection))) {
    console.log(
      "User PDA is not Initialized. Should Init User PDA for first usage"
    );
    await initUserPool(payer);
  }

  const globalPool: any = await getGlobalState(program);

  const tx = await createPurchasePNftTx(
    mint,
    payer.publicKey,
    globalPool.teamTreasury.slice(0, globalPool.teamCount.toNumber()),
    program,
    solConnection
  );
  const { blockhash } = await solConnection.getRecentBlockhash("confirmed");
  tx.feePayer = payer.publicKey;
  tx.recentBlockhash = blockhash;
  payer.signTransaction(tx);
  let simulatieTx = await solConnection.simulateTransaction(tx);
  console.log("tx =====>", simulatieTx);
  let txId = await solConnection.sendTransaction(tx, [
    (payer as NodeWallet).payer,
  ]);
  await solConnection.confirmTransaction(txId, "confirmed");
  console.log("Your transaction signature", txId);
};

export const initOfferData = async (payer: AnchorWallet, mint: PublicKey) => {
  let cloneWindow = window;
  let provider = new anchor.AnchorProvider(
    solConnection,
    cloneWindow["solana"],
    anchor.AnchorProvider.defaultOptions()
  );
  const program = new anchor.Program(
    MugsMarketplace as anchor.Idl,
    MARKETPLACE_PROGRAM_ID,
    provider
  );
  const tx = await createInitOfferDataTx(mint, payer.publicKey, program);
  const { blockhash } = await solConnection.getLatestBlockhash("confirmed");

  tx.feePayer = payer.publicKey;
  tx.recentBlockhash = blockhash;
  payer.signTransaction(tx);
  let txId = await solConnection.sendTransaction(tx, [
    (payer as NodeWallet).payer,
  ]);
  await solConnection.confirmTransaction(txId, "finalized");
  console.log("Your transaction signature", txId);
};

export const makeOffer = async (
  payer: AnchorWallet,
  mint: PublicKey,
  price: number
) => {
  console.log(mint.toBase58(), price);
  let cloneWindow = window;
  let provider = new anchor.AnchorProvider(
    solConnection,
    cloneWindow["solana"],
    anchor.AnchorProvider.defaultOptions()
  );
  const program = new anchor.Program(
    MugsMarketplace as anchor.Idl,
    MARKETPLACE_PROGRAM_ID,
    provider
  );
  if (!(await isInitializedUser(payer.publicKey, solConnection))) {
    console.log(
      "User PDA is not Initialized. Should Init User PDA for first usage"
    );
    await initUserPool(payer);
  }

  const [offerData, _] = await PublicKey.findProgramAddress(
    [Buffer.from(OFFER_DATA_SEED), mint.toBuffer(), payer.publicKey.toBuffer()],
    MARKETPLACE_PROGRAM_ID
  );
  console.log("Offer Data PDA: ", offerData.toBase58());

  let poolAccount = await solConnection.getAccountInfo(offerData);
  if (poolAccount === null || poolAccount.data === null) {
    await initOfferData(payer, mint);
  }

  const tx = await createMakeOfferTx(mint, payer.publicKey, price, program);
  const { blockhash } = await solConnection.getRecentBlockhash("confirmed");
  tx.feePayer = payer.publicKey;
  tx.recentBlockhash = blockhash;
  payer.signTransaction(tx);
  let txId = await solConnection.sendTransaction(tx, [
    (payer as NodeWallet).payer,
  ]);
  await solConnection.confirmTransaction(txId, "confirmed");
  console.log("Your transaction signature", txId);
};

export const cancelOffer = async (payer: AnchorWallet, mint: PublicKey) => {
  let cloneWindow = window;
  let provider = new anchor.AnchorProvider(
    solConnection,
    cloneWindow["solana"],
    anchor.AnchorProvider.defaultOptions()
  );
  const program = new anchor.Program(
    MugsMarketplace as anchor.Idl,
    MARKETPLACE_PROGRAM_ID,
    provider
  );
  console.log(mint.toBase58());

  if (!(await isInitializedUser(payer.publicKey, solConnection))) {
    console.log(
      "User PDA is not Initialized. Should Init User PDA for first usage"
    );
    await initUserPool(payer);
  }

  const tx = await createCancelOfferTx(mint, payer.publicKey, program);
  const { blockhash } = await solConnection.getRecentBlockhash("confirmed");
  tx.feePayer = payer.publicKey;
  tx.recentBlockhash = blockhash;
  payer.signTransaction(tx);
  const simulatieTx = await solConnection.simulateTransaction(tx);
  console.log("tx =====>", simulatieTx);
  let txId = await solConnection.sendTransaction(tx, [
    (payer as NodeWallet).payer,
  ]);
  await solConnection.confirmTransaction(txId, "confirmed");
  console.log("Your transaction signature", txId);
};

export const acceptOffer = async (
  payer: AnchorWallet,
  mint: PublicKey,
  buyer: PublicKey
) => {
  console.log(mint.toBase58(), buyer.toBase58());
  let cloneWindow = window;
  let provider = new anchor.AnchorProvider(
    solConnection,
    cloneWindow["solana"],
    anchor.AnchorProvider.defaultOptions()
  );
  const program = new anchor.Program(
    MugsMarketplace as anchor.Idl,
    MARKETPLACE_PROGRAM_ID,
    provider
  );
  if (!(await isInitializedUser(payer.publicKey, solConnection))) {
    console.log(
      "User PDA is not Initialized. Should Init User PDA for first usage"
    );
    await initUserPool(payer);
  }

  const globalPool: any = await getGlobalState(program);

  const tx = await createAcceptOfferTx(
    mint,
    buyer,
    globalPool.teamTreasury.slice(0, globalPool.teamCount.toNumber()),
    program,
    solConnection
  );
  const { blockhash } = await solConnection.getRecentBlockhash("confirmed");
  tx.feePayer = payer.publicKey;
  tx.recentBlockhash = blockhash;
  payer.signTransaction(tx);
  const simulatieTx = await solConnection.simulateTransaction(tx);
  console.log("tx =====>", simulatieTx);
  let txId = await solConnection.sendTransaction(tx, [
    (payer as NodeWallet).payer,
  ]);
  await solConnection.confirmTransaction(txId, "confirmed");
  console.log("Your transaction signature", txId);
};

export const acceptOfferPNft = async (
  payer: AnchorWallet,
  mint: PublicKey,
  buyer: PublicKey
) => {
  console.log(mint.toBase58(), buyer.toBase58());
  let cloneWindow = window;
  let provider = new anchor.AnchorProvider(
    solConnection,
    cloneWindow["solana"],
    anchor.AnchorProvider.defaultOptions()
  );
  const program = new anchor.Program(
    MugsMarketplace as anchor.Idl,
    MARKETPLACE_PROGRAM_ID,
    provider
  );
  if (!(await isInitializedUser(payer.publicKey, solConnection))) {
    console.log(
      "User PDA is not Initialized. Should Init User PDA for first usage"
    );
    await initUserPool(payer);
  }

  const globalPool: any = await getGlobalState(program);

  const tx = await createAcceptOfferPNftTx(
    mint,
    buyer,
    globalPool.teamTreasury.slice(0, globalPool.teamCount.toNumber()),
    program,
    solConnection
  );
  const { blockhash } = await solConnection.getRecentBlockhash("confirmed");
  tx.feePayer = payer.publicKey;
  tx.recentBlockhash = blockhash;
  payer.signTransaction(tx);
  let simulatieTx = await solConnection.simulateTransaction(tx);
  console.log("tx =====>", simulatieTx);
  let txId = await solConnection.sendTransaction(tx, [
    (payer as NodeWallet).payer,
  ]);
  await solConnection.confirmTransaction(txId, "confirmed");
  console.log("Your transaction signature", txId);
};

export const createAuction = async (
  payer: AnchorWallet,
  mint: PublicKey,
  startPrice: number,
  minIncrease: number,
  duration: number,
  reserved: boolean
) => {
  console.log(mint.toBase58(), startPrice, minIncrease, duration, reserved);
  let cloneWindow = window;
  let provider = new anchor.AnchorProvider(
    solConnection,
    cloneWindow["solana"],
    anchor.AnchorProvider.defaultOptions()
  );
  const program = new anchor.Program(
    MugsMarketplace as anchor.Idl,
    MARKETPLACE_PROGRAM_ID,
    provider
  );
  if (!(await isInitializedUser(payer.publicKey, solConnection))) {
    console.log(
      "User PDA is not Initialized. Should Init User PDA for first usage"
    );
    await initUserPool(payer);
  }

  const [sellData, _] = await PublicKey.findProgramAddress(
    [Buffer.from(SELL_DATA_SEED), mint.toBuffer()],
    MARKETPLACE_PROGRAM_ID
  );
  console.log("Sell Data PDA: ", sellData.toBase58());

  let poolAccount = await solConnection.getAccountInfo(sellData);
  if (poolAccount === null || poolAccount.data === null) {
    await initSellData(payer, mint);
  }

  const [auctionData] = await PublicKey.findProgramAddress(
    [Buffer.from(AUCTION_DATA_SEED), mint.toBuffer()],
    MARKETPLACE_PROGRAM_ID
  );
  console.log("Auction Data PDA: ", auctionData.toBase58());

  poolAccount = await solConnection.getAccountInfo(auctionData);
  if (poolAccount === null || poolAccount.data === null) {
    await initAuctionData(payer, mint);
  }

  const tx = await createCreateAuctionTx(
    mint,
    payer.publicKey,
    startPrice,
    minIncrease,
    duration,
    reserved,
    program,
    solConnection
  );
  const { blockhash } = await solConnection.getRecentBlockhash("confirmed");
  tx.feePayer = payer.publicKey;
  tx.recentBlockhash = blockhash;
  payer.signTransaction(tx);
  let txId = await solConnection.sendTransaction(tx, [
    (payer as NodeWallet).payer,
  ]);
  await solConnection.confirmTransaction(txId, "confirmed");
  console.log("Your transaction signature", txId);
};
export const createAuctionPNft = async (
  payer: AnchorWallet,
  mint: PublicKey,
  startPrice: number,
  minIncrease: number,
  duration: number,
  reserved: boolean
) => {
  console.log(mint.toBase58(), startPrice, minIncrease, duration, reserved);
  let cloneWindow = window;
  let provider = new anchor.AnchorProvider(
    solConnection,
    cloneWindow["solana"],
    anchor.AnchorProvider.defaultOptions()
  );
  const program = new anchor.Program(
    MugsMarketplace as anchor.Idl,
    MARKETPLACE_PROGRAM_ID,
    provider
  );
  if (!(await isInitializedUser(payer.publicKey, solConnection))) {
    console.log(
      "User PDA is not Initialized. Should Init User PDA for first usage"
    );
    await initUserPool(payer);
  }

  const [sellData, _] = await PublicKey.findProgramAddress(
    [Buffer.from(SELL_DATA_SEED), mint.toBuffer()],
    MARKETPLACE_PROGRAM_ID
  );
  console.log("Sell Data PDA: ", sellData.toBase58());

  let poolAccount = await solConnection.getAccountInfo(sellData);
  if (poolAccount === null || poolAccount.data === null) {
    await initSellData(payer, mint);
  }

  const [auctionData] = await PublicKey.findProgramAddress(
    [Buffer.from(AUCTION_DATA_SEED), mint.toBuffer()],
    MARKETPLACE_PROGRAM_ID
  );
  console.log("Auction Data PDA: ", auctionData.toBase58());

  poolAccount = await solConnection.getAccountInfo(auctionData);
  if (poolAccount === null || poolAccount.data === null) {
    await initAuctionData(payer, mint);
  }

  const tx = await createCreateAuctionPnftTx(
    mint,
    payer.publicKey,
    startPrice,
    minIncrease,
    duration,
    reserved,
    program,
    solConnection
  );
  const { blockhash } = await solConnection.getRecentBlockhash("confirmed");
  tx.feePayer = payer.publicKey;
  tx.recentBlockhash = blockhash;
  payer.signTransaction(tx);
  const simulatieTx = await solConnection.simulateTransaction(tx);
  console.log("tx =====>", simulatieTx);
  let txId = await solConnection.sendTransaction(tx, [
    (payer as NodeWallet).payer,
  ]);
  await solConnection.confirmTransaction(txId, "confirmed");
  console.log("Your transaction signature", txId);
};
export const placeBid = async (
  payer: AnchorWallet,
  mint: PublicKey,
  price: number
) => {
  console.log(mint.toBase58(), price);
  let cloneWindow = window;
  let provider = new anchor.AnchorProvider(
    solConnection,
    cloneWindow["solana"],
    anchor.AnchorProvider.defaultOptions()
  );
  const program = new anchor.Program(
    MugsMarketplace as anchor.Idl,
    MARKETPLACE_PROGRAM_ID,
    provider
  );
  if (!(await isInitializedUser(payer.publicKey, solConnection))) {
    console.log(
      "User PDA is not Initialized. Should Init User PDA for first usage"
    );
    await initUserPool(payer);
  }

  const tx = await createPlaceBidTx(mint, payer.publicKey, price, program);
  const { blockhash } = await solConnection.getRecentBlockhash("confirmed");
  tx.feePayer = payer.publicKey;
  tx.recentBlockhash = blockhash;
  payer.signTransaction(tx);
  const simulatieTx = await solConnection.simulateTransaction(tx);
  console.log("tx =====>", simulatieTx);
  let txId = await solConnection.sendTransaction(tx, [
    (payer as NodeWallet).payer,
  ]);
  await solConnection.confirmTransaction(txId, "confirmed");
  console.log("Your transaction signature", txId);
};

export const claimAuction = async (payer: AnchorWallet, mint: PublicKey) => {
  console.log(mint.toBase58());
  let cloneWindow = window;
  let provider = new anchor.AnchorProvider(
    solConnection,
    cloneWindow["solana"],
    anchor.AnchorProvider.defaultOptions()
  );
  const program = new anchor.Program(
    MugsMarketplace as anchor.Idl,
    MARKETPLACE_PROGRAM_ID,
    provider
  );
  if (!(await isInitializedUser(payer.publicKey, solConnection))) {
    console.log(
      "User PDA is not Initialized. Should Init User PDA for first usage"
    );
    await initUserPool(payer);
  }

  const globalPool: any = await getGlobalState(program);

  const tx = await createClaimAuctionTx(
    mint,
    payer.publicKey,
    globalPool.teamTreasury.slice(0, globalPool.teamCount.toNumber()),
    program,
    solConnection
  );
  const { blockhash } = await solConnection.getRecentBlockhash("confirmed");
  tx.feePayer = payer.publicKey;
  tx.recentBlockhash = blockhash;
  payer.signTransaction(tx);
  let txId = await solConnection.sendTransaction(tx, [
    (payer as NodeWallet).payer,
  ]);
  await solConnection.confirmTransaction(txId, "confirmed");
  console.log("Your transaction signature", txId);
};
export const claimAuctionPnft = async (
  payer: AnchorWallet,
  mint: PublicKey
) => {
  console.log(mint.toBase58());
  let cloneWindow = window;
  let provider = new anchor.AnchorProvider(
    solConnection,
    cloneWindow["solana"],
    anchor.AnchorProvider.defaultOptions()
  );
  const program = new anchor.Program(
    MugsMarketplace as anchor.Idl,
    MARKETPLACE_PROGRAM_ID,
    provider
  );
  if (!(await isInitializedUser(payer.publicKey, solConnection))) {
    console.log(
      "User PDA is not Initialized. Should Init User PDA for first usage"
    );
    await initUserPool(payer);
  }

  const globalPool: any = await getGlobalState(program);

  const tx = await createClaimAuctionPnftTx(
    mint,
    payer.publicKey,
    globalPool.teamTreasury.slice(0, globalPool.teamCount.toNumber()),
    program,
    solConnection
  );
  const { blockhash } = await solConnection.getRecentBlockhash("confirmed");
  tx.feePayer = payer.publicKey;
  tx.recentBlockhash = blockhash;
  payer.signTransaction(tx);
  const simulatieTx = await solConnection.simulateTransaction(tx);
  console.log("tx =====>", simulatieTx);
  let txId = await solConnection.sendTransaction(tx, [
    (payer as NodeWallet).payer,
  ]);
  await solConnection.confirmTransaction(txId, "confirmed");
  console.log("Your transaction signature", txId);
};

export const updateReserve = async (
  payer: AnchorWallet,
  mint: PublicKey,
  newPrice: number
) => {
  console.log(mint.toBase58(), newPrice);
  let cloneWindow = window;
  let provider = new anchor.AnchorProvider(
    solConnection,
    cloneWindow["solana"],
    anchor.AnchorProvider.defaultOptions()
  );
  const program = new anchor.Program(
    MugsMarketplace as anchor.Idl,
    MARKETPLACE_PROGRAM_ID,
    provider
  );
  if (!(await isInitializedUser(payer.publicKey, solConnection))) {
    console.log(
      "User PDA is not Initialized. Should Init User PDA for first usage"
    );
    await initUserPool(payer);
  }

  const tx = await createUpdateReserveTx(
    mint,
    payer.publicKey,
    newPrice,
    program
  );
  const { blockhash } = await solConnection.getRecentBlockhash("confirmed");
  tx.feePayer = payer.publicKey;
  tx.recentBlockhash = blockhash;
  payer.signTransaction(tx);
  let txId = await solConnection.sendTransaction(tx, [
    (payer as NodeWallet).payer,
  ]);
  await solConnection.confirmTransaction(txId, "confirmed");
  console.log("Your transaction signature", txId);
};

export const cancelAuction = async (payer: AnchorWallet, mint: PublicKey) => {
  console.log(mint.toBase58());
  let cloneWindow = window;
  let provider = new anchor.AnchorProvider(
    solConnection,
    cloneWindow["solana"],
    anchor.AnchorProvider.defaultOptions()
  );
  const program = new anchor.Program(
    MugsMarketplace as anchor.Idl,
    MARKETPLACE_PROGRAM_ID,
    provider
  );
  if (!(await isInitializedUser(payer.publicKey, solConnection))) {
    console.log(
      "User PDA is not Initialized. Should Init User PDA for first usage"
    );
    await initUserPool(payer);
  }

  const tx = await createCancelAuctionTx(
    mint,
    payer.publicKey,
    program,
    solConnection
  );
  const { blockhash } = await solConnection.getRecentBlockhash("confirmed");
  tx.feePayer = payer.publicKey;
  tx.recentBlockhash = blockhash;
  payer.signTransaction(tx);
  const simulatieTx = await solConnection.simulateTransaction(tx);
  console.log("tx =====>", simulatieTx);
  let txId = await solConnection.sendTransaction(tx, [
    (payer as NodeWallet).payer,
  ]);
  await solConnection.confirmTransaction(txId, "confirmed");
  console.log("Your transaction signature", txId);
};
export const cancelAuctionPnft = async (
  payer: AnchorWallet,
  mint: PublicKey
) => {
  console.log(mint.toBase58());
  let cloneWindow = window;
  let provider = new anchor.AnchorProvider(
    solConnection,
    cloneWindow["solana"],
    anchor.AnchorProvider.defaultOptions()
  );
  const program = new anchor.Program(
    MugsMarketplace as anchor.Idl,
    MARKETPLACE_PROGRAM_ID,
    provider
  );
  if (!(await isInitializedUser(payer.publicKey, solConnection))) {
    console.log(
      "User PDA is not Initialized. Should Init User PDA for first usage"
    );
    await initUserPool(payer);
  }

  const tx = await createCancelAuctionPnftTx(
    mint,
    payer.publicKey,
    program,
    solConnection
  );
  const { blockhash } = await solConnection.getRecentBlockhash("confirmed");
  tx.feePayer = payer.publicKey;
  tx.recentBlockhash = blockhash;
  payer.signTransaction(tx);
  const simulatieTx = await solConnection.simulateTransaction(tx);
  console.log("tx =====>", simulatieTx);
  let txId = await solConnection.sendTransaction(tx, [
    (payer as NodeWallet).payer,
  ]);
  await solConnection.confirmTransaction(txId, "confirmed");
  console.log("Your transaction signature", txId);
};

export const getOfferDataInfo = async (
  payer: AnchorWallet,
  mint: PublicKey,
  userAddress: PublicKey
) => {
  let cloneWindow = window;
  let provider = new anchor.AnchorProvider(
    solConnection,
    cloneWindow["solana"],
    anchor.AnchorProvider.defaultOptions()
  );
  const program = new anchor.Program(
    MugsMarketplace as anchor.Idl,
    MARKETPLACE_PROGRAM_ID,
    provider
  );
  const offerData: any = await getOfferDataState(mint, userAddress, program);
  return {
    mint: offerData.mint.toBase58(),
    buyer: offerData.buyer.toBase58(),
    offerPrice: offerData.offerPrice.toNumber(),
    offerListingDate: offerData.offerListingDate.toNumber(),
    active: offerData.active.toNumber(),
  };
};

export const getAuctionDataInfo = async (
  payer: AnchorWallet,
  mint: PublicKey
) => {
  let cloneWindow = window;
  let provider = new anchor.AnchorProvider(
    solConnection,
    cloneWindow["solana"],
    anchor.AnchorProvider.defaultOptions()
  );
  const program = new anchor.Program(
    MugsMarketplace as anchor.Idl,
    MARKETPLACE_PROGRAM_ID,
    provider
  );
  const auctionData: any = await getAuctionDataState(mint, program);
  return {
    mint: auctionData.mint.toBase58(),
    creator: auctionData.creator.toBase58(),
    startPrice: auctionData.startPrice.toNumber(),
    minIncreaseAmount: auctionData.minIncreaseAmount.toNumber(),
    startDate: auctionData.startDate.toNumber(),
    lastBidder: auctionData.lastBidder.toBase58(),
    lastBidDate: auctionData.lastBidDate.toNumber(),
    highestBid: auctionData.highestBid.toNumber(),
    duration: auctionData.duration.toNumber(),
    status: auctionData.status.toNumber(),
  };
};

export const getGlobalInfo = async () => {
  let cloneWindow = window;
  let provider = new anchor.AnchorProvider(
    solConnection,
    cloneWindow["solana"],
    anchor.AnchorProvider.defaultOptions()
  );
  const program = new anchor.Program(
    MugsMarketplace as anchor.Idl,
    MARKETPLACE_PROGRAM_ID,
    provider
  );
  const globalPool: any = await getGlobalState(program);
  const result = {
    admin: globalPool.superAdmin.toBase58(),
    marketFeeSol: globalPool.marketFeeSol.toNumber(),
    teamCount: globalPool.teamCount.toNumber(),
    teamTreasury: globalPool.teamTreasury
      .slice(0, globalPool.teamCount.toNumber())
      .map((info: { toBase58: () => any }) => info.toBase58()),
    treasuryRate: globalPool.treasuryRate
      .slice(0, globalPool.teamCount.toNumber())
      .map((info: { toNumber: () => any }) => info.toNumber()),
  };

  return result;
};

export const getAllNFTs = async (rpc?: string) => {
  return await getAllListedNFTs(solConnection, rpc);
};

export const getAllOffersForNFT = async (address: string, rpc?: string) => {
  return await getAllOffersForListedNFT(address, solConnection, rpc);
};

export const getAllAuctions = async (rpc?: string) => {
  return await getAllStartedAuctions(solConnection, rpc);
};
