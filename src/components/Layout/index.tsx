"use client";
import { FC, ReactNode } from "react";
import { motion } from "framer-motion";
interface PageProps {
  children?: ReactNode;
}

const MainPageLayout: FC<PageProps> = ({ children }) => {
  return (
    <motion.div
      initial={{ y: 0, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ ease: "easeInOut", duration: 0.2 }}
    >
      <main className="main-page w-full items-center justify-center flex lg:px-3 pt-14 flex-col relative">
        {children}
      </main>
    </motion.div>
  );
};

export default MainPageLayout;
