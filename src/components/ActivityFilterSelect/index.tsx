"use client";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import { useRef, useState } from "react";
import { CgClose } from "react-icons/cg";

export default function ActivityFilterSelect() {
  const elem = useRef(null);
  const [open, setOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  useOnClickOutside(elem, () => setOpen(false));

  const options = ["Sale", "Offer", "List", "Delist", "Pool Update"];

  const addTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const removeTag = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  };

  const filteredOptions = options.filter(
    (option) =>
      option.toLowerCase().includes(searchKeyword.toLowerCase()) &&
      !selectedTags.includes(option)
  );

  return (
    <div
      className="w-[350px] relative border border-customborder rounded-md"
      ref={elem}
    >
      <div
        className="bg-transparent rounded-md p-2 flex items-center justify-between space-x-2 w-full cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <span
          className={`text-[12px] text-gray-500 ${
            selectedTags.length !== 0 && "hidden"
          }`}
        >
          Filter By Type
        </span>
        <div className="flex flex-wrap space-x-2">
          {selectedTags.map((tag) => (
            <div
              key={tag}
              className="bg-green-800 text-white rounded-md px-1 text-[12px] flex items-center space-x-2"
            >
              {tag}
              <button
                onClick={() => {
                  removeTag(tag);
                }}
                className="ml-2 text-yellow-500"
              >
                x
              </button>
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={() => {
          setSelectedTags([]);
          setOpen(false);
        }}
        className="ml-auto text-white px-3 py-1 text-sm absolute z-40 top-[7px] right-0"
      >
        <CgClose />
      </button>
      <div
        className={`absolute w-full bg-darkgreen z-40 duration-300 ${
          !open || filteredOptions.length === 0
            ? "opacity-0 pointer-events-none"
            : " opacity-100 pointer-events-auto"
        } mt-1`}
      >
        <ul className="w-full border border-customborder bg-transparent text-white rounded-md py-2 max-h-40 overflow-y-auto">
          {filteredOptions.map((option) => (
            <li
              key={option}
              className="p-2 hover:bg-green-900 cursor-pointer text-sm"
              onClick={() => addTag(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
