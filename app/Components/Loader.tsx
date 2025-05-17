import React from "react";
import { motion } from "framer-motion";

const Loader = () => {
  const loaderCircle = {
    animate: {
      scale: [1, 1.5, 1],
      opacity: [1, 0.5, 1],
      transition: {
        duration: 1.5,
        ease: "easeInOut",
        repeat: Infinity,
      },
    },
  };

  return (
    <div className="flex items-center justify-center bg-amber-50 h-screen bg-gray-100">
      <div className="flex space-x-4">
        <motion.div
          className="w-6 h-6 bg-blue-500 rounded-full"
          variants={loaderCircle}
          animate="animate"
        ></motion.div>
        <motion.div
          className="w-6 h-6 bg-green-500 rounded-full"
          variants={loaderCircle}
          animate="animate"
        ></motion.div>
        <motion.div
          className="w-6 h-6 bg-red-500 rounded-full"
          variants={loaderCircle}
          animate="animate"
        ></motion.div>
      </div>
    </div>
  );
};

export default Loader;
