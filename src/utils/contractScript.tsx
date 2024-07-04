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
  // const { blockhash } = await solConnection.getLatestBlockhash("confirmed");

  // tx.feePayer = payer.publicKey;
  // tx.recentBlockhash = blockhash;

  // let stx = (await payer.signTransaction(tx)).serialize();

  return tx;

  // const txId = await solConnection.sendRawTransaction(stx, {
  //   skipPreflight: true,
  //   maxRetries: 2,
  // });
  // await solConnection.confirmTransaction(txId, "finalized");
  // console.log("Your transaction signature", txId);
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
  // const { blockhash } = await solConnection.getLatestBlockhash("confirmed");

  // tx.feePayer = payer.publicKey;
  // tx.recentBlockhash = blockhash;

  // let stx = (await payer.signTransaction(tx)).serialize();

  return tx;

  // const txId = await solConnection.sendRawTransaction(stx, {
  //   skipPreflight: true,
  //   maxRetries: 2,
  // });
  // await solConnection.confirmTransaction(txId, "confirmed");
  // console.log("Your transaction signature", txId);
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
  // const { blockhash } = await solConnection.getRecentBlockhash("confirmed");

  // tx.feePayer = payer.publicKey;
  // tx.recentBlockhash = blockhash;

  // let stx = (await payer.signTransaction(tx)).serialize();

  return tx;

  // const txId = await solConnection.sendRawTransaction(stx, {
  //   skipPreflight: true,
  //   maxRetries: 2,
  // });
  // await solConnection.confirmTransaction(txId, "confirmed");
  // console.log("Your transaction signature", txId);
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

async function checkAndInitData(
  accountData: any,
  initDataFunc: (payer: any, publicKey: PublicKey) => Promise<void>,
  payer: any,
  mintAddr: string
): Promise<void> {
  let poolAccount = await solConnection.getAccountInfo(accountData);
  if (poolAccount === null || poolAccount.data === null) {
    return await initDataFunc(payer, new PublicKey(mintAddr));
  }
}

async function sendTransaction(transaction: any): Promise<string> {
  const options = {
    maxRetries: 2,
    skipPreflight: true,
  };
  const signature = await solConnection.sendRawTransaction(
    transaction,
    options
  );
  console.log("list signature: ", signature);
  return signature;
}

