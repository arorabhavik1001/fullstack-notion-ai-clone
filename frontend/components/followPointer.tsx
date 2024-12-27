import { motion } from "framer-motion";

interface FollowPointerProps {
  x: number;
  y: number;
  info: { name: string; avatar: string; email: string };
}

const FollowPointer = ({ x, y, info }: FollowPointerProps) => {
  const stringToColour = (str: string) => {
    let hash = 0;
    str.split("").forEach((char) => {
      hash = char.charCodeAt(0) + ((hash << 5) - hash);
    });
    let colour = "#";
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff;
      colour += value.toString(16).padStart(2, "0");
    }
    return colour;
  };

  const color = stringToColour(info.email || "1");

  return (
    <motion.div
      className="absolute z-50 flex items-center space-x-2"
      style={{
        top: y,
        left: x,
        pointerEvents: "none",
        transform: "translate(-50%, -50%)",
      }}
      initial={{
        opacity: 0,
        scale: 0.8,
      }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      exit={{
        opacity: 0,
        scale: 0.8,
      }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="48" viewBox="0 0 24 24"><path fill={color} d="M4.5.79v22.42l6.56-6.57h9.29L4.5.79z"></path></svg>
      <br />
      <motion.div
        className="px-3 py-1 rounded-full text-gray-800 font-semibold text-sm"
        style={{
          backgroundColor: color,
        }}
        initial={{
          scale: 0.8,
          opacity: 0.8,
        }}
        animate={{
          scale: 1,
          opacity: 1,
        }}
        exit={{
          scale: 0.8,
          opacity: 0.8,
        }}
      >
        {info?.name || info?.email}
      </motion.div>
    </motion.div>
  );
};

export default FollowPointer;
