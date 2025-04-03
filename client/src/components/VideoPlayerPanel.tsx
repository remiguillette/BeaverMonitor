import { useState, useRef, useEffect } from "react";
import { Film, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { Slider } from "@/components/ui/slider";

export interface VideoSource {
  title: string;
  src: string;
  type: string;
}

export default function VideoPlayerPanel() {
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(50);
  const [muted, setMuted] = useState(false);
  const [loading, setLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Sample video sources
  const videoSources: VideoSource[] = [
    {
      title: "Gardiner Expressway - Caméra en direct",
      src: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", // Sample video
      type: "video/mp4"
    },
    {
      title: "Autoroute 401 - Direction Est",
      src: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", // Sample video
      type: "video/mp4"
    },
    {
      title: "QEW - Niagara",
      src: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", // Sample video
      type: "video/mp4"
    }
  ];
  
  const [currentSource, setCurrentSource] = useState<VideoSource>(videoSources[0]);

  // Format time from seconds to MM:SS
  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Control handlers
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

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !muted;
      setMuted(!muted);
    }
  };

  const handleVolumeChange = (newVolume: number[]) => {
    const volumeValue = newVolume[0];
    setVolume(volumeValue);
    
    if (videoRef.current) {
      videoRef.current.volume = volumeValue / 100;
      
      // If volume is set to 0, mute the video
      if (volumeValue === 0) {
        setMuted(true);
        videoRef.current.muted = true;
      } else if (muted) {
        // If we're increasing volume from 0, unmute
        setMuted(false);
        videoRef.current.muted = false;
      }
    }
  };

  const handleSeek = (newTime: number[]) => {
    const seekTime = newTime[0];
    setCurrentTime(seekTime);
    
    if (videoRef.current) {
      videoRef.current.currentTime = seekTime;
    }
  };

  // Event handlers for video element
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setLoading(false);
    };

    const handleEnded = () => {
      setPlaying(false);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('canplay', () => setLoading(false));
    video.addEventListener('waiting', () => setLoading(true));

    // Set initial volume
    video.volume = volume / 100;

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('canplay', () => setLoading(false));
      video.removeEventListener('waiting', () => setLoading(true));
    };
  }, []);

  return (
    <div className="bg-[#1e1e1e] p-6 flex flex-col border border-[#333333] rounded-lg h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl text-white font-bold flex items-center">
          <Film className="text-primary mr-3" />
          Caméras de circulation
        </h2>
        
        <div className="flex items-center gap-2">
          {videoSources.map((source, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentSource(source);
                if (videoRef.current) {
                  videoRef.current.load();
                  setPlaying(false);
                  setCurrentTime(0);
                }
              }}
              className={`text-xs px-2 py-1 rounded ${
                currentSource.title === source.title 
                  ? 'bg-primary text-white' 
                  : 'bg-[#333333] text-gray-300 hover:bg-[#444444]'
              } transition-colors`}
            >
              Caméra {index + 1}
            </button>
          ))}
        </div>
      </div>
      
      <div className="relative flex-1 flex flex-col bg-black/50 rounded-lg overflow-hidden">
        {/* Video element */}
        <div className="relative flex-1">
          <video 
            ref={videoRef} 
            className="w-full h-full object-contain"
            poster="/assets/video-poster.svg"
          >
            <source src={currentSource.src} type={currentSource.type} />
            Votre navigateur ne prend pas en charge la lecture vidéo.
          </video>
          
          {/* Camera title overlay */}
          <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
            {currentSource.title}
          </div>
          
          {/* Loading indicator */}
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          
          {/* Play/Pause overlay */}
          <div 
            className="absolute inset-0 flex items-center justify-center cursor-pointer group"
            onClick={togglePlay}
          >
            {!playing && (
              <div className="bg-primary/80 rounded-full p-4 opacity-80 group-hover:opacity-100 transition-opacity">
                <Play className="w-8 h-8 text-white" />
              </div>
            )}
          </div>
        </div>
        
        {/* Controls */}
        <div className="p-3 bg-[#121212]">
          <div className="flex items-center gap-2">
            <Slider 
              value={[currentTime]} 
              min={0} 
              max={duration || 100}
              step={0.1}
              onValueChange={handleSeek}
              className="flex-1"
            />
            <span className="text-xs text-gray-400 whitespace-nowrap">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>
          
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-3">
              <button 
                className="text-white p-1 hover:text-primary transition-colors"
                onClick={togglePlay}
              >
                {playing ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </button>
              
              <div className="flex items-center gap-2 w-28">
                <button 
                  className="text-white p-1 hover:text-primary transition-colors"
                  onClick={toggleMute}
                >
                  {muted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <Slider
                  value={[volume]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={handleVolumeChange}
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}