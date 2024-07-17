"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function CollectionItemSkeleton(props: {
  loadingState: boolean;
}) {
  const router = useRouter();
  const param = useSearchParams();
  const search = param.get("activeTab") || "items";

  return (
    <div
      className={`items-start justify-start w-full grid grid-cols-2 md:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5 pb-1 ${
        props.loadingState && search === "items" ? "flex" : "hidden"
      }`}
    >
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="w-full aspect-[5/6] animate-pulse bg-green-900 rounded-md"
        />
      ))}
    </div>
  );
}
