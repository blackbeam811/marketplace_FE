import { SlBasket } from "react-icons/sl";

export default function ItemMultiSelectbar() {
  return (
    <div className="bg-darkgreen w-full md:flex hidden items-center justify-between md:flex-row flex-col border-t px-2 border-customborder pt-3">
      <div className="flex items-center justify-center gap-2 w-full md:w-auto">
        <div className="items-center gap-2 justify-center flex border border-customborder rounded-md px-1">
          <input
            placeholder="0"
            type="number"
            className="outline-none bg-transparent w-[50px] text-white px-2 py-1"
          />
          <p className="text-sm text-gray-200 uppercase">items</p>
        </div>
        <input
          type="range"
          className="focus:outline-none outline-none"
          max={5}
          onChange={(e) => console.log(e.target.value)}
        />
      </div>
      <div className="flex items-center justify-center gap-2">
        <div className="bg-yellow-600 rounded-md py-1 text-white px-10 cursor-pointer hover:bg-yellow-500 duration-300">
          Buy now
        </div>
        <div className="p-2 rounded-md bg-white cursor-pointer">
          <SlBasket color="black" />
        </div>
      </div>
    </div>
  );
}
