import { BiRefresh } from "react-icons/bi";
import { SlBasket } from "react-icons/sl";

export default function MobileItemMultiSelectBar() {
  return (
    <div className="w-full md:hidden fixed bottom-[3.4rem] border-t border-customborder bg-darkgreen left-0 right-0 p-1 z-50 flex items-center justify-between">
      <div className="bg-yellow-600 text-sm rounded-md px-8 py-[5px] text-white">
        Buy now
      </div>

      <div className="flex items-center justify-center gap-2">
        <div className="items-center gap-2 justify-center flex border border-customborder rounded-md px-1">
          <input
            placeholder="0"
            type="number"
            className="outline-none bg-transparent w-[80px] text-white px-2 py-1"
          />
          <p className="text-sm text-gray-200 uppercase">items</p>
        </div>
        <div className="p-[6px] rounded-md bg-darkgreen cursor-pointer border border-customborder">
          <SlBasket color="white" />
        </div>{" "}
      </div>
    </div>
  );
}
