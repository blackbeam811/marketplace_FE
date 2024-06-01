import { NextPage } from "next";
import MainPageLayout from "@/components/Layout";

const Page: NextPage = () => {
  return (
    <MainPageLayout>
      <div className="w-full flex items-center justify-center min-h-[80vh]">
        <h1 className="text-white font-extrabold text-3xl uppercase">
          Coming soon...
        </h1>
      </div>
    </MainPageLayout>
  );
};

export default Page;
