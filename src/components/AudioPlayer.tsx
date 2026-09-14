import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music, Upload, Play, Pause, Disc } from 'lucide-react';
import { soundEngine } from '../utils/audioSynthesizer';

interface AudioPlayerProps {
  customAudioUrl?: string;
  onAudioUpload?: (fileUrl: string, fileName: string) => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  customAudioUrl,
  onAudioUpload,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [songTitle, setSongTitle] = useState('Melodi Ulang Tahun (Spidey)');
  const [isCustom, setIsCustom] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const customAudioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize custom audio if URL is provided
  useEffect(() => {
    if (customAudioUrl) {
      if (customAudioRef.current) {
        customAudioRef.current.pause();
      }
      const audio = new Audio(customAudioUrl);
      audio.loop = true;
      customAudioRef.current = audio;
      setIsCustom(true);
      setSongTitle('Suara/Musik Spesial dari Kamu ❤️');
    }
  }, [customAudioUrl]);

  const togglePlay = () => {
    if (isPlaying) {
      if (isCustom && customAudioRef.current) {
        customAudioRef.current.pause();
      } else {
        soundEngine.stopBgm();
      }
      setIsPlaying(false);
    } else {
      if (isCustom && customAudioRef.current) {
        customAudioRef.current.play().catch(() => {});
      } else {
        soundEngine.startBirthdayBGM();
      }
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundEngine.setMuted(nextMuted);
    if (customAudioRef.current) {
      customAudioRef.current.muted = nextMuted;
    }
    if (nextMuted && isPlaying) {
      togglePlay();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (customAudioRef.current) {
        customAudioRef.current.pause();
      }
      const audio = new Audio(url);
      audio.loop = true;
      customAudioRef.current = audio;
      setIsCustom(true);
      setSongTitle(file.name.replace(/\.[^/.]+$/, ''));
      setIsPlaying(true);
      audio.play().catch(() => {});
      soundEngine.stopBgm();

      if (onAudioUpload) {
        onAudioUpload(url, file.name);
      }
      setShowUploadModal(false);
    }
  };

  return (
    <>
      {/* Floating Audio Bar / Badge */}
      <div className="fixed top-3 right-3 z-50 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md border-2 border-red-500/60 rounded-full px-3 py-1.5 shadow-xl text-white">
        {/* Spinning Vinyl icon */}
        <button
          onClick={togglePlay}
          className="relative flex items-center justify-center w-8 h-8 rounded-full bg-red-600 hover:bg-red-500 transition-transform active:scale-95 text-white shadow-md cursor-pointer"
          title={isPlaying ? 'Jeda Musik' : 'Putar Musik'}
          aria-label={isPlaying ? 'Jeda Musik' : 'Putar Musik'}
        >
          <Disc
            className={`w-5 h-5 ${isPlaying ? 'animate-spin' : ''}`}
            style={{ animationDuration: '3s' }}
          />
        </button>

        {/* Info & Play/Pause */}
        <div className="hidden sm:flex flex-col text-left max-w-[130px] overflow-hidden">
          <span className="text-[11px] font-bold text-red-400 truncate flex items-center gap-1 font-fredoka">
            <Music className="w-3 h-3 flex-shrink-0 animate-pulse" />
            {isCustom ? 'Audio Khusus' : 'Musik BGM'}
          </span>
          <span className="text-[10px] text-slate-300 truncate">{songTitle}</span>
        </div>

        {/* Small Play/Pause Button */}
        <button
          onClick={togglePlay}
          className="p-1 rounded-full text-slate-300 hover:text-white hover:bg-slate-800 transition"
          aria-label="Play or pause"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>

        {/* Mute Button */}
        <button
          onClick={toggleMute}
          className="p-1 rounded-full text-slate-300 hover:text-white hover:bg-slate-800 transition"
          title={isMuted ? 'Nyalakan Suara' : 'Bisukan Suara'}
          aria-label={isMuted ? 'Nyalakan Suara' : 'Bisukan Suara'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
        </button>

        {/* Upload Button */}
        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-1 text-[11px] bg-red-700/80 hover:bg-red-600 px-2 py-1 rounded-full text-white font-medium transition cursor-pointer"
          title="Upload Lagu/Suara Kamu"
        >
          <Upload className="w-3 h-3" />
          <span className="hidden md:inline">Ganti Lagu</span>
        </button>
      </div>

      {/* Upload Audio Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border-2 border-red-500 rounded-2xl max-w-md w-full p-6 shadow-2xl relative text-white">
            <h3 className="font-bangers text-2xl text-red-400 tracking-wide mb-2 flex items-center gap-2">
              <Music className="w-6 h-6 text-red-500" />
              Upload Suara / Musik Spesial
            </h3>
            <p className="text-sm text-slate-300 mb-5 leading-relaxed font-fredoka">
              Kamu bisa memasukkan rekaman suara ucapan kamu (voice note) atau lagu favorit berdua dalam format MP3/WAV/M4A. Musik akan berputar otomatis sebagai latar suasana!
            </p>

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-red-500/60 hover:border-red-400 rounded-xl p-6 text-center cursor-pointer bg-slate-800/60 hover:bg-slate-800 transition group"
            >
              <Upload className="w-10 h-10 text-red-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-semibold text-slate-200">Klik di sini untuk memilih file audio</p>
              <p className="text-xs text-slate-400 mt-1">Mendukung MP3, WAV, AAC, M4A, OGG</p>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="audio/*"
              className="hidden"
            />

            <div className="mt-6 flex justify-between items-center gap-3">
              {isCustom && (
                <button
                  type="button"
                  onClick={() => {
                    if (customAudioRef.current) {
                      customAudioRef.current.pause();
                    }
                    setIsCustom(false);
                    setSongTitle('Melodi Ulang Tahun (Spidey)');
                    soundEngine.startBirthdayBGM();
                    setIsPlaying(true);
                    setShowUploadModal(false);
                  }}
                  className="text-xs text-slate-400 hover:text-red-400 underline"
                >
                  Kembali ke Melodi Default
                </button>
              )}
              <div className="ml-auto">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-sm font-bold rounded-xl transition cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
