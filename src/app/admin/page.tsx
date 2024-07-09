/* eslint-disable @next/next/no-img-element */
"use client";
import { NextPage } from "next";
import { useRef, useState } from "react";
import MainPageLayout from "@/components/Layout";
import { UploadIcon } from "@/components/SvgIcons/UploadIcon";
import { NormalSpinner } from "@/components/Spinners";
import { errorAlert, successAlert } from "@/components/ToastGroup";
import { CollectionDataType } from "@/types/types";
import { createCollection } from "@/utils/api";
import { PINATA_APIKEY } from "@/config";

const Admin: NextPage = () => {
  const uploadedAvatarImg = useRef(null);
  const hiddenAvatarInput = useRef(null);

  const [selectedCollectionImg, setSelectedCollectionImg] = useState<any>(null);
  const [collectionAddr, setCollectionAddr] = useState<string>("");
  const [collectionName, setCollectionName] = useState<string>("");
  const [twitterLink, setTwitterLink] = useState<string>("");
  const [discordLink, setDiscordLink] = useState<string>("");
  const [saveLoadingState, setSaveLoadingState] = useState<boolean>(false);

  // Upload the collection image
  const handleAvatarAdd = () => {
    if (hiddenAvatarInput.current) {
      (hiddenAvatarInput.current as HTMLInputElement).click();
    }
  };

  const handleAvatarChange = (event: any): void => {
    const fileUploaded: File = event.target.files[0];
    if (fileUploaded) {
      const reader: FileReader = new FileReader();
      const { current }: any = uploadedAvatarImg;
      current.fileUploaded = fileUploaded;
      setSelectedCollectionImg(fileUploaded);
      reader.onload = (e: ProgressEvent<FileReader>): void => {
        current.src = e.target?.result as string;
      };
      reader.readAsDataURL(fileUploaded);
    }
  };

  // Save collection data to database
  const saveCollectionImage = async () => {
    if (selectedCollectionImg) {
      try {
        // Save the collection image
        const imgData = new FormData();
        imgData.append("file", selectedCollectionImg);
        const imgDataRes = await fetch(
          "https://api.pinata.cloud/pinning/pinFileToIPFS",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${PINATA_APIKEY}`,
            },
            body: imgData,
          }
        );
        const imgResData = await imgDataRes.json();

        // Return the uploaded URLs
        return imgResData.IpfsHash;
      } catch (error) {
        throw error;
      }
    } else {
    }
  };

  const handleSaveCollectionData = async () => {
    console.log("selectedCollectionImg", selectedCollectionImg);
    if (
      selectedCollectionImg === null ||
      collectionAddr === "" ||
      collectionName === ""
    ) {
      errorAlert("Please enter the value correctly.");
    } else {
      setSaveLoadingState(true);
      const collectionImgUrl = await saveCollectionImage();

      const dataToSave: CollectionDataType = {
        imgUrl: collectionImgUrl,
        collectionName: collectionName,
        collectionAddr: collectionAddr,
        twitterLink: twitterLink,
        discordLink: discordLink,
        currentPrice: 0,
        previousPrice: 0,
        volume: 0,
        change: 0,
        sales: 0,
        marketCap: 0,
        totalVolume: 0,
      };

      try {
        const result = await createCollection(dataToSave);
        if (result.type === "success") {
          setSaveLoadingState(false);
          successAlert("Success");
        }
      } catch (error) {
        setSaveLoadingState(false);
        console.log("err ===>", error);
        errorAlert("Something went wrong.");
      }
    }
  };

  return (
    <MainPageLayout>
      <div className="w-[350px] flex items-center justify-center flex-col gap-3 mt-10">
        <h1 className="text-white font-bold text-2xl">Collection Add</h1>
        <div className="relative flex justify-center items-center w-[140px] h-[130px]">
          <img
            ref={uploadedAvatarImg}
            src={"/svgs/initialAvatar.svg"}
            alt="Profile Avatar"
            className="rounded-2xl w-full h-full object-cover"
          />
          <input
            style={{ display: "none" }}
            accept="image/*"
            type="file"
            name="myImage"
            ref={hiddenAvatarInput}
            onChange={handleAvatarChange}
            defaultValue=""
          />
          <div
            className="right-1 bottom-1 absolute flex justify-center items-center bg-[#16161695] p-1 rounded-xl w-[32px] h-[32px] cursor-pointer"
            onClick={() => handleAvatarAdd()}
          >
            <UploadIcon width={25} height={25} />
          </div>
        </div>
        <div className="w-full flex flex-col gap-1">
          <span className="text-sm text-gray-300">Collection Name</span>
          <input
            className="text-white outline-none placeholder:text-[#ffffff17] border border-customborder py-1 px-2 w-full bg-transparent rounded-md"
            placeholder="Mymine"
            onChange={(e) => setCollectionName(e.target.value)}
          />
        </div>
        <div className="w-full flex flex-col gap-1">
          <span className="text-sm text-gray-300">Collection Address</span>
          <input
            className="text-white outline-none placeholder:text-[rgba(255,255,255,0.09)] border border-customborder py-1 px-2 w-full bg-transparent rounded-md"
            placeholder="328D...pG72"
            onChange={(e) => setCollectionAddr(e.target.value)}
          />
        </div>
        <div className="w-full flex flex-col gap-1">
          <span className="text-sm text-gray-300">Twitter Link</span>
          <input
            className="text-white outline-none placeholder:text-[#ffffff17] border border-customborder py-1 px-2 w-full bg-transparent rounded-md"
            placeholder="https://x.com/..."
            onChange={(e) => setTwitterLink(e.target.value)}
          />
        </div>
        <div className="w-full flex flex-col gap-1">
          <span className="text-sm text-gray-300">Discord Link</span>
          <input
            className="text-white outline-none placeholder:text-[#ffffff17] border border-customborder py-1 px-2 w-full bg-transparent rounded-md"
            placeholder="https://discord.com/"
            onChange={(e) => setDiscordLink(e.target.value)}
          />
        </div>
        <button
          className={`w-full text-sm flex items-center justify-center text-white rounded-md bg-yellow-600 py-2 mt-5 ${
            !saveLoadingState && "hover:bg-yellow-500 cursor-pointer"
          }
        duration-300 gap-3 ${saveLoadingState && "cursor-not-allowed"}`}
          onClick={() => !saveLoadingState && handleSaveCollectionData()}
        >
          Save Collection
          <span
            className={`${
              saveLoadingState
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 w-0 pr-0 pointer-events-none"
            } duration-300`}
          >
            <NormalSpinner width={5} height={5} />
          </span>
        </button>
      </div>
    </MainPageLayout>
  );
};

export default Admin;
