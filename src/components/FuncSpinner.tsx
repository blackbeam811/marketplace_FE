/* eslint-disable @next/next/no-img-element */

import { LoadingContext } from "@/contexts/LoadingContext";
import { useContext } from "react";

export default function FuncSpinner() {
  const { functionLoadingShow } = useContext(LoadingContext);
  return (
    <div
      className={`fixed items-center justify-center flex top-0 bottom-0 right-0 left-0 z-[9999] bg-black backdrop-blur-md bg-opacity-30 ${
        !functionLoadingShow && "hidden"
      }`}
    >
      <div className="w-[340px] bg-green-950 shadow-md flex items-center justify-center flex-col gap-2 p-2 rounded-md">
        <p className="text-white text-center">
          Do not refresh the page during the function is closed.
        </p>
        <img
          alt="loading"
          src="/images/loadingImg.png"
          className="w-7 h-7 animate-spin"
        />
      </div>
    </div>
  );
}
