"use client";

import { ActivityContextType, ActivityDataType } from "@/types/types";
import { getAllActivities } from "@/utils/api";
import { useWallet } from "@solana/wallet-adapter-react";
import { createContext, ReactNode, useEffect, useState } from "react";

export const ActivityContext = createContext<ActivityContextType>({
  activityDataState: false,
  activityData: [],
  getAllActivityData: async () => {},
});

interface ActivityProviderProps {
  children: ReactNode;
}

export function ActivityProvider({ children }: ActivityProviderProps) {
  const { publicKey } = useWallet();
  const [activityData, setActivityData] = useState<ActivityDataType[]>([]);
  const [activityDataState, setActivityDataState] = useState<boolean>(false);

  const getAllActivityData = async (): Promise<void> => {
    if (!publicKey) return;
    const result = await getAllActivities(publicKey.toBase58());

    const data: ActivityDataType[] = [];
    await Promise.all(
      result.map(async (item: ActivityDataType) => {
        data.push(item);
      })
    );

    console.log("Activity data ===>", data);
    setActivityData(data);
    setActivityDataState(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getAllActivityData();
      } catch (error) {
        console.error("Error fetching Activity data:", error);
      }
    };

    fetchData(); // Fetch data immediately when component mounts

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicKey]);

  const ActivityContextValue: ActivityContextType = {
    activityDataState,
    activityData,
    getAllActivityData,
  };

  return (
    <ActivityContext.Provider value={ActivityContextValue}>
      {children}
    </ActivityContext.Provider>
  );
}
