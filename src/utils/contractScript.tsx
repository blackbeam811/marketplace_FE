import { web3 } from "@project-serum/anchor";
import * as anchor from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import NodeWallet from "@project-serum/anchor/dist/cjs/nodewallet";

import {
  AUCTION_DATA_SEED,
  MARKETPLACE_PROGRAM_ID,
  OFFER_DATA_SEED,
  SELL_DATA_SEED,
} from "./libs/types";
import {
  createAcceptOfferPNftTx,
  createCancelOfferTx,
  createDelistPNftTx,
  createInitAuctionDataTx,
  createInitOfferDataTx,
  createInitSellDataTx,
  createInitUserTx,
  createListForSellPNftTx,
  createMakeOfferTx,
  createPlaceBidTx,
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
import { OfferDataType, OwnNFTDataType } from "@/types/types";

let solConnection = new web3.Connection(SOLANA_RPC);

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
  return tx;
  // const { blockhash } = await solConnection.getLatestBlockhash("confirmed");

  // tx.feePayer = payer.publicKey;
  // tx.recentBlockhash = blockhash;

  // let stx = (await payer.signTransaction(tx)).serialize();

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

  return tx;
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

  return tx;
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

  return tx;
};

export const makeOffer = async (
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
  const initTransactions = [];

  if (!(await isInitializedUser(payer.publicKey, solConnection))) {
    console.log(
      "User PDA is not Initialized. Should Init User PDA for first usage"
    );
    const initUserTx = await initUserPool(payer);
    initUserTx.feePayer = payer.publicKey;
    initTransactions.push(initUserTx);
  }

  const [offerData, _] = await PublicKey.findProgramAddress(
    [
      Buffer.from(OFFER_DATA_SEED),
      new PublicKey(items[0].mintAddr).toBuffer(),
      payer.publicKey.toBuffer(),
    ],
    MARKETPLACE_PROGRAM_ID
  );
  console.log("Offer Data PDA: ", offerData.toBase58());

  let poolAccount = await solConnection.getAccountInfo(offerData);
  if (poolAccount === null || poolAccount.data === null) {
    const initOffernTx = await initOfferData(
      payer,
      new PublicKey(items[0].mintAddr)
    );
    initOffernTx.feePayer = payer.publicKey;
    initTransactions.push(initOffernTx);
  }

  const { blockhash } = await solConnection.getLatestBlockhash("confirmed");

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

  const offersData: any[] = [];
  offersData.push({
    tokenId: items[0].tokenId,
    imgUrl: items[0].imgUrl,
    mintAddr: items[0].mintAddr,
    seller: items[0].seller,
    buyer: payer.publicKey.toBase58(),
    collectionAddr: items[0].collectionAddr,
    metaDataUrl: items[0].metaDataUrl,
    solPrice: items[0].solPrice,
    txType: 2,
  });

  const tx = await createMakeOfferTx(
    new PublicKey(items[0].mintAddr),
    payer.publicKey,
    items[0].solPrice * SOL_DECIMAL,
    program
  );
  tx.feePayer = payer.publicKey;
  tx.recentBlockhash = blockhash;
  let stx = (await payer.signTransaction(tx)).serialize();

  return { transaction: stx, offerData: offersData };
};

export const cancelOffer = async (
  payer: AnchorWallet,
  item: OfferDataType[]
) => {
  console.log("offerData ===> ", item);
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

  const tx = await createCancelOfferTx(
    new PublicKey(item[0].mintAddr),
    payer.publicKey,
    program
  );
  const { blockhash } = await solConnection.getLatestBlockhash("confirmed");
  tx.feePayer = payer.publicKey;
  tx.recentBlockhash = blockhash;
  let stx = (await payer.signTransaction(tx)).serialize();

  return { mintAddr: item[0].mintAddr, offerData: item[0], transaction: stx };
};

export const acceptOfferPNft = async (
  payer: AnchorWallet,
  item: OfferDataType
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

  const globalPool: any = await getGlobalState(program);

  const tx = await createAcceptOfferPNftTx(
    new PublicKey(item.mintAddr),
    new PublicKey(item.buyer),
    globalPool.teamTreasury.slice(0, globalPool.teamCount.toNumber()),
    program,
    solConnection
  );

  const offersData: any[] = [];
  offersData.push({
    tokenId: item.tokenId,
    imgUrl: item.imgUrl,
    mintAddr: item.mintAddr,
    collectionAddr: item.collectionAddr,
    seller: item.seller,
    buyer: item.buyer,
    solPrice: item.offerPrice,
    txType: 2,
  });

  const { blockhash } = await solConnection.getLatestBlockhash("confirmed");
  tx.feePayer = payer.publicKey;
  tx.recentBlockhash = blockhash;
  let stx = (await payer.signTransaction(tx)).serialize();

  console.log("item.mintAddr => ", item.mintAddr);
  console.log("offerData => ", offersData);
  console.log("transaction => ", stx);
  return { mintAddr: item.mintAddr, offerData: offersData, transaction: stx };
};

