"use client";
/* eslint-disable @next/next/no-img-element */
import type { NextPage } from "next";
import MainPageLayout from "@/components/Layout";
import CollectionSlider from "@/components/CollectionSlider";
import CollectionTable from "@/components/CollectionTable";

const Home: NextPage = () => {
  return (
    <MainPageLayout>
      <div className="w-full flex items-center justify-center px-5 duration-300">
        <div className="flex items-center justify-center max-w-[1440px] w-full flex-col gap-3 my-10">
          <CollectionSlider />
          <CollectionTable />
        </div>
      </div>
    </MainPageLayout>
  );
};

export default Home;
