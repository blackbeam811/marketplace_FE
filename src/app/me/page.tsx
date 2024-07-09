/* eslint-disable @next/next/no-img-element */
"use client";
import { Suspense, useContext, useEffect, useMemo, useState } from "react";
import { NextPage } from "next";
import { useSearchParams } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";

import { BiSearch } from "react-icons/bi";

import MainPageLayout from "@/components/Layout";
import TabsTip from "@/components/TabsTip";
import CollectionItemSkeleton from "@/components/CollectionItemSkeleton";
import NFTCard from "@/components/NFTCard";
import CollectionFilterSelect from "@/components/CollectionFilterSelect";
import MyItemDetail from "@/components/MyItemDetail";
import ActivityFilterSelect from "@/components/ActivityFilterSelect";
import OfferFilterSelect from "@/components/OfferFilterSelect";
import MobileItemMultiSelectBar from "@/components/ItemMultiSelectBar/MobileItemMultiSelectBar";
import MobileTabsTip from "@/components/TabsTip/MobileTabsTip";
import ItemMultiSelectbar from "@/components/ItemMultiSelectBar";

import { NFTDataContext } from "@/contexts/NFTDataContext";

import {
  collectionFilterOptions,
  myItemFilterOptions,
} from "@/data/selectTabData";
import { ActivityDataType, OfferDataType, OwnNFTDataType } from "@/types/types";
import MobileMyItemDetail from "@/components/MyItemDetail/MobileMyItemDetail";
import { getAllActivitiesByMakerApi } from "@/utils/api";
import ActivityTable from "@/components/ActivityTable";