export const listPNftForSale = async (
  payer: AnchorWallet,
  items: OwnNFTDataType[]
) => {
  console.log("Items:", items);

  const provider = new anchor.AnchorProvider(
    solConnection,
    window["solana"],
    anchor.AnchorProvider.defaultOptions()
  );
  const program = new anchor.Program(
    MugsMarketplace as anchor.Idl,
    MARKETPLACE_PROGRAM_ID,
    provider
  );

  const initTransactions = [];
  const initData: any[] = []; // Define the type if possible

  if (!(await isInitializedUser(payer.publicKey, solConnection))) {
    const initUserTx = await initUserPool(payer);
    initUserTx.feePayer = payer.publicKey;
    initTransactions.push(initUserTx);
  }

  const [sellData] = await PublicKey.findProgramAddress(
    [Buffer.from(SELL_DATA_SEED), new PublicKey(items[0].mintAddr).toBuffer()],
    MARKETPLACE_PROGRAM_ID
  );
  console.log("Sell Data PDA:", sellData.toBase58());

  const [auctionData] = await PublicKey.findProgramAddress(
    [
      Buffer.from(AUCTION_DATA_SEED),
      new PublicKey(items[0].mintAddr).toBuffer(),
    ],
    MARKETPLACE_PROGRAM_ID
  );
  console.log("Auction Data PDA:", auctionData.toBase58());

  const { blockhash } = await solConnection.getLatestBlockhash("confirmed");

  for (const item of items) {
    if (!(await solConnection.getAccountInfo(sellData))) {
      const initSellTx = await initSellData(
        payer,
        new PublicKey(item.mintAddr)
      );
      initSellTx.feePayer = payer.publicKey;
      initTransactions.push(initSellTx);
    }

    if (!(await solConnection.getAccountInfo(auctionData))) {
      const initAuctionTx = await initAuctionData(
        payer,
        new PublicKey(item.mintAddr)
      );
      initAuctionTx.feePayer = payer.publicKey;
      initTransactions.push(initAuctionTx);
    }
  }

  for (const tx of initTransactions) {
    tx.recentBlockhash = blockhash;
  }

  try {
    const signedInitTransactions = await payer.signAllTransactions(
      initTransactions
    );
    const serializedInitTransactions = signedInitTransactions.map((tx) =>
      tx.serialize()
    );

    const signatures = await Promise.all(
      serializedInitTransactions.map((tx) => sendTransaction(tx))
    );

    await Promise.all(
      signatures.map((signature) =>
        solConnection.confirmTransaction(signature, "confirmed")
      )
    );
  } catch (error) {
    console.error("Failed to initialize transactions:", error);
    throw error;
  }

  const listTransactions = [];
  const listData: any[] = []; // Define the type if possible

  for (const item of items) {
    try {
      const listTx = await createListForSellPNftTx(
        new PublicKey(item.mintAddr),
        payer.publicKey,
        program,
        solConnection,
        item.solPrice * SOL_DECIMAL
      );
      if (!listTx) throw new Error("Transaction creation failed");

      listTx.feePayer = payer.publicKey;
      listTransactions.push(listTx);

      listData.push({
        tokenId: item.tokenId,
        imgUrl: item.imgUrl,
        mintAddr: item.mintAddr,
        seller: payer.publicKey.toBase58(),
        buyer: "",
        collectionAddr: item.collectionAddr,
        metaDataUrl: item.metaDataUrl,
        solPrice: item.solPrice,
        txType: 0,
      });
    } catch (error) {
      console.error(
        `Failed to create transaction for item ${item.tokenId}:`,
        error
      );
      throw error;
    }
  }

  try {
    for (const tx of listTransactions) {
      tx.recentBlockhash = blockhash;
    }

    const signedListTransactions = await payer.signAllTransactions(
      listTransactions
    );
    const serializedListTransactions = signedListTransactions.map((tx) =>
      tx.serialize()
    );

    return { listData, transactions: serializedListTransactions };
  } catch (error) {
    console.error("Failed to sign or serialize transactions:", error);
    throw error;
  }
};

export const pNftDelist = async (
  payer: AnchorWallet,
  items: OwnNFTDataType[]
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
    console.log(
      "User PDA is not Initialized. Should Init User PDA for first usage"
    );
    await initUserPool(payer);
  }

  console.log("delist start");
  const { blockhash } = await solConnection.getLatestBlockhash("confirmed");

  const delistTransactions = [];
  const delistData: any[] = []; // Define the type if possible
  const mintAddrArray = [];
  for (const item of items) {
    try {
      const tx = await createDelistPNftTx(
        new PublicKey(item.mintAddr),
        payer.publicKey,
        program,
        solConnection
      );

      tx.feePayer = payer.publicKey;
      delistTransactions.push(tx);

      delistData.push({
        tokenId: item.tokenId,
        imgUrl: item.imgUrl,
        mintAddr: item.mintAddr,
        seller: payer.publicKey.toBase58(),
        buyer: "",
        collectionAddr: item.collectionAddr,
        metaDataUrl: item.metaDataUrl,
        solPrice: item.solPrice,
        txType: 1,
      });
      mintAddrArray.push(item.mintAddr);
    } catch (error) {
      console.error(
        `Failed to create transaction for item ${item.tokenId}:`,
        error
      );
      throw error;
    }
  }

  try {
    for (const tx of delistTransactions) {
      tx.recentBlockhash = blockhash;
    }

    const signedListTransactions = await payer.signAllTransactions(
      delistTransactions
    );
    const serializedListTransactions = signedListTransactions.map((tx) =>
      tx.serialize()
    );

    // // Optionally, simulate the first transaction
    // const simulateResult = await solConnection.simulateTransaction(
    //   signedListTransactions[0]
    // );

    // console.log("simulateResult ===> ", simulateResult);
    return {
      delistData,
      transactions: serializedListTransactions,
      mintAddrArray: mintAddrArray,
    };
  } catch (error) {
    console.error("Failed to sign or serialize transactions:", error);
    throw error;
  }
};