export const createAuctionPNft = async (
  payer: AnchorWallet,
  item: OwnNFTDataType,
  startPrice: number,
  minIncrease: number,
  duration: number,
  reserved: boolean
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

  const initTransactions = [];

  if (!(await isInitializedUser(payer.publicKey, solConnection))) {
    const initUserTx = await initUserPool(payer);
    initUserTx.feePayer = payer.publicKey;
    initTransactions.push(initUserTx);
  }

  const [sellData] = await PublicKey.findProgramAddress(
    [Buffer.from(SELL_DATA_SEED), new PublicKey(item.mintAddr).toBuffer()],
    MARKETPLACE_PROGRAM_ID
  );
  console.log("Sell Data PDA:", sellData.toBase58());

  const [auctionData] = await PublicKey.findProgramAddress(
    [Buffer.from(AUCTION_DATA_SEED), new PublicKey(item.mintAddr).toBuffer()],
    MARKETPLACE_PROGRAM_ID
  );
  console.log("Auction Data PDA:", auctionData.toBase58());

  const { blockhash } = await solConnection.getLatestBlockhash("confirmed");

  if (!(await solConnection.getAccountInfo(sellData))) {
    const initSellTx = await initSellData(payer, new PublicKey(item.mintAddr));
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
  if (!(await isInitializedUser(payer.publicKey, solConnection))) {
    console.log(
      "User PDA is not Initialized. Should Init User PDA for first usage"
    );
    await initUserPool(payer);
  }

  const tx = await createCreateAuctionPnftTx(
    new PublicKey(item.mintAddr),
    payer.publicKey,
    startPrice * SOL_DECIMAL,
    minIncrease * SOL_DECIMAL,
    duration / 1000,
    reserved,
    program,
    solConnection
  );
  tx.feePayer = payer.publicKey;
  tx.recentBlockhash = blockhash;
  let stx = (await payer.signTransaction(tx)).serialize();

  const auction: any[] = [];
  auction.push({
    tokenId: item.tokenId,
    imgUrl: item.imgUrl,
    mintAddr: item.mintAddr,
    collectionAddr: item.collectionAddr,
    metaDataUrl: item.metaDataUrl,
    seller: item.seller,
    buyer: "",
    solPrice: startPrice,
    minIncrease: minIncrease,
    endTime: duration,
    txType: 5,
  });

  console.log("tx ===>", tx);
  return { transaction: stx, auction: auction };
};
export const placeBid = async (
  payer: AnchorWallet,
  items: OwnNFTDataType,
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
  const initTransactions = [];

  if (!(await isInitializedUser(payer.publicKey, solConnection))) {
    console.log(
      "User PDA is not Initialized. Should Init User PDA for first usage"
    );
    const initUserTx = await initUserPool(payer);
    initUserTx.feePayer = payer.publicKey;
    initTransactions.push(initUserTx);
  }

  const { blockhash } = await solConnection.getLatestBlockhash("confirmed");
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

  const bidData: any[] = [];
  bidData.push({
    tokenId: items.tokenId,
    imgUrl: items.imgUrl,
    mintAddr: items.mintAddr,
    seller: items.seller,
    buyer: payer.publicKey.toBase58(),
    collectionAddr: items.collectionAddr,
    metaDataUrl: items.metaDataUrl,
    bidPrice: price,
    txType: 2,
  });

  const tx = await createPlaceBidTx(
    new PublicKey(items.mintAddr),
    payer.publicKey,
    price * SOL_DECIMAL,
    program
  );
  tx.feePayer = payer.publicKey;
  tx.recentBlockhash = blockhash;
  let stx = (await payer.signTransaction(tx)).serialize();

  return { transaction: stx, bidData: bidData };
};

export const claimAuctionPnft = async (
  payer: AnchorWallet,
  item: OwnNFTDataType
) => {
  console.log("claimitemDetail => ", item);
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
  const initTransactions = [];
  const mintAddrArray = [];
  mintAddrArray.push(item.mintAddr);

  if (!(await isInitializedUser(payer.publicKey, solConnection))) {
    console.log(
      "User PDA is not Initialized. Should Init User PDA for first usage"
    );
    const initUserTx = await initUserPool(payer);
    initUserTx.feePayer = payer.publicKey;
    initTransactions.push(initUserTx);
  }

  const { blockhash } = await solConnection.getLatestBlockhash("confirmed");
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

  const globalPool: any = await getGlobalState(program);

  const claimAuctionData: any[] = [];

  claimAuctionData.push({
    tokenId: item.tokenId,
    imgUrl: item.imgUrl,
    mintAddr: item.mintAddr,
    seller: item.seller,
    buyer: payer.publicKey.toBase58(),
    collectionAddr: item.collectionAddr,
    metaDataUrl: item.metaDataUrl,
    solPrice: item.lastBidPrice,
    txType: 2,
  });

  const tx = await createClaimAuctionPnftTx(
    new PublicKey(item.mintAddr),
    payer.publicKey,
    globalPool.teamTreasury.slice(0, globalPool.teamCount.toNumber()),
    program,
    solConnection
  );
  tx.feePayer = payer.publicKey;
  tx.recentBlockhash = blockhash;
  let stx = (await payer.signTransaction(tx)).serialize();
  console.log("claimAuctionData =>", claimAuctionData);
  return {
    transaction: [stx],
    claimAuctionData: claimAuctionData,
    mintAddrArray: mintAddrArray,
  };
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
  item: OwnNFTDataType
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

  const tx = await createCancelAuctionPnftTx(
    new PublicKey(item.mintAddr),
    payer.publicKey,
    program,
    solConnection
  );
  const { blockhash } = await solConnection.getLatestBlockhash("confirmed");
  tx.feePayer = payer.publicKey;
  tx.recentBlockhash = blockhash;
  let stx = (await payer.signTransaction(tx)).serialize();
  const delistData: any[] = [];
  delistData.push({
    tokenId: item.tokenId,
    imgUrl: item.imgUrl,
    mintAddr: item.mintAddr,
    collectionAddr: item.collectionAddr,
    seller: item.seller,
    solPrice: item.solPrice,
    buyer: "",
    txType: 1,
  });

  return { transaction: stx, delistData: delistData };
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
