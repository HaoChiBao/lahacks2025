import { motion } from "framer-motion";

const animals = [
  "/animals/beaver.png",
  "/animals/chicken.png",
  "/animals/cow.png",
  "/animals/hog.png",
  "/animals/lion.png",
];

export default function AnimalBounce() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
      {animals.map((src, index) => {
        const randomStartX = Math.random() * window.innerWidth;
        const randomStartY = Math.random() * window.innerHeight;

        return (
          <motion.img
            key={index}
            src={src}
            alt="Animal"
            className="absolute object-cover rounded-full shadow-lg"
            style={{
              width: "120px", // 🐾 Double size (was w-16 (64px) now ~120px)
              height: "120px",
            }}
            initial={{
              x: randomStartX,
              y: randomStartY,
            }}
            animate={{
              x: [
                randomStartX,
                Math.random() * window.innerWidth,
                Math.random() * window.innerWidth,
              ],
              y: [
                randomStartY,
                Math.random() * window.innerHeight,
                Math.random() * window.innerHeight,
              ],
            }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: 12 + Math.random() * 5, // 🐌 12–17 seconds per bounce, slower
              ease: "easeInOut",
            }}
          />
        );
      })}
    </div>
  );
}
