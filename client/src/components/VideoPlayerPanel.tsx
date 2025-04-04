
import { useState, useRef, useEffect } from "react";
import { Play } from "lucide-react";

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
      src: "/assets/Video1.mp4",
      type: "video/mp4"
    },
    {
      title: "Video 2", 
      src: "/assets/video2.mp4",
      type: "video/mp4"
    },
    {
      title: "Video 3",
      src: "/assets/video3.mp4", 
      type: "video/mp4"
    },
    {
      title: "Video 4",
      src: "/assets/video4.mp4",
      type: "video/mp4"
    },
    {
      title: "Video 5", 
      src: "/assets/video5.mp4",
      type: "video/mp4"
    },
    {
      title: "Video 6",
      src: "/assets/video6.mp4",
      type: "video/mp4"
    }
  ];

  const togglePlay = () => {
    if (videoRef.current) {
      if (playing) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setPlaying(!playing);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => {
      // Move to next video when current one ends
      setCurrentVideoIndex((prevIndex) => 
        prevIndex === videoSources.length - 1 ? 0 : prevIndex + 1
      );
    };

    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('ended', handleEnded);
    };
  }, [videoSources.length]);

  useEffect(() => {
    // When current video index changes, start playing the new video
    if (videoRef.current && playing) {
      videoRef.current.play()
        .catch(() => setPlaying(false));
    }
  }, [currentVideoIndex]);

  return (
    <div className="bg-[#1e1e1e] w-full h-auto rounded-lg overflow-hidden border border-[#333333]">
      <div className="relative">
        <video 
          ref={videoRef} 
          className="w-full h-auto block"
          poster="/assets/video-poster.svg"
          playsInline
        >
          <source src={videoSources[currentVideoIndex].src} type={videoSources[currentVideoIndex].type} />
          Votre navigateur ne prend pas en charge la lecture vidéo.
        </video>

        {/* Play/Pause overlay */}
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
