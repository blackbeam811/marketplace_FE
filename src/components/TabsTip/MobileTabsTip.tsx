import { BiLineChart } from "react-icons/bi";
import { FaAlignCenter } from "react-icons/fa";
import { MdOutlineLocalOffer } from "react-icons/md";
import { useRouter, useSearchParams } from "next/navigation";
import { TabMenu } from "@/data/tabMenuData";

export default function MobileTabsTip(props: { setSelectedNFTs: () => void }) {
  const router = useRouter();
  const param = useSearchParams();
  const search = param.get("activeTab") || "items";
  return (
    <div
      className="w-full fixed bottom-0 bg-darkgreen border-t border-customborder left-0 right-0 flex md:hidden items-center justify-center gap-8 py-[3px]
    px-3"
    >
      {TabMenu.map((item, index) => (
        <div
          className={`flex flex-col gap-[1px] border-yellow-500 ${
            item.param === search.toString()
              ? "border-b-2 text-white"
              : "text-gray-400"
          } w-[50px] justify-center items-center`}
          onClick={() => {
            router.push(item.link);
            props.setSelectedNFTs();
          }}
          key={index}
        >
          <div className="p-1">
            {item.icon}
            {/* <FaAlignCenter color="#dedcdcca" /> */}
          </div>
          <p className="text-sm">{item.title}</p>
        </div>
      ))}
    </div>
  );
}