export const setPrice = async (payer: AnchorWallet, items: OwnNFTDataType) => {
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

  const { blockhash } = await solConnection.getLatestBlockhash("confirmed");
  const tx = await createSetPriceTx(
    new PublicKey(items.mintAddr),
    payer.publicKey,
    items.solPrice * SOL_DECIMAL,
    program
  );

  tx.feePayer = payer.publicKey;
  tx.recentBlockhash = blockhash;
  const updateData = [];
  updateData.push({
    tokenId: items.tokenId,
    imgUrl: items.imgUrl,
    mintAddr: items.mintAddr,
    seller: payer.publicKey.toBase58(),
    buyer: "",
    collectionAddr: items.collectionAddr,
    metaDataUrl: items.metaDataUrl,
    solPrice: items.solPrice,
    txType: 1,
  });

  let stx = (await payer.signTransaction(tx)).serialize();
  // Optionally, simulate the first transaction
  // const simulateResult = await solConnection.simulateTransaction(tx);
  // console.log("Update Price tx simulateResult ===>", simulateResult);

  return {
    transactions: stx,
    updatedPriceItems: updateData[0],
  };
};

export const purchasePNft = async (
  payer: AnchorWallet,
  items: OwnNFTDataType[]
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
  const { blockhash } = await solConnection.getLatestBlockhash("confirmed");

  if (!(await isInitializedUser(payer.publicKey, solConnection))) {
    console.log(
      "User PDA is not Initialized. Should Init User PDA for first usage"
    );
    const initUserTx = await initUserPool(payer);
    initUserTx.feePayer = payer.publicKey;
    initUserTx.recentBlockhash = blockhash;
    let stx = (await payer.signTransaction(initUserTx)).serialize();

    const txId = await solConnection.sendRawTransaction(stx, {
      skipPreflight: true,
      maxRetries: 2,
    });
    await solConnection.confirmTransaction(txId, "finalized");
  }

  const globalPool: any = await getGlobalState(program);
  console.log(
    "globalPool.teamTreasury.slice(0, globalPool.teamCount.toNumber())",
    globalPool.teamTreasury.slice(0, globalPool.teamCount.toNumber())
  );
  console.log(
    "globalPool.teamCount.toNumber()",
    globalPool.teamCount.toNumber()
  );
  const purchaseData: any[] = []; // Define the type if possible
  const purchaseTransactions = [];
  const mintAddrArray = [];

  for (const item of items) {
    try {
      const tx = await createPurchasePNftTx(
        new PublicKey(item.mintAddr),
        payer.publicKey,
        globalPool.teamTreasury.slice(0, globalPool.teamCount.toNumber()),
        program,
        solConnection
      );

      tx.feePayer = payer.publicKey;
      purchaseTransactions.push(tx);

      purchaseData.push({
        tokenId: item.tokenId,
        imgUrl: item.imgUrl,
        mintAddr: item.mintAddr,
        seller: item.seller,
        buyer: payer.publicKey.toBase58(),
        collectionAddr: item.collectionAddr,
        metaDataUrl: item.metaDataUrl,
        solPrice: item.solPrice,
        txType: 2,
      });
      mintAddrArray.push(item.mintAddr);
    } catch (error) {
      console.error(
        `Failed to create transaction for item ${item.tokenId}:`,
        error
      );
      throw error;
    }
  }

  try {
    for (const tx of purchaseTransactions) {
      tx.recentBlockhash = blockhash;
    }

    const signedListTransactions = await payer.signAllTransactions(
      purchaseTransactions
    );
    const serializedListTransactions = signedListTransactions.map((tx) =>
      tx.serialize()
    );

    // // Optionally, simulate the first transaction
    // const simulateResult = await solConnection.simulateTransaction(
    //   signedListTransactions[0]
    // );

    // console.log("simulateResult ===> ", simulateResult);
    return {
      purchaseData,
      transactions: serializedListTransactions,
      mintAddrArray: mintAddrArray,
    };
  } catch (error) {
    console.error("Failed to sign or serialize transactions:", error);
    throw error;
  }
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
