/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import { FC, Suspense, useContext, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnchorWallet, useAnchorWallet } from "@solana/wallet-adapter-react";
import Modal from "react-responsive-modal";

import { BiDetail } from "react-icons/bi";
import { CgClose } from "react-icons/cg";
import { MdOutlineSecurity } from "react-icons/md";
import { GoLinkExternal } from "react-icons/go";

import { ModalTabMenu } from "@/data/tabMenuData";

import { errorAlert, successAlert } from "../ToastGroup";

import ActivityTable from "../ActivityTable";

import { ModalContext } from "@/contexts/ModalContext";
import { LoadingContext } from "@/contexts/LoadingContext";
import { NFTDataContext } from "@/contexts/NFTDataContext";

import {
  ActivityDataType,
  ButtonProps,
  OfferDataType,
  OwnNFTDataType,
} from "@/types/types";
import {
  acceptOfferPNft,
  cancelOffer,
  listPNftForSale,
  makeOffer,
  pNftDelist,
  purchasePNft,
  setPrice,
} from "@/utils/contractScript";

import {
  acceptOfferPNftApi,
  cancelOfferApi,
  delistNftApi,
  getAllActivitiesByMintAddrApi,
  getAllOffersByMintAddrApi,
  listNftApi,
  makeOfferApi,
  purchaseNFT,
  updatePriceApi,
} from "@/utils/api";
import OfferTable from "../OfferTable";
import { SolanaIcon } from "../SvgIcons";
import { CollectionContext } from "@/contexts/CollectionContext";
import { OfferData } from "@/utils/libs/types";

