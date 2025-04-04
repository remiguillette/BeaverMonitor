import { useState, useRef, useEffect } from "react";
import { Play, Pause } from "lucide-react";

export interface VideoSource {
  title: string;
  src: string;
  type: string;
}

export default function VideoPlayerPanel() {
  const [playing, setPlaying] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const videoSources: VideoSource[] = [
    {
      title: "Video 1",
      src: "assets/Video1.mp4",
      type: "video/mp4"
    },
    {
      title: "Video 2", 
      src: "assets/video2.mp4",
      type: "video/mp4"
    },
    {
      title: "Video 3",
      src: "assets/video3.mp4", 
      type: "video/mp4"
    },
    {
      title: "Video 4",
      src: "assets/video4.mp4",
      type: "video/mp4"
    },
    {
      title: "Video 5", 
      src: "assets/video5.mp4",
      type: "video/mp4"
    },
    {
      title: "Video 6",
      src: "assets/video6.mp4",
      type: "video/mp4"
    }
  ];

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setPlaying(true);
    const handlePause = () => setPlaying(false);
    const handleEnded = () => {
      setCurrentVideoIndex((prevIndex) => 
        prevIndex === videoSources.length - 1 ? 0 : prevIndex + 1
      );
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
    };
  }, [videoSources.length]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      console.log('Video ref not available');
      return;
    }

    console.log('Loading video:', videoSources[currentVideoIndex]);
    
    const handleError = (e: ErrorEvent) => {
      console.error('Video error:', e);
      setPlaying(false);
    };

    const handleLoadStart = () => {
      console.log('Video load started');
      setPlaying(false);
    };

    const handleLoadedData = () => {
      console.log('Video data loaded successfully');
      if (playing) {
        video.play().catch((err) => {
          console.error('Play error:', err);
          setPlaying(false);
        });
      }
    };

    video.addEventListener('error', handleError);
    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('loadeddata', handleLoadedData);

    video.load();

    return () => {
      video.removeEventListener('error', handleError);
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('loadeddata', handleLoadedData);
    };
  }, [currentVideoIndex, playing, videoSources]); // Ajouter playing à la liste des dépendances

  const togglePlay = () => {
    if (!videoRef.current) return;

    if (playing) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(() => setPlaying(false));
    }
  };

  return (
    <div className="bg-[#1e1e1e] w-full h-full rounded-lg overflow-hidden border border-[#333333]">
      <div className="relative h-full">
        <video 
          ref={videoRef} 
          className="w-full h-full object-contain"
          poster="assets/video-poster.svg"
          playsInline
          controls
        >
          <source src={videoSources[currentVideoIndex].src} type={videoSources[currentVideoIndex].type} />
          Your browser does not support video playback.
        </video>

        <div 
          className="absolute inset-0 flex items-center justify-center cursor-pointer group"
          onClick={togglePlay}
        >
          {!playing && (
            <div className="bg-primary/80 rounded-full p-3 opacity-80 group-hover:opacity-100 transition-opacity">
              <Play className="w-6 h-6 text-white" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}