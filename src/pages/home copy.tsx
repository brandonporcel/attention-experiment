import { motion } from "framer-motion";
import React, { useRef, useState } from "react";

const bgCtn: React.CSSProperties = {
  margin: "0 auto",
  height: "100%",
  transition: "all 1s",
  border: "1px solid green",
  overflow: "hidden",
};

export default function Page() {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleWheelZoom = (event: React.WheelEvent) => {
    const zoomDelta = event.deltaY > 0 ? -0.1 : 0.1;
    setScale((prevScale) => Math.max(0.5, Math.min(3, prevScale + zoomDelta)));
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.ctrlKey) {
      if (event.key === "=" || event.key === "+") {
        setScale((prevScale) => Math.min(3, prevScale + 0.1));
      } else if (event.key === "-") {
        setScale((prevScale) => Math.max(0.5, prevScale - 0.1));
      }
    }
  };

  return (
    <main
      className="min-h-screen relative text-white"
      onWheel={handleWheelZoom}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <header className="absolute top-[10%] left-1/2 transform -translate-x-1/2 flex items-center justify-between w-full px-4 z-10">
        <span></span>
        <p className="text-xl font-bold">10:30</p>
        <div className="flex space-x-2">
          <button
            className="bg-gray-700 text-white rounded-full w-8 h-8 flex items-center justify-center"
            onClick={() =>
              setScale((prevScale) => Math.min(3, prevScale + 0.1))
            }
          >
            +
          </button>
          <button
            className="bg-gray-700 text-white rounded-full w-8 h-8 flex items-center justify-center"
            onClick={() =>
              setScale((prevScale) => Math.max(0.5, prevScale - 0.1))
            }
          >
            -
          </button>
        </div>
      </header>
      <footer className="absolute bottom-[10%] w-full px-4 z-10 text-center">
        <button>I quit</button>
      </footer>
      <div
        className="absolute inset-0 z-0"
        style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "#000",
        }}
      >
        <div
          ref={containerRef}
          style={{
            ...bgCtn,
            width: "75%",
            height: "85%",
          }}
        >
          <motion.img
            src="https://ids.hvrd.art/ids/view/17386501?width=3000&height=3000"
            alt="Imagen de fondo"
            drag
            dragConstraints={containerRef}
            dragMomentum={false}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              x: position.x,
              y: position.y,
              scale: scale,
            }}
            onDragEnd={(event, info) => {
              setPosition({
                x: info.offset.x + position.x,
                y: info.offset.y + position.y,
              });
            }}
          />
        </div>
      </div>
    </main>
  );
}
