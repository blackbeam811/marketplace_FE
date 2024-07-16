"use client";
/* eslint-disable @next/next/no-img-element */
import type { NextPage } from "next";
import React from "react";
import MainPageLayout from "@/components/Layout";
import CollectionSlider from "@/components/CollectionSlider";
import CollectionTable from "@/components/CollectionTable";
const Home: NextPage = () => {
  return (
    <MainPageLayout>
      <React.StrictMode>
        <div className="w-full flex items-center justify-center px-5 duration-300">
          <div className="flex items-center justify-center max-w-[1440px] w-full flex-col gap-3 my-10">
            {/* <CollectionSliderSkeleton loadingState={collectionDataState} /> */}
            <CollectionSlider loadingState={false} />
            <CollectionTable />
          </div>
        </div>
      </React.StrictMode>
    </MainPageLayout>
  );
};

export default Home;
