"use client";
import { FC, ReactNode } from "react";
import { motion } from "framer-motion";
interface PageProps {
  children?: ReactNode;
}

const MainPageLayout: FC<PageProps> = ({ children }) => {
  return (
    <main className="main-page">
      <motion.div
        initial={{ y: 0, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ease: "easeInOut", duration: 0.5 }}
      >
        {children}
      </motion.div>
    </main>
  );
};

export default MainPageLayout;
