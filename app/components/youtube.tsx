"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronRight, Eye, EyeOff, Search } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";

// Import apps data from apps.json
import appsDataJson from "../content/apps.json";

interface App {
  appName: string;
  appTagline: string;
  appId: string;
  appSlug: string;
  videoId: string;
}

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: {
      Player: new (elementId: string, options: any) => any;
      PlayerState: {
        PLAYING: number;
      };
    };
  }
}

const YouTubePlayer = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredApps, setFilteredApps] = useState<App[]>([]);
  const [totalFound, setTotalFound] = useState(0);
  const [isUIVisible, setIsUIVisible] = useState(true);
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const appsData = [...appsDataJson].sort(() => Math.random() - 0.5);

  useEffect(() => {
    setIsClient(true);
    setFilteredApps(appsData);
    setTotalFound(appsData.length);
    const videoId = searchParams.get("v");
    if (videoId) {
      const index = appsData.findIndex((app) => app.videoId === videoId);
      if (index !== -1) {
        setCurrentVideoIndex(index);
      } else {
        setCurrentVideoIndex(Math.floor(Math.random() * appsData.length));
      }
    } else {
      setCurrentVideoIndex(Math.floor(Math.random() * appsData.length));
    }
  }, []);

  useEffect(() => {
    if (searchTerm.length > 0) {
      const filtered = appsData.filter(
        (app) =>
          app.appName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.appTagline.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredApps(filtered);
      setTotalFound(filtered.length);
      if (filtered.length > 0) {
        setCurrentVideoIndex(0);
      }
    } else {
      setFilteredApps(appsData);
      setTotalFound(appsData.length);
    }
  }, [searchTerm]);

  useEffect(() => {
    if (typeof window !== "undefined" && isClient) {
      window.onYouTubeIframeAPIReady = () => {
        playerRef.current = new window.YT.Player("youtube-player", {
          height: "90%",
          width: "100%",
          videoId: filteredApps[currentVideoIndex]?.videoId,
          playerVars: {
            autoplay: 1,
            controls: 1,
            modestbranding: 1,
            rel: 0,
          },
          events: {
            onReady: (event: any) => event.target.playVideo(),
            onStateChange: (event: any) => {
              if (event.data === window.YT.PlayerState.PLAYING) {
                const handleKeyDown = (e: KeyboardEvent) => {
                  if (e.target !== inputRef.current) {
                    if (e.key === "ArrowLeft") {
                      event.target.seekTo(event.target.getCurrentTime() - 5, true);
                    } else if (e.key === "ArrowRight") {
                      event.target.seekTo(event.target.getCurrentTime() + 5, true);
                    }
                  }
                };
                window.addEventListener("keydown", handleKeyDown);
                return () => {
                  window.removeEventListener("keydown", handleKeyDown);
                };
              }
            },
          },
        });
      };
    }
  }, [currentVideoIndex, isClient, filteredApps]);

  useEffect(() => {
    if (playerRef.current && playerRef.current.loadVideoById && isClient) {
      playerRef.current.loadVideoById(filteredApps[currentVideoIndex]?.videoId);
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("v", filteredApps[currentVideoIndex]?.videoId);
      router.push(`?${newSearchParams.toString()}`, { scroll: false });
    }
  }, [currentVideoIndex, isClient, filteredApps, router, searchParams]);

  const handleNext = () => {
    if (filteredApps.length > 0) {
      const nextIndex = (currentVideoIndex + 1) % filteredApps.length;
      setCurrentVideoIndex(nextIndex);
    }
  };

  const handleGoogleAICompetition = () => {
    const slug = filteredApps[currentVideoIndex]?.appSlug;
    if (slug) {
      window.open(`https://ai.google.dev/competition/projects/${slug}`, "_blank");
    }
  };

  const handleCheckMyProject = () => {
    const slug = "darksai-mystery-stories-mobile-game";
    window.open(`https://ai.google.dev/competition/projects/${slug}`, "_blank");
  };

  const toggleUIVisibility = () => {
    setIsUIVisible(!isUIVisible);
  };

  if (!isClient) {
    return null;
  }

  return (
    <>
      <Script src="https://www.youtube.com/iframe_api" />
      <div className="flex flex-col h-[calc(100dvh)] w-screen bg-black" ref={containerRef}>
        <div className="flex-grow flex flex-col items-center justify-center relative">
          <div id="youtube-player" className="w-full h-full" />
          <Button
            variant="ghost"
            onClick={toggleUIVisibility}
            className="absolute top-1/2 left-4 transform -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white hover:text-white"
            aria-label={isUIVisible ? "Hide UI" : "Show UI"}
          >
            {isUIVisible ? <EyeOff size={20} /> : <Eye size={20} />}
          </Button>
          {isUIVisible && (
            <>
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-[90%] md:w-full max-w-md z-10">
                <div className="relative">
                  <Input
                    ref={inputRef}
                    type="text"
                    placeholder="Search apps..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full bg-black/50 text-white rounded-full text-lg border-gray-600 placeholder:text-white/60"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <p className="absolute text-gray-300 text-xs -mt-[27px] right-0 mr-4">Records: {totalFound}</p>
                </div>
                <div className="mt-2 text-center bg-black/50 rounded">
                  <h2 className="text-white text-sm md:text-lg font-semibold text-center">
                    {filteredApps[currentVideoIndex]?.appName}
                  </h2>
                  <p className="text-white text-xs md:text-base px-2 sm:px-4  text-center">
                    {filteredApps[currentVideoIndex]?.appTagline}
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 items-center mt-4 absolute bottom-16 left-1/2 transform -translate-x-1/2 z-1000">
                <Button
                  variant="default"
                  onClick={handleGoogleAICompetition}
                  className="bg-blue-700 hover:bg-blue-600 text-white rounded-full px-4 sm:px-6 py-2 font-semibold shadow-lg w-full"
                >
                  <span className="mr-2">✨</span>
                  View on Google AI
                </Button>
                <Button
                  variant="default"
                  onClick={handleCheckMyProject}
                  className="bg-green-500 hover:bg-green-600 text-white rounded-full px-4 sm:px-6 py-2 font-semibold shadow-lg w-full"
                >
                  <span className="mr-2">🚀</span>
                  Check Our Project
                </Button>
              </div>
            </>
          )}
          <div className="absolute inset-y-0 right-0 flex items-center px-10">
            <Button
              variant="default"
              onClick={handleNext}
              className="bg-black/50 hover:bg-black/70 text-white hover:text-white flex items-center justify-center flex-row"
              aria-label="Next video"
              autoFocus
            >
              <span className="text-xs mr-2 bg-gray-600 px-2 py-0.5 rounded-md hidden sm:inline-block">ENTER</span>
              NEXT
              <ChevronRight className="h-5 w-5 -mt-0.5 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default dynamic(() => Promise.resolve(YouTubePlayer), { ssr: false });