const NFTDetailModal = () => {
  const wallet = useAnchorWallet();
  const route = useRouter();
  const param = useSearchParams();
  const pathName = usePathname();
  const currentRouter = pathName.split("/")[1];
  const {
    myBalance,
    ownNFTs,
    ownListedNFTs,
    listedAllNFTs,
    getAllListedNFTs,
    getOwnNFTs,
    getAllListedNFTsBySeller,
  } = useContext(NFTDataContext);
  const { openFunctionLoading, closeFunctionLoading } =
    useContext(LoadingContext);

  const { getAllCollectionData } = useContext(CollectionContext);

  const { closeNFTDetailModal, nftDetailModalShow, selectedNFTDetail } =
    useContext(ModalContext);

  const [updatedPrice, setUpdatedPrice] = useState(0);
  const [showState, setShowState] = useState(0);
  const [selectedNFT, setSelectedNFT] = useState<OwnNFTDataType | undefined>(
    undefined
  );
  const [offerData, setOfferData] = useState<OfferDataType[]>([]);
  const [activityData, setActivityData] = useState<ActivityDataType[]>([]);

  const showQuery = useMemo(
    () => param.getAll("item") || ["unlisted"],
    [param]
  );
  const memoSelectedNFTDetail = useMemo(
    () => selectedNFTDetail,
    [selectedNFTDetail]
  );

  const getOfferByMintAddr = async () => {
    try {
      const data = await getAllOffersByMintAddrApi(memoSelectedNFTDetail[0]);

      if (data.length === 0) {
        setOfferData([]);
        return;
      }

      const filteredData = data.map(
        ({
          mintAddr,
          offerPrice,
          tokenId,
          imgUrl,
          seller,
          buyer,
          active,
        }: OfferDataType) => ({
          mintAddr,
          offerPrice,
          tokenId,
          imgUrl,
          seller,
          buyer,
          active,
        })
      );

      setOfferData(filteredData);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const getActivityByMintAddr = async () => {
    try {
      const data = await getAllActivitiesByMintAddrApi(
        memoSelectedNFTDetail[0]
      );
      setActivityData(data);
      // You can now use the fetched data (e.g., set it in a state)
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (memoSelectedNFTDetail[0]) {
        try {
          await getOfferByMintAddr();
          await getActivityByMintAddr();
        } catch (error) {
          console.error("Error fetching data: ", error);
        }
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memoSelectedNFTDetail]);

  useEffect(() => {
    let data;

    if (currentRouter === "me") {
      data =
        showQuery[0] === "listed"
          ? ownListedNFTs.filter(
              (item) => item.mintAddr === memoSelectedNFTDetail[0]
            )
          : ownNFTs.filter(
              (item) => item.mintAddr === memoSelectedNFTDetail[0]
            );
    } else {
      data = listedAllNFTs.filter(
        (item) => item.mintAddr === memoSelectedNFTDetail[0]
      );
    }

    if (data.length > 0) {
      setSelectedNFT(data[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ownNFTs, memoSelectedNFTDetail, showQuery, ownListedNFTs, currentRouter]);

  // NFT List Function
  const handleListMyNFTFunc = async () => {
    if (!wallet || selectedNFT === undefined) {
      return;
    }
    const currentPrice = selectedNFT.solPrice;

    if (updatedPrice === 0) {
      errorAlert("Please enter the price.");
      return;
    }

    try {
      openFunctionLoading();

      // Update the itemDetail price
      selectedNFT.solPrice = updatedPrice;

      // List the NFT for sale
      const tx = await listPNftForSale(wallet, [selectedNFT]);

      if (tx) {
        const result = await listNftApi(tx.transactions, tx.listData);

        if (result.type === "success") {
          // Refresh data after successful listing
          await Promise.all([
            getOwnNFTs(),
            getAllListedNFTsBySeller(),
            getActivityByMintAddr(),
            getAllListedNFTs(),
            getAllCollectionData(),
          ]);
          closeNFTDetailModal();
          successAlert("Success");
        } else {
          selectedNFT.solPrice = currentPrice;
          errorAlert("Something went wrong.");
        }
      } else {
        selectedNFT.solPrice = currentPrice;
        errorAlert("Something went wrong.");
      }
    } catch (e) {
      selectedNFT.solPrice = currentPrice;
      console.error("Error:", e);
      errorAlert("Something went wrong.");
    } finally {
      closeFunctionLoading();
    }
  };

  // NFT Delist Function
  const handleDelistMyNFTFunc = async () => {
    if (!wallet || selectedNFT === undefined) {
      return;
    }

    try {
      openFunctionLoading();

      // Delist the NFT
      const tx = await pNftDelist(wallet, [selectedNFT]);

      if (tx) {
        const result = await delistNftApi(
          tx.transactions,
          tx.delistData,
          tx.mintAddrArray
        );

        if (result.type === "success") {
          // Refresh data after successful delist
          await Promise.all([
            getOwnNFTs(),
            getAllListedNFTsBySeller(),
            getActivityByMintAddr(),
            getAllListedNFTs(),
            getAllCollectionData(),
          ]);
          closeNFTDetailModal();
          successAlert("Success");
        } else {
          errorAlert("Something went wrong.");
        }
      } else {
        errorAlert("Something went wrong.");
      }
    } catch (e) {
      console.error("Error:", e);
      errorAlert("Something went wrong.");
    } finally {
      closeFunctionLoading();
    }
  };

  // Listed NFT Price Update Function
  const handleUpdatePriceFunc = async () => {
    if (!wallet || selectedNFT === undefined) {
      return;
    }

    const currentPrice = selectedNFT.solPrice;

    if (updatedPrice === 0) {
      errorAlert("Please enter the value.");
      return;
    }

    try {
      openFunctionLoading();

      // Update the itemDetail price
      selectedNFT.solPrice = updatedPrice;

      // Set the new price
      const tx = await setPrice(wallet, selectedNFT);

      if (tx) {
        const result = await updatePriceApi(
          tx.transactions,
          tx.updatedPriceItems,
          tx.updatedPriceItems.mintAddr
        );

        if (result.type === "success") {
          // Refresh data after successful price update
          await Promise.all([
            getOwnNFTs(),
            getAllListedNFTsBySeller(),
            getActivityByMintAddr(),
            getAllListedNFTs(),
            getAllCollectionData(),
          ]);
          closeNFTDetailModal(), successAlert("Success");
        } else {
          selectedNFT.solPrice = currentPrice;
          errorAlert("Something went wrong.");
        }
      } else {
        selectedNFT.solPrice = currentPrice;
        errorAlert("Something went wrong.");
      }
    } catch (e) {
      selectedNFT.solPrice = currentPrice;
      console.error("Error:", e);
      errorAlert("Something went wrong.");
    } finally {
      closeFunctionLoading();
    }
  };

  const handleMakeOffer = async () => {
    if (wallet && selectedNFT !== undefined) {
      if (updatedPrice <= selectedNFT.solPrice / 2) {
        errorAlert("Offer price must be bigger than the listed price.");
      } else {
        if (myBalance < updatedPrice) {
          errorAlert("You don't have enough sol");
        } else {
          const currentPrice = selectedNFT.solPrice;
          try {
            openFunctionLoading();
            selectedNFT.solPrice = updatedPrice;
            const tx = await makeOffer(wallet, [selectedNFT]);
            if (tx) {
              const result = await makeOfferApi(tx.transaction, tx.offerData);
              if (result.type === "success") {
                await Promise.all([
                  getOwnNFTs(),
                  getAllListedNFTsBySeller(),
                  getActivityByMintAddr(),
                  getAllListedNFTs(),
                  getAllCollectionData(),
                ]);
                closeFunctionLoading();
                closeNFTDetailModal();
                successAlert("Success");
              } else {
                selectedNFT.solPrice = currentPrice;
                closeNFTDetailModal();
                closeFunctionLoading();
                errorAlert("Something went wrong.");
              }
            } else {
              selectedNFT.solPrice = currentPrice;
              closeFunctionLoading();
              errorAlert("Something went wrong.");
            }
          } catch (e) {
            console.log("err =>", e);
            selectedNFT.solPrice = currentPrice;
            errorAlert("Something went wrong.");
            closeFunctionLoading();
          }
        }
      }
    }
  };

  // Buy NFT Function
  const handleBuyNFTFunc = async () => {
    if (wallet && selectedNFT !== undefined) {
      if (myBalance < selectedNFT.solPrice) {
        errorAlert("You don't have enough sol.");
      } else {
        try {
          openFunctionLoading();
          const tx = await purchasePNft(wallet, [selectedNFT]);
          if (tx) {
            const result = await purchaseNFT(
              tx.transactions,
              tx.purchaseData,
              tx.mintAddrArray
            );
            if (result.type === "success") {
              await Promise.all([
                getOwnNFTs(),
                getAllListedNFTsBySeller(),
                getActivityByMintAddr(),
                getAllListedNFTs(),
                getAllCollectionData(),
              ]);
              closeFunctionLoading();
              closeNFTDetailModal();
              successAlert("Success");
              route.push("/me");
            } else {
              closeFunctionLoading();
              errorAlert("Something went wrong.");
            }
          } else {
            closeFunctionLoading();
            errorAlert("Something went wrong.");
          }
        } catch (e) {
          console.log("err =>", e);
          errorAlert("Something went wrong.");
          closeFunctionLoading();
        }
      }
    }
  };

  const handleCancelOffer = async (mintAddr: string) => {
    if (wallet && mintAddr !== undefined) {
      try {
        const filterOfferData = offerData.filter(
          (data) => data.mintAddr === mintAddr
        );
        openFunctionLoading();
        const tx = await cancelOffer(wallet, filterOfferData);
        if (tx) {
          const result = await cancelOfferApi(
            tx.mintAddr,
            tx.offerData,
            tx.transaction
          );
          if (result.type === "success") {
            await Promise.all([
              getOwnNFTs(),
              getAllListedNFTsBySeller(),
              getActivityByMintAddr(),
              getAllListedNFTs(),
              getAllCollectionData(),
              await getOfferByMintAddr(),
            ]);
            closeFunctionLoading();
            closeNFTDetailModal();
            successAlert("Success");
          } else {
            closeFunctionLoading();
            errorAlert("Something went wrong.");
          }
        } else {
          closeFunctionLoading();
          errorAlert("Something went wrong.");
        }
      } catch (e) {
        console.log("err =>", e);
        closeFunctionLoading();
        errorAlert("Something went wrong.");
      }
    }
  };

  const handleAcceptHighOffer = async () => {
    if (wallet && offerData.length !== 0) {
      const highestOfferData = offerData.reduce((max, data) => {
        // Only consider entries with a valid offerPrice (non-null and non-zero)
        if (
          data.offerPrice != null &&
          data.offerPrice > (max.offerPrice || 0) &&
          data.active == 1
        ) {
          return data;
        } else {
          return data;
        }
      }); // Initial max with an offerPrice of 0

      try {
        openFunctionLoading();
        const tx = await acceptOfferPNft(wallet, highestOfferData);
        if (tx) {
          const result = await acceptOfferPNftApi(
            tx.mintAddr,
            tx.offerData,
            tx.transaction
          );
          if (result.type === "success") {
            await Promise.all([
              getOwnNFTs(),
              getAllListedNFTsBySeller(),
              getActivityByMintAddr(),
              getAllListedNFTs(),
              getAllCollectionData(),
            ]);
            closeFunctionLoading();
            closeNFTDetailModal();
            successAlert("Success");
            route.push("/me");
          } else {
            closeFunctionLoading();
            errorAlert("Something went wrong.");
          }
        } else {
          closeFunctionLoading();
          errorAlert("Something went wrong.");
        }
      } catch (e) {
        console.log("err =>", e);
        closeFunctionLoading();
        errorAlert("Something went wrong.");
      }
    }
  };

  return (
    <Suspense>
      <Modal open={nftDetailModalShow} onClose={closeNFTDetailModal} center>
        <div
          className={`xl:min-w-[1200px] lg:min-w-[950px] md:min-w-[680px] w-full max-w-[320px] sm:min-w-[500px] relative`}
        >
          <div className="absolute top-0 right-0 cursor-pointer flex items-center justify-center gap-3">
            <div
              className="cursor-pointer outline-none"
              onClick={closeNFTDetailModal}
            >
              <Link href={`/item-details/${memoSelectedNFTDetail[0]}`}>
                <GoLinkExternal color="#CA8A04" size={22} />
              </Link>
            </div>
            <div className="cursor-pointer" onClick={closeNFTDetailModal}>
              <CgClose color="white" size={23} />
            </div>
          </div>

          <div className="top-10 z-[9999] w-[290px] py-2">
            <h1 className="text-2xl text-white py-1">
              {selectedNFT?.collectionName} #{selectedNFT?.tokenId}
            </h1>
            <div className="border border-customborder rounded-md flex w-full">
              {ModalTabMenu.map((item, index) => (
                <div
                  className={`px-2 cursor-pointer ${
                    showState === index && "bg-yellow-600"
                  } rounded-md w-[100px] text-white text-center text-[12px] py-1`}
                  onClick={() => setShowState(index)}
                  key={index}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="w-full flex items-start justify-start max-h-[70vh] overflow-y-auto md:min-h-[70vh] min-h-[70vh] relative">
            <div
              className={`w-full grid md:grid-cols-2 grid-cols-1 gap-5 lg:gap-10 pr-2 ${
                showState !== 0 && "hidden"
              }`}
            >
              <div className="lg:w-full relative aspect-square cursor-pointer">
                <img
                  src={selectedNFT?.imgUrl!}
                  className="rounded-lg object-cover w-full h-full"
                  alt=""
                />
              </div>
              <div className="w-full flex flex-col justify-start items-start gap-2">
                <div className="flex flex-col gap-1">
                  <h1 className="text-white text-2xl">
                    {" "}
                    {selectedNFT?.collectionName}
                  </h1>
                  <p className="text-yellow-500 texl-md">
                    {" "}
                    {selectedNFT?.collectionName} #{selectedNFT?.tokenId}
                  </p>
                </div>
                <div className="w-full flex items-start justify-start gap-1 rounded-md bg-transparant border border-customborder flex-col p-3">
                  {/* <div className="w-full flex items-center justify-between">
                  <p className="text-sm text-gray-300">List Price</p>
                  <span className="text-md text-white">5.614 Sol</span>
                </div>
                <div className="w-full flex items-center justify-between">
                  <p className="text-sm text-gray-300">Taker Price</p>
                  <span className="text-md text-white">5.614 Sol</span>
                </div>
                <div className="w-full flex items-center justify-between">
                  <p className="text-sm text-gray-300">Royalty Price</p>
                  <span className="text-md text-white">5.614 Sol</span>
                </div>
                <div className="w-full flex items-center justify-between">
                  <p className="text-2xl text-gray-300">Total Price</p>
                  <span className="text-2xl text-white">5.614 Sol</span>
                </div> */}
                  <p
                    className={`text-left text-white text-xl ${
                      selectedNFT?.solPrice === 0 && "hidden"
                    }`}
                  >
                    Listed Price : {selectedNFT?.solPrice}
                    {" sol"}
                  </p>
                  <div className="w-full flex items-center justify-between gap-2">
                    <input
                      className="w-full p-[6px] flex items-center placeholder:text-gray-500 outline-none text-white justify-between rounded-md border border-customborder bg-transparent"
                      placeholder="Input the price"
                      type="number"
                      onChange={(e) => {
                        setUpdatedPrice(Number(e.target.value));
                      }}
                    />
                    <UpdatePriceButton
                      wallet={wallet}
                      selectedNFT={selectedNFT}
                      offerData={offerData}
                      handleUpdatePriceFunc={handleUpdatePriceFunc}
                    />
                    <MakeOrCancelOfferButton
                      wallet={wallet}
                      selectedNFT={selectedNFT}
                      offerData={offerData}
                      handleMakeOffer={handleMakeOffer}
                      handleCancelOffer={handleCancelOffer}
                    />
                    <AcceptHighOfferButton
                      wallet={wallet}
                      selectedNFT={selectedNFT}
                      offerData={offerData}
                      handleAcceptHighOffer={handleAcceptHighOffer}
                    />
                  </div>
                  <ListOrDelistButton
                    wallet={wallet}
                    selectedNFT={selectedNFT}
                    handleListMyNFTFunc={handleListMyNFTFunc}
                    handleDelistMyNFTFunc={handleDelistMyNFTFunc}
                  />
                  <BuyNowButton
                    wallet={wallet}
                    selectedNFT={selectedNFT}
                    handleBuyNFTFunc={handleBuyNFTFunc}
                  />
                </div>

                <div className="w-full p-3 flex items-center justify-between rounded-md border-b border-customborder">
                  <span className="text-white font-bold text-md flex items-center justify-center gap-2">
                    <MdOutlineSecurity color="#EAB308" size={18} />
                    Attributes
                  </span>
                </div>
                <div
                  className={`w-full py-3 grid grid-cols-3 gap-3 rounded-md`}
                >
                  {selectedNFT &&
                    selectedNFT.attribute.map((detail, index) => (
                      <div
                        className="rounded-md bg-darkgreen border border-customborder p-2"
                        key={index}
                      >
                        <p className="text-gray-400 text-sm">
                          {detail.trait_type}
                        </p>
                        <span className="text-white md:text-sm lg:text-md text-[12px]">
                          {detail.value}
                        </span>
                      </div>
                    ))}
                </div>

                <div className="w-full p-3 flex items-center justify-between rounded-md border-b border-customborder">
                  <span className="text-white font-bold text-md flex items-center justify-center gap-2">
                    <BiDetail color="#EAB308" size={19} />
                    Detail
                  </span>
                </div>
                <div
                  className={`w-full py-3 flex items-center justify-between flex-col gap-1 rounded-md text-gray-400`}
                >
                  <div className="w-full flex items-center justify-between">
                    <span>Mint Address</span>
                    <a
                      href={`https://explorer.solana.com/address/${selectedNFT?.mintAddr}?cluster=devnet`}
                      target="_blank"
                      rel="referrer"
                    >
                      <span className="text-white flex items-center justify-center text-sm gap-1 duration-200 hover:text-gray-300">
                        <SolanaIcon />
                        {selectedNFT &&
                          selectedNFT.mintAddr.slice(0, 4) +
                            " ... " +
                            selectedNFT.mintAddr.slice(-4)}
                      </span>
                    </a>
                  </div>
                  <div className="w-full flex items-center justify-between">
                    <span>OnChain Collection</span>
                    <a
                      href={`https://explorer.solana.com/address/${selectedNFT?.collectionAddr}?cluster=devnet`}
                      target="_blank"
                      rel="referrer"
                    >
                      <span className="text-white flex items-center justify-center text-sm gap-1 duration-200 hover:text-gray-300">
                        <SolanaIcon />{" "}
                        {selectedNFT &&
                          selectedNFT.collectionAddr.slice(0, 4) +
                            " ... " +
                            selectedNFT.collectionAddr.slice(-4)}
                      </span>
                    </a>
                  </div>
                  <div className="w-full flex items-center justify-between">
                    <span>Owner</span>
                    <a
                      href={`https://explorer.solana.com/address/${selectedNFT?.seller}?cluster=devnet`}
                      target="_blank"
                      rel="referrer"
                    >
                      <span className="text-white flex items-center justify-center text-sm gap-1 duration-200 hover:text-gray-300">
                        <SolanaIcon />{" "}
                        {selectedNFT &&
                          selectedNFT.seller.slice(0, 4) +
                            " ... " +
                            selectedNFT.seller.slice(-4)}
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div
              className={`w-full flex items-start justify-start gap-2 flex-col ${
                showState !== 1 && "hidden"
              }`}
            >
              <ActivityTable data={activityData} />
            </div>
            <div
              className={`w-full flex items-start justify-start gap-2 flex-col ${
                showState !== 2 && "hidden"
              }`}
            >
              <OfferTable
                data={offerData}
                handleCancelOffer={(mintAddr: string) =>
                  handleCancelOffer(mintAddr)
                }
              />
            </div>
          </div>
        </div>
      </Modal>
    </Suspense>
  );
};

const UpdatePriceButton: React.FC<ButtonProps> = ({
  wallet,
  selectedNFT,
  offerData,
  handleUpdatePriceFunc,
}) => {
  const isHidden =
    wallet?.publicKey.toBase58() !== selectedNFT?.seller ||
    selectedNFT?.solPrice === 0 ||
    offerData?.filter((data) => Number(data.active) !== 0).length !== 0;

  return (
    <div
      className={`w-full rounded-md py-[6px] text-center bg-red-600 duration-200 hover:bg-red-700 text-white cursor-pointer flex items-center gap-2 justify-center ${
        isHidden && "hidden"
      }`}
      onClick={handleUpdatePriceFunc}
    >
      {"Update Price"}
    </div>
  );
};

const MakeOrCancelOfferButton: React.FC<ButtonProps> = ({
  wallet,
  selectedNFT,
  offerData,
  handleMakeOffer,
  handleCancelOffer,
}) => {
  const isHidden =
    wallet?.publicKey.toBase58() === selectedNFT?.seller ||
    selectedNFT?.solPrice === 0;
  const isActiveOffer =
    offerData?.filter(
      (data) =>
        data.buyer == wallet?.publicKey.toBase58() && Number(data.active) === 1
    ).length !== 0;

  return (
    <div
      className={`w-full rounded-md py-[6px] text-center bg-red-600 duration-200 hover:bg-red-700 text-white cursor-pointer flex items-center gap-2 justify-center ${
        isHidden && "hidden"
      }`}
      onClick={
        isActiveOffer
          ? () => {
              if (selectedNFT?.mintAddr && handleCancelOffer) {
                handleCancelOffer(selectedNFT.mintAddr.toString());
              }
            }
          : handleMakeOffer
      }
    >
      {isActiveOffer ? "Cancel Offer" : "Make Offer"}
    </div>
  );
};

const AcceptHighOfferButton: React.FC<ButtonProps> = ({
  wallet,
  selectedNFT,
  offerData,
  handleAcceptHighOffer,
}) => {
  const isHidden =
    offerData?.filter((data) => Number(data.active) !== 0).length === 0 ||
    wallet?.publicKey.toBase58() !== selectedNFT?.seller;

  return (
    <div
      className={`w-full rounded-md py-[6px] text-center bg-yellow-600 duration-200 hover:bg-yellow-700 text-white cursor-pointer ${
        isHidden && "hidden"
      }`}
      onClick={handleAcceptHighOffer}
    >
      {"Accept High Offer"}
    </div>
  );
};

const ListOrDelistButton: React.FC<ButtonProps> = ({
  wallet,
  selectedNFT,
  handleListMyNFTFunc,
  handleDelistMyNFTFunc,
}) => {
  const isHidden = wallet?.publicKey.toBase58() !== selectedNFT?.seller;

  return (
    <div
      className={`w-full rounded-md py-[6px] text-center bg-yellow-600 duration-200 hover:bg-yellow-700 text-white cursor-pointer ${
        isHidden && "hidden"
      }`}
      onClick={
        selectedNFT?.solPrice === 0
          ? handleListMyNFTFunc
          : handleDelistMyNFTFunc
      }
    >
      {selectedNFT?.solPrice === 0 &&
      wallet?.publicKey.toBase58() === selectedNFT.seller
        ? "List Now"
        : "Delist now"}
    </div>
  );
};

const BuyNowButton: React.FC<ButtonProps> = ({
  wallet,
  selectedNFT,
  handleBuyNFTFunc,
}) => {
  const isHidden = wallet?.publicKey.toBase58() === selectedNFT?.seller;

  return (
    <div
      className={`w-full rounded-md py-[6px] text-center bg-yellow-600 duration-200 hover:bg-yellow-700 text-white cursor-pointer ${
        isHidden && "hidden"
      }`}
      onClick={handleBuyNFTFunc}
    >
      {"Buy now"}
    </div>
  );
};

export default function NFTDetail() {
  return (
    <Suspense>
      <NFTDetailModal />
    </Suspense>
  );
}
