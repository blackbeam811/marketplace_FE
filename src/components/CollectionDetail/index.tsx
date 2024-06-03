import { collectionDataType } from "@/data/collectionTableData";
import Image from "next/image";
import { BsTwitterX } from "react-icons/bs";
import { FaDiscord } from "react-icons/fa";

interface CollectionDetailProps {
  collectionData: collectionDataType | undefined;
}

export default function CollectionDetail({
  collectionData,
}: CollectionDetailProps) {
  return (
    <div className="flex items-start justify-center gap-3 md:flex-row flex-col">
      <div className="flex items-center justify-center gap-2">
        <div className="w-[68px] h-[68px] relative">
          <Image
            src={collectionData?.imgUrl!}
            alt="Avatar"
            fill
            className="rounded-full"
          />
        </div>
        <div className="flex items-start justify-center flex-col">
          <span className="text-white text-xl">{collectionData?.name}</span>
          <div className="flex items-center justify-start gap-4">
            <span className="cursor-pointer hover:text-white text-gray-300 duration-300">
              <FaDiscord size={14} />
            </span>
            <span className="cursor-pointer hover:text-white text-gray-300 duration-300">
              <BsTwitterX size={12} />
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-start md:gap-10 gap-7 md:ml-10 mt-3">
        <div className="flex items-start justify-center flex-col gap-2">
          <p className="text-[12px] text-gray-400">Floor Price</p>
          <span className="text-white text-sm">123 Sol</span>
        </div>
        <div className="flex items-start justify-center flex-col gap-2">
          <p className="text-[12px] text-gray-400">Top Offere</p>
          <span className="text-white text-sm">68.25 Sol</span>
        </div>
        <div className="flex items-start justify-center flex-col gap-2">
          <p className="text-[12px] text-gray-400">24h Vol</p>
          <span className="text-white text-sm">447.6</span>
        </div>
        <div className="flex items-start justify-center flex-col gap-2">
          <p className="text-[12px] text-gray-400">24h Sales</p>
          <span className="text-white text-sm">5</span>
        </div>
        <div className="flex items-start justify-center flex-col gap-2">
          <p className="text-[12px] text-gray-400">Owners</p>
          <span className="text-white text-sm">71</span>
        </div>
      </div>
    </div>
  );
}
