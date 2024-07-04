/* eslint-disable @next/next/no-img-element */

import { LoadingContext } from "@/contexts/LoadingContext";
import { useContext } from "react";

export default function FuncSpinner() {
  const { functionLoadingShow } = useContext(LoadingContext);
  return (
    <div
      className={`fixed items-center justify-center flex top-0 bottom-0 right-0 left-0 z-[9999] bg-black backdrop-blur-md bg-opacity-15 ${
        !functionLoadingShow && "hidden"
      }`}
    >
      <img
        alt="loading"
        src="/images/loadingImg.png"
        className="w-7 h-7 animate-spin"
      />
    </div>
  );
}
