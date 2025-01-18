import StopCircle from "../icons/stop-circle";
import PlayCircle from "../icons/play-circle";
import { useEffect, useRef } from "react";

type SoundProps = {
  isSounding: boolean;
  setIsSounding: React.Dispatch<React.SetStateAction<boolean>>;
  audio: string;
};

export default function Sound(props: SoundProps) {
  const { isSounding, setIsSounding, audio } = props;
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(audio);
    }

    if (isSounding) {
      audioRef.current.play().catch((err) => {
        console.error("Error al reproducir el audio:", err);
      });
    } else {
      audioRef.current.pause();
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [isSounding, audio]);

  return (
    <span className="cursor-pointer" onClick={() => setIsSounding(!isSounding)}>
      {isSounding ? (
        <StopCircle className="fill-slate-50 hover:fill-slate-200" />
      ) : (
        <PlayCircle className="fill-slate-50 hover:fill-slate-200" />
      )}
    </span>
  );
}
