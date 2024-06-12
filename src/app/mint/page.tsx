"use client";
/* eslint-disable @next/next/no-img-element */
import { useContext, useEffect, useMemo, useState } from "react";
import type { NextPage } from "next";
import Image from "next/image";
import { useWallet } from "@solana/wallet-adapter-react";
import "@solana/wallet-adapter-react-ui/styles.css";

import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  generateSigner,
  Option,
  PublicKey,
  publicKey,
  SolAmount,
  some,
  transactionBuilder,
  unwrapSome,
} from "@metaplex-foundation/umi";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { setComputeUnitLimit } from "@metaplex-foundation/mpl-toolbox";
import {
  burnV1,
  findMetadataPda,
  mplTokenMetadata,
  TokenStandard,
} from "@metaplex-foundation/mpl-token-metadata";
import {
  mplCandyMachine,
  fetchCandyMachine,
  mintV2,
  safeFetchCandyGuard,
  DefaultGuardSetMintArgs,
  DefaultGuardSet,
  SolPayment,
  CandyMachine,
  CandyGuard,
} from "@metaplex-foundation/mpl-candy-machine";
import { errorAlert, successAlert } from "@/components/ToastGroup";
import MainPageLayout from "@/components/Layout";
import RedeemModal from "@/components/Modal/RedeemModal";

import { ModalContext } from "@/contexts/ModalContext";
import { NFTDataContext } from "@/contexts/NFTDataContext";

import { redeemAPI } from "@/utils/api";

import { CANDYMACHINE_ID, COLLECTION_MINT, SOLANA_RPC } from "@/config";

