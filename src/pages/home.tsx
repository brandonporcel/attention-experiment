import * as motion from "motion/react-client";
import { Bookmark, MessageSquare } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Button } from "../components/ui/button";
import SocialShare from "../components/social-share";
import Clock from "../components/clock";
import Sound from "../components/sound";

const bgCtn: React.CSSProperties = {
  margin: "0 auto",
  height: "100%",
  transition: "all 1s",
  overflow: "hidden",
};

const textsByTime = {
  "00:00": {
    text: "This picture is from Alexander McQueen's",
    end: "00:02",
  },
  "00:05": {
    text: "This may be to feel uncomfortable, but it's not to stay that way.",
    end: "00:10",
  },
  "00:11": {
    text: "Right down there is a exit button.",
    end: "00:15",
  },
  "00:15": {
    text: "There is not good or bad way of doing this.",
    end: "00:30",
  },
};

const FILES = ["img/1.jpg", "img/2.webp"];
const SOUNDS = ["audio/volto-di-donna.mp3", "audio/show-us-our-homes.mp3"];

export default function Page() {
  const [image, setImage] = useState("");
  const [sound, setSound] = useState("");
  const [duration, setDuration] = useState(0);

  const [scale, setScale] = useState(1);
  const [isBig, setIsBig] = useState(true);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [time, setTime] = useState(0);
  const [isSounding, setIsSounding] = useState(false);
  const [currentText, setCurrentText] = useState<string | null>(null);

  const handleWheelZoom = (event: React.WheelEvent) => {
    if (isBig) return;

    const zoomDelta = event.deltaY > 0 ? -0.1 : 0.1;
    setScale((prevScale) => Math.max(0.5, Math.min(3, prevScale + zoomDelta)));
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (isBig) return;
    if (event.ctrlKey) {
      if (event.key === "=" || event.key === "+") {
        setScale((prevScale) => Math.min(3, prevScale + 0.1));
      } else if (event.key === "-") {
        setScale((prevScale) => Math.max(0.5, prevScale - 0.1));
      }
    }
  };

  const quit = () => {
    setIsBig(true);
    setTime(0);
  };

  useEffect(() => {
    const formattedTime = `${Math.floor(time / 60)
      .toString()
      .padStart(2, "0")}:${(time % 60).toString().padStart(2, "0")}`;

    for (const [startTime, { text, end }] of Object.entries(textsByTime)) {
      if (formattedTime >= startTime && formattedTime <= end) {
        setCurrentText(text);
        return;
      }
    }

    setCurrentText(null);
  }, [time]);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * FILES.length);
    const randomSongIndex = Math.floor(Math.random() * SOUNDS.length);

    setImage(FILES[randomIndex]);
    setSound(SOUNDS[randomSongIndex]);
  }, []);

  useEffect(() => {
    if (sound) {
      const audio = new Audio(sound);
      audio.addEventListener("loadedmetadata", () => {
        setDuration(Math.floor(audio.duration));
      });
    }
  }, [sound]);

  return (
    <main
      className="min-h-screen relative text-white"
      onWheel={handleWheelZoom}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {!isBig && (
        <header className="absolute top-[10%] left-1/2 transform -translate-x-1/2 flex items-center justify-between w-full px-4 z-10">
          <Sound
            isSounding={isSounding}
            setIsSounding={setIsSounding}
            audio={sound}
          />
          {duration > 0 && (
            <Clock
              time={time}
              setTime={setTime}
              limit={duration}
              onTimerEnd={() => {
                alert("¡Felicidades! ¡Has completado el tiempo!");
                window.location.reload();
              }}
            />
          )}

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
      )}
      {!isBig && (
        <footer className="absolute bottom-[10%] w-full px-4 z-10 text-center">
          <AnimatePresence>
            {currentText && (
              <motion.p
                key={currentText}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="text-lg font-semibold"
              >
                {currentText}
              </motion.p>
            )}
          </AnimatePresence>

          <Button
            variant={"outline"}
            className="rounded-lg hover:bg-white/20"
            onClick={quit}
          >
            I quit
          </Button>
        </footer>
      )}
      <div
        className="absolute inset-0 z-0"
        style={
          !isBig
            ? { display: "flex", alignItems: "center", backgroundColor: "#000" }
            : {}
        }
      >
        <div
          ref={containerRef}
          style={{
            ...bgCtn,
            width: `${isBig ? "100%" : "75%"}`,
            height: `${isBig ? "100%" : "85%"}`,
          }}
        >
          {isBig && (
            <motion.img
              src={image}
              alt="Imagen de fondo"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          )}

          {!isBig && (
            <motion.img
              src={image}
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
              onDragEnd={(_event, info) => {
                setPosition({
                  x: info.offset.x + position.x,
                  y: info.offset.y + position.y,
                });
              }}
            />
          )}
        </div>

        {isBig && <div className="absolute inset-0 bg-black/20" />}
      </div>

      {isBig && (
        <div className="relative z-10 max-w-4xl mx-auto px-4 py-12 space-y-24">
          <section className="space-y-6 text-center pt-36">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif tracking-tight font-bold">
              Test Your Focus: Can You Spend 10 Minutes With One Painting?
            </h1>
            <p className="text-xl md:text-2xl font-serif">
              Focus Is a Skill. We'll Help You Practice.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm">
              <p>By Francesca Paris and Larry Buchanan</p>
              <p>July 20, 2024</p>
            </div>
            <div className="flex items-center justify-center gap-4">
              <SocialShare />
              <Button
                variant="outline"
                size="icon"
                className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 cursor-not-allowed"
              >
                <Bookmark className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 cursor-not-allowed"
              >
                <MessageSquare className="h-4 w-4" />
                <span className="ml-2">373</span>
              </Button>
            </div>
          </section>

          <section className="space-y-6 max-w-2xl mx-auto">
            <p className="text-xl">
              <span className="font-semibold">OUR ATTENTION SPANS</span> may be
              fried, but they don't have to stay that way.
            </p>
            <p className="text-lg">
              In a modest attempt to sharpen your focus, we'd like you to
              consider looking at a single painting for 10 minutes,
              uninterrupted.
            </p>
            <p className="text-lg">
              Our exercise is based on an assignment that Jennifer Roberts, an
              art history professor at Harvard, gives to her students. She asks
              them to go to a museum, pick one work of art, and look at only
              that for three full hours.
            </p>
            <p className="text-lg">
              We are not asking for hours. But will you try 10 minutes?
            </p>
          </section>

          <section className="space-y-6 max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-semibold">Ready to try?</h2>
            <p className="text-lg">
              Find somewhere you can sit comfortably. Consider silencing
              notifications on your phone or other devices. When you're ready,
              press the button below.
            </p>

            <Button
              onClick={() => setIsBig(!isBig)}
              size="lg"
              className="bg-white text-gray-900 hover:bg-white/90"
            >
              Start timer
            </Button>
          </section>
        </div>
      )}
    </main>
  );
}