const MyItem: NextPage = () => {
  const param = useSearchParams();
  const search = param.get("activeTab") || "items";
  const showQuery = useMemo(
    () => param.getAll("item") || ["unlisted"],
    [param]
  );
  const { publicKey, connected } = useWallet();
  const { ownNFTs, getOwnNFTsState, ownListedNFTs } =
    useContext(NFTDataContext);
  const [showNFTs, setShowNFTs] = useState<OwnNFTDataType[]>([]);
  const [nameSearch, setNameSearch] = useState("");
  const [offerData, setOfferData] = useState<OfferDataType[]>([]);
  const [activityData, setActivityData] = useState<ActivityDataType[]>([]);
  const [filteredActivityData, setFilteredActivityData] = useState<
    ActivityDataType[]
  >([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchKeyword, setSearchKeyword] = useState<string>("");

  const options = ["Sale", "List", "Delist"];

  // const getOfferByMintAddr = async () => {
  //   try {
  //     const data = await getAllOffersByMakerApi(publicKey);

  //     if (data.length === 0) {
  //       setOfferData([]);
  //       return;
  //     }

  //     const filteredData = data.map(
  //       ({
  //         mintAddr,
  //         offerPrice,
  //         tokenId,
  //         imgUrl,
  //         seller,
  //         buyer,
  //         active,
  //       }: OfferDataType) => ({
  //         mintAddr,
  //         offerPrice,
  //         tokenId,
  //         imgUrl,
  //         seller,
  //         buyer,
  //         active,
  //       })
  //     );

  //     setOfferData(filteredData);
  //   } catch (error) {
  //     console.error("Error fetching data: ", error);
  //   }
  // };

  const getActivityByMintAddr = async () => {
    try {
      const data = await getAllActivitiesByMakerApi(publicKey?.toBase58()!);
      console.log("activityData => ", data);
      setActivityData(data);
      // You can now use the fetched data (e.g., set it in a state)
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (publicKey) {
        try {
          // await getOfferByMintAddr();
          await getActivityByMintAddr();
        } catch (error) {
          console.error("Error fetching data: ", error);
        }
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicKey]);

  useEffect(() => {
    const updateShowNFTs = () => {
      if (showQuery[0] === "listed") {
        setShowNFTs(ownListedNFTs);
      } else {
        setShowNFTs(ownNFTs);
      }
    };

    updateShowNFTs();
  }, [showQuery, ownNFTs, ownListedNFTs]);

  useEffect(() => {
    const filterNFTs = (nfts: any) =>
      nameSearch === ""
        ? nfts
        : nfts.filter(
            (item: { collectionName: string; tokenId: string }) =>
              item.collectionName.includes(nameSearch) ||
              item.tokenId.includes(nameSearch)
          );

    const nftsToShow = showQuery[0] === "listed" ? ownListedNFTs : ownNFTs;
    setShowNFTs(filterNFTs(nftsToShow));
  }, [nameSearch, showQuery, ownListedNFTs, ownNFTs]);

  // Filter the Activity Table
  const addTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };
  const removeTag = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  };
  useEffect(() => {
    const filtered = activityData.filter((item) => {
      if (selectedTags.length === 0) return true;
      if (selectedTags.includes("List") && item.txType === 0) return true;
      if (selectedTags.includes("Delist") && item.txType === 1) return true;
      if (selectedTags.includes("Sale") && item.txType === 2) return true;
      return false;
    });

    setFilteredActivityData(filtered);
  }, [selectedTags, activityData]);

  return (
    <MainPageLayout>
      <div
        className={`w-full flex items-start justify-start flex-row ${
          !connected && " hidden"
        }`}
      >
        <div className="w-full flex items-start justify-start mt-5 gap-4 flex-col px-2">
          <MyItemDetail />
          <MobileMyItemDetail collectionData={undefined} />
          <TabsTip />
          <div className="w-full flex items-center justify-start flex-col md:flex-row gap-3">
            <div
              className={`flex items-center justify-center gap-2 w-full ${
                (search === "activity" || search === "offers") && "hidden"
              }`}
            >
              {/* <ListNFTFilterSelect /> */}
              <div
                className={`w-full flex items-center justify-start px-2 rounded-md border border-customborder `}
              >
                <BiSearch color="white" />
                <input
                  placeholder="Search items"
                  className="outline-none bg-transparent w-full text-white py-1 px-1 font-thin placeholder:text-gray-600"
                  onChange={(e) => setNameSearch(e.target.value)}
                />
              </div>
            </div>
            <div
              className={`${
                (search === "activity" || search === "offers") && "hidden"
              } flex gap-2`}
            >
              <CollectionFilterSelect
                options={collectionFilterOptions}
                filterType={"price"}
              />
              <CollectionFilterSelect
                options={myItemFilterOptions}
                filterType={"item"}
              />
            </div>

            <div className={`${search !== "offers" && "hidden"} `}>
              <OfferFilterSelect />
            </div>
            <div className={`${search !== "activity" && "hidden"}`}>
              <ActivityFilterSelect
                selectedTags={selectedTags}
                addTag={(tag) => addTag(tag)}
                removeTag={(tag) => removeTag(tag)}
                setSelectedTags={() => setSelectedTags([])}
              />
            </div>
          </div>
          <div
            className={`${
              (search === "activity" || search === "offers") && "hidden"
            } w-full`}
          >
            <ItemMultiSelectbar />
          </div>
          <div className="w-full md:max-h-[70vh] max-h-[50vh] overflow-y-auto pb-10">
            <div
              className={`relative ${
                search === "items" || search === null ? "block" : "hidden"
              }`}
            >
              <CollectionItemSkeleton />
              <div
                className={`w-full grid grid-cols-2 md:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5 ${
                  getOwnNFTsState && "hidden"
                }`}
              >
                {showNFTs?.map((item, index) => (
                  <NFTCard
                    imgUrl={item.imgUrl}
                    collectionName={item.collectionName}
                    tokenId={item.tokenId}
                    key={index}
                    mintAddr={item.mintAddr}
                    solPrice={item.solPrice}
                    state={item.solPrice === 0 ? "unlisted" : "listed"}
                  />
                ))}
              </div>
            </div>
            <div
              className={`w-full flex items-center justify-center ${
                search === "offers" ? "block" : "hidden"
              }`}
            >
              {/* <ActivityTable /> */}
            </div>
            <div
              className={`w-full flex items-center justify-center ${
                search === "activity" ? "block" : "hidden"
              }`}
            >
              <ActivityTable data={filteredActivityData} />
            </div>
          </div>
          {/* <div
            className={`${
              connected && !getOwnNFTsState && showNFTs.length === 0
                ? "flex"
                : "hidden"
            } items-center justify-center min-h-[40vh] w-full`}
          >
            <p className="text-gray-400 text-center">
              Nothing to show
              <br />
              Items you own will appear here in your Portfolio
            </p>
          </div> */}
        </div>
        <MobileItemMultiSelectBar />
        <MobileTabsTip />
      </div>
      <div
        className={`${
          !publicKey ? "flex" : "hidden"
        } items-center justify-center min-h-[80vh] w-full`}
      >
        <p className="text-gray-400 text-center">
          Connect wallet to see your profile page
        </p>
      </div>
    </MainPageLayout>
  );
};

export default function MyItemPage() {
  return (
    <Suspense>
      <MyItem />
    </Suspense>
  );
}