const Home: NextPage = () => {
  const wallet = useWallet();
  const { connected, publicKey: pubkey } = useWallet();
  const { openRedeemModal } = useContext(ModalContext);
  const { ownNFTs, getOwnNFTs } = useContext(NFTDataContext);

  const memorizedOwnNFTs = useMemo(() => ownNFTs, [ownNFTs]);

  const umi = createUmi(SOLANA_RPC);
  umi
    .use(mplTokenMetadata())
    .use(mplCandyMachine())
    .use(walletAdapterIdentity(wallet));

  const [mintLoading, setMintLoading] = useState(false);
  const [redeemLoading, setRedeemLoading] = useState(false);
  const [mintCreated, setMintCreated] = useState<PublicKey | null>(null);
  const [costInSol, setCostInSol] = useState<number>(0);
  const [cmv3v2, setCandyMachine] = useState<CandyMachine | undefined>();
  const [defaultCandyGuardSet, setDefaultCandyGuardSet] =
    useState<CandyGuard<DefaultGuardSet>>();
  const [countTotal, setCountTotal] = useState<number>(0);
  const [countRemaining, setCountRemaining] = useState<number>(0);
  const [countMinted, setCountMinted] = useState<number>(0);
  const [mintDisabled, setMintDisabled] = useState<boolean>(true);
  const [dotCount, setDotCount] = useState(1);
  const maxDots = 3; // Number of dots to show

  // retrieve item counts to determine availability and from the solPayment, display cost on the Mint button
  const retrieveAvailability = async () => {
    const cmId = CANDYMACHINE_ID;
    if (!cmId) {
      return;
    }
    const candyMachine = await fetchCandyMachine(
      umi,
      publicKey(CANDYMACHINE_ID)
    );
    setCandyMachine(candyMachine);

    // Get counts
    setCountTotal(candyMachine.itemsLoaded);
    setCountMinted(Number(candyMachine.itemsRedeemed));

    const remaining =
      candyMachine.itemsLoaded - Number(candyMachine.itemsRedeemed);
    setCountRemaining(remaining);

    // Get cost
    const candyGuard = await safeFetchCandyGuard(
      umi,
      candyMachine.mintAuthority
    );
    if (candyGuard) {
      setDefaultCandyGuardSet(candyGuard);
    }
    const defaultGuards: DefaultGuardSet | undefined = candyGuard?.guards;
    const solPaymentGuard: Option<SolPayment> | undefined =
      defaultGuards?.solPayment;

    if (solPaymentGuard) {
      const solPayment: SolPayment | null = unwrapSome(solPaymentGuard);
      if (solPayment) {
        const lamports: SolAmount = solPayment.lamports;
        const solCost = Number(lamports.basisPoints) / 1000000000;
        setCostInSol(solCost);
      }
    }

    if (remaining > 0) {
      setMintDisabled(false);
    }
  };

  useEffect(() => {
    retrieveAvailability();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mintCreated]);

  //Loading dot function
  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount((prevDotCount) => (prevDotCount + 1) % (maxDots + 1));
    }, 200); // Change the duration here (500ms = 0.5s)

    return () => clearInterval(interval);
  }, []);

  const handleMintFunc = async () => {
    if (!cmv3v2 || !defaultCandyGuardSet) {
      return;
    }
    if (!connected) {
      return errorAlert("Please connect wallet!");
    }
    setMintLoading(true);

    try {
      const candyMachine = cmv3v2;
      const candyGuard = defaultCandyGuardSet;
      const nftSigner = generateSigner(umi);
      const mintArgs: Partial<DefaultGuardSetMintArgs> = {};

      // solPayment has mintArgs
      const defaultGuards: DefaultGuardSet | undefined = candyGuard?.guards;
      const solPaymentGuard: Option<SolPayment> | undefined =
        defaultGuards?.solPayment;
      if (solPaymentGuard) {
        const solPayment: SolPayment | null = unwrapSome(solPaymentGuard);
        if (solPayment) {
          const treasury = solPayment.destination;

          mintArgs.solPayment = some({
            destination: treasury,
          });
        }
      }

      const tx = transactionBuilder()
        .add(setComputeUnitLimit(umi, { units: 600_000 }))
        .add(
          mintV2(umi, {
            candyMachine: candyMachine.publicKey,
            nftMint: nftSigner,
            collectionMint: candyMachine.collectionMint,
            collectionUpdateAuthority: candyMachine.authority,
            group: some("OGs"),
            candyGuard: candyGuard.publicKey,
            tokenStandard: TokenStandard.ProgrammableNonFungible,
            mintArgs: {
              solPayment: some({
                destination: publicKey(
                  "DYwWmoK74TbHGZZjbM7jH3RZW61siUTvJaBrsyeu4mVx"
                ),
              }),
            },
          })
        );

      await tx.sendAndConfirm(umi, {
        confirm: { commitment: "finalized" },
        send: {
          skipPreflight: true,
        },
      });
      await getOwnNFTs();
      successAlert("Minted Successfully!");
      setMintCreated(nftSigner.publicKey);
    } catch (err: any) {
      errorAlert("Something Went Wrong!");
      console.error(err);
    } finally {
      setMintLoading(false);
    }
  };

  const handleRedeemFunc = async (email: string, homeAddr: string) => {
    try {
      // Setup collection metadata and umi instance with required plugins
      const collectionMetadata = findMetadataPda(umi, {
        mint: publicKey(COLLECTION_MINT),
      });
      umi
        .use(mplTokenMetadata())
        .use(mplCandyMachine())
        .use(walletAdapterIdentity(wallet));

      // Select a random NFT from the user's collection
      const randomIndex = Math.floor(Math.random() * memorizedOwnNFTs.length);
      const mint = publicKey(memorizedOwnNFTs[randomIndex].mintAddr);

      setRedeemLoading(true);

      // Build the transaction
      const builder = transactionBuilder().add(
        burnV1(umi, {
          mint: mint,
          tokenOwner: umi.identity.publicKey,
          collectionMetadata,
          tokenStandard: TokenStandard.ProgrammableNonFungible,
        })
      );

      // Build, sign, and serialize the transaction
      const signedTransaction = await builder.buildAndSign(umi);
      const serialized = umi.transactions.serialize(signedTransaction);

      if (!serialized) {
        throw new Error("Failed to serialize transaction");
      }

      // Call the redeem API
      const result = await redeemAPI(
        serialized,
        memorizedOwnNFTs[0].mintAddr,
        wallet.publicKey?.toBase58()!,
        email,
        homeAddr
      );

      if (result.success) {
        await getOwnNFTs();
        successAlert("Redeemed Successfully!");
      } else {
        errorAlert("Something went wrong!");
      }
    } catch (error) {
      console.error("Error in handleRedeemFunc:", error);
      errorAlert("Something went wrong!");
    } finally {
      setRedeemLoading(false);
    }
  };

  return (
    <MainPageLayout>
      <div className="w-full flex items-center justify-center px-5 duration-300">
        <div className="flex items-center justify-center sm:w-[400px] w-full flex-col gap-3 my-10">
          <div className="rounded-lg p-4 flex items-center justify-center flex-col gap-2 bg-darkgreen border border-customborder relative w-full">
            <h1 className="text-white text-2xl font-bold uppercase">
              Mugs Edition
            </h1>
            <div className="sm:w-[350px] w-[300px] h-[440px] relative hover:translate-y-1 duration-300">
              <Image
                src="/images/mugs.png"
                fill
                alt=""
                className="rounded-lg object-cover"
                priority
              />
            </div>
            <div className="w-full flex items-center justify-start gap-2 flex-col">
              <h1 className="text-white font-bold text-xl uppercase">
                price : {process.env.NEXT_PUBLIC_MINT_PRICE} SOL
              </h1>
              <span className="text-gray-400 text-sm font-semibold">
                {countRemaining}/{countTotal} Available
              </span>
            </div>
          </div>
          <div className="w-full rounded-lg bg-darkgreen border border-customborder p-2 flex items-center justify-center">
            <span className="text-gray-200 text-[12px] font-normal text-center">
              Buy and sell real products with digital currency. Delivered on
              demand.
            </span>
          </div>
          <div className="w-full grid grid-cols-2 gap-3">
            <button
              className="w-full p-2 bg-yellow-600 text-white rounded-lg text-sm font-bold hover:bg-yellow-600 duration-300"
              onClick={() => !mintDisabled && handleMintFunc()}
            >
              Mint
            </button>
            <button
              className={`w-full p-2  rounded-lg text-sm font-bold duration-300
              ${
                connected && memorizedOwnNFTs.length !== 0
                  ? "cursor-pointer hover:bg-transparent bg-transparent text-white hover:border-white"
                  : "cursor-not-allowed bg-transparent text-gray-600"
              } border border-customborder`}
              onClick={() =>
                connected && ownNFTs.length !== 0 && openRedeemModal()
              }
            >
              Redeem
            </button>
          </div>
        </div>
      </div>
      <RedeemModal
        handleRedeemFunc={(email, homeAddr) =>
          handleRedeemFunc(email, homeAddr)
        }
      />

      <div
        className={`fixed top-0 bottom-0 left-0 right-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center ${
          !mintLoading && !redeemLoading && "hidden"
        }`}
      >
        <span className="text-white text-center text-3xl font-bold uppercase">
          {mintLoading && `Minting`}
          {redeemLoading && `Burning`}
          <br />
          {"." + ".".repeat(dotCount)}
        </span>
      </div>
    </MainPageLayout>
  );
};

export default Home;
