"use client";
import { useContext } from "react";
import { BiSearch } from "react-icons/bi";
import { CloseIcon } from "../SvgIcons";
import { CgClose } from "react-icons/cg";
import { ModalContext } from "@/contexts/ModalContext";

export default function MobileSearchCollectionBar() {
  const { closeSearchCollectionModal, searchCollectionModalShow } =
    useContext(ModalContext);
  return (
    <div
      className={`w-full fixed top-0 h-[60px] border-b-[1px] border-gray-800 bg-gray-900 z-[9999] px-2 flex items-center justify-between
    ${!searchCollectionModalShow && "hidden"}`}
    >
      <BiSearch size={24} color="white" />
      <input
        className="w-full outline-none bg-transparent px-3 placeholder:text-gray-700 text-white"
        placeholder="Search Collection..."
      />
      <span className="cursor-pointer" onClick={closeSearchCollectionModal}>
        <CgClose size={24} color="white" />
      </span>
    </div>
  );
}
