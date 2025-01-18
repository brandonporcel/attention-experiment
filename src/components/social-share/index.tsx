import { useState, useEffect, useRef } from "react";
import { Share, CopyIcon, Check } from "lucide-react";
import {
  LinkedinShareButton,
  FacebookShareButton,
  WhatsappShareButton,
} from "react-share";
import { Button } from "../ui/button";
import Facebook from "../icons/facebook";
import Linkedin from "../icons/linkedin";
import Whatsapp from "../icons/whatsapp";

export default function SocialShare() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const currentUrl = window.location.href;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <Button
        variant="outline"
        className={`${
          isOpen ? "bg-white/20" : "bg-white/10"
        } backdrop-blur-sm border-white/20 hover:bg-white/20`}
        onClick={toggleMenu}
      >
        <Share className="mr-2 h-4 w-4" />
        Share full article
      </Button>

      {isOpen && (
        <div className="absolute mt-2 right-0 w-56 bg-black text-white rounded-md shadow-lg z-10">
          <ul className="py-2">
            <li
              className="flex items-center gap-2 px-4 py-2 hover:bg-white/60 cursor-pointer"
              onClick={handleCopy}
            >
              {copied ? (
                <>
                  <Check className="text-green-500 h-5 w-5" />
                  Copied
                </>
              ) : (
                <>
                  <CopyIcon className="h-5 w-5" />
                  Copy
                </>
              )}
            </li>

            <li className="flex items-center gap-2 px-4 py-2 hover:bg-white/60 cursor-pointer">
              <LinkedinShareButton
                url={currentUrl}
                className="flex gap-3 w-full"
              >
                <Linkedin className="fill-neutral-300" />
                Linkedin
              </LinkedinShareButton>
            </li>

            <li className="flex items-center gap-2 px-4 py-2 hover:bg-white/60 cursor-pointer">
              <FacebookShareButton
                url={currentUrl}
                className="flex gap-3 w-full"
              >
                <Facebook className="fill-neutral-300" />
                Facebook
              </FacebookShareButton>
            </li>
            <li className="flex items-center gap-2 px-4 py-2 hover:bg-white/60 cursor-pointer">
              <WhatsappShareButton
                url={currentUrl}
                className="flex gap-3 w-full"
              >
                <Whatsapp className="fill-neutral-300" />
                WhatsApp
              </WhatsappShareButton>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
