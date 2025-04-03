import { useState, useRef, useEffect } from "react";
import { Play } from "lucide-react";

export interface VideoSource {
  title: string;
  src: string;
  type: string;
}

export default function VideoPlayerPanel() {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Sample video sources
  const videoSources: VideoSource[] = [
    {
      title: "Gardiner Expressway - Caméra en direct",
      src: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      type: "video/mp4"
    }
  ];

  const [currentSource] = useState<VideoSource>(videoSources[0]);

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
      // Loop the video when it ends
      if (video) {
        video.currentTime = 0;
        video.play()
          .then(() => setPlaying(true))
          .catch(() => setPlaying(false));
      }
    };

    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  return (
    <div className="bg-[#1e1e1e] w-full h-auto rounded-lg overflow-hidden border border-[#333333]">
      <div className="relative">
        <video 
          ref={videoRef} 
          className="w-full h-auto block"
          poster="/assets/video-poster.svg"
          playsInline
          loop
        >
          <source src={currentSource.src} type={currentSource.type} />
          Votre navigateur ne prend pas en charge la lecture vidéo.
        </video>

        <div className="absolute top-1 left-1 bg-black/70 text-white px-2 py-0.5 rounded text-xs">
          {currentSource.title}
        </div>

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