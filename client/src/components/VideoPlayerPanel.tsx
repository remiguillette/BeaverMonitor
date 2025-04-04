
import { useState, useRef, useEffect } from "react";
import { Play, Pause, AlertCircle } from "lucide-react";

interface VideoSource {
  title: string;
  src: string;
  type: string;
}

export default function VideoPlayerPanel() {
  const [playing, setPlaying] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const videoSources: VideoSource[] = [
    { title: "Video 1", src: "assets/Video1.mp4", type: "video/mp4" },
    { title: "Video 2", src: "assets/video2.mp4", type: "video/mp4" },
    { title: "Video 3", src: "assets/video3.mp4", type: "video/mp4" },
    { title: "Video 4", src: "assets/video4.mp4", type: "video/mp4" },
    { title: "Video 5", src: "assets/video5.mp4", type: "video/mp4" },
    { title: "Video 6", src: "assets/video6.mp4", type: "video/mp4" }
  ];

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleError = () => {
      setError(`Failed to load video: ${videoSources[currentVideoIndex].title}`);
      setPlaying(false);
      setIsLoading(false);
    };

    const handleLoadStart = () => {
      setIsLoading(true);
      setError(null);
    };

    const handleLoadedData = () => {
      setIsLoading(false);
      setError(null);
    };

    const handleEnded = () => {
      setPlaying(false);
      setCurrentVideoIndex((prev) => 
        prev === videoSources.length - 1 ? 0 : prev + 1
      );
    };

    video.addEventListener('error', handleError);
    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('ended', handleEnded);

    // Reset video state
    setPlaying(false);
    setIsLoading(true);
    setError(null);

    // Load new video
    video.load();

    return () => {
      video.removeEventListener('error', handleError);
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('ended', handleEnded);
    };
  }, [currentVideoIndex, videoSources]);

  const togglePlay = async () => {
    const video = videoRef.current;
    if (!video || isLoading) return;

    try {
      if (playing) {
        await video.pause();
        setPlaying(false);
      } else {
        await video.play();
        setPlaying(true);
      }
    } catch (err) {
      setError(`Playback error: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setPlaying(false);
    }
  };

  return (
    <div className="bg-[#1e1e1e] w-full h-full rounded-lg overflow-hidden border border-[#333333] relative">
      {error && (
        <div className="absolute top-2 left-2 right-2 z-10 bg-red-500/80 text-white p-2 rounded-md flex items-center">
          <AlertCircle className="w-4 h-4 mr-2" />
          {error}
        </div>
      )}
      
      <div className="relative h-full">
        <video 
          ref={videoRef}
          className="w-full h-full object-contain"
          poster="assets/video-poster.svg"
          playsInline
        >
          <source 
            src={videoSources[currentVideoIndex].src} 
            type={videoSources[currentVideoIndex].type} 
          />
          Your browser does not support video playback.
        </video>

        <div 
          className="absolute inset-0 flex items-center justify-center cursor-pointer group"
          onClick={togglePlay}
        >
          {!playing && !isLoading && (
            <div className="bg-primary/80 rounded-full p-3 opacity-80 group-hover:opacity-100 transition-opacity">
              <Play className="w-6 h-6 text-white" />
            </div>
          )}
          {playing && !isLoading && (
            <div className="bg-primary/80 rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <Pause className="w-6 h-6 text-white" />
            </div>
          )}
          {isLoading && (
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"/>
          )}
        </div>
      </div>
    </div>
  );
}
