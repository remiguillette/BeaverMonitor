
import { useState } from "react";
import ReactPlayer from "react-player";
import { Play, Pause } from "lucide-react";

interface VideoSource {
  title: string;
  src: string;
  type: string;
}

export default function VideoPlayerPanel() {
  const [playing, setPlaying] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const videoSources: VideoSource[] = [
    { title: "Video 1", src: "assets/Video1.mp4", type: "video/mp4" },
    { title: "Video 2", src: "assets/video2.mp4", type: "video/mp4" },
    { title: "Video 3", src: "assets/video3.mp4", type: "video/mp4" },
    { title: "Video 4", src: "assets/video4.mp4", type: "video/mp4" },
    { title: "Video 5", src: "assets/video5.mp4", type: "video/mp4" },
    { title: "Video 6", src: "assets/video6.mp4", type: "video/mp4" }
  ];

  const handleError = (error: any) => {
    console.error("Video error:", error);
    const errorMessage = error?.message || "Failed to load video";
    setError(`${errorMessage}. Please check if the video file exists.`);
    setPlaying(false);
  };

  const handleEnded = () => {
    setPlaying(false);
    setCurrentVideoIndex((prev) => (prev + 1) % videoSources.length);
  };

  const togglePlay = () => {
    setError(null);
    setPlaying(!playing);
  };

  return (
    <div className="bg-[#1e1e1e] w-full h-full rounded-lg overflow-hidden border border-[#333333] relative">
      {error && (
        <div className="absolute top-2 left-2 right-2 z-10 bg-red-500/80 text-white p-2 rounded-md">
          {error}
        </div>
      )}

      <div className="relative h-full">
        <ReactPlayer
          url={videoSources[currentVideoIndex].src}
          playing={playing}
          width="100%"
          height="100%"
          onError={handleError}
          onEnded={handleEnded}
          controls={false}
          playsinline
          config={{
            file: {
              attributes: {
                crossOrigin: "anonymous"
              }
            }
          }}
        />

        <div 
          className="absolute inset-0 flex items-center justify-center cursor-pointer"
          onClick={togglePlay}
        >
          {!playing && (
            <div className="bg-primary/80 rounded-full p-3 opacity-80 hover:opacity-100 transition-opacity">
              <Play className="w-6 h-6 text-white" />
            </div>
          )}
          {playing && (
            <div className="bg-primary/80 rounded-full p-3 opacity-0 hover:opacity-100 transition-opacity">
              <Pause className="w-6 h-6 text-white" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
