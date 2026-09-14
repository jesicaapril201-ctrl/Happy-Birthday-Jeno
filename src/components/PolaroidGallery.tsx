import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Upload, RotateCw, Heart, Sparkles, ArrowRight, Eye, Check, RotateCcw } from 'lucide-react';
import { PolaroidPhoto } from '../types';
import { soundEngine } from '../utils/audioSynthesizer';

interface PolaroidGalleryProps {
  photos: PolaroidPhoto[];
  onUpdatePhotos: (photos: PolaroidPhoto[]) => void;
  onRestart: () => void;
  onBackToLetter?: () => void;
}

export const PolaroidGallery: React.FC<PolaroidGalleryProps> = ({
  photos,
  onUpdatePhotos,
  onRestart,
  onBackToLetter,
}) => {
  const [flippedIds, setFlippedIds] = useState<Record<string, boolean>>({});
  const [activePhotoModal, setActivePhotoModal] = useState<PolaroidPhoto | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadTargetId, setUploadTargetId] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  const toggleFlip = (id: string) => {
    soundEngine.playThwip();
    setFlippedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleUploadClick = (photoId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setUploadTargetId(photoId);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && uploadTargetId) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        const updated = photos.map((p) => (p.id === uploadTargetId ? { ...p, url: base64 } : p));
        onUpdatePhotos(updated);
        soundEngine.playChime();
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-6 px-4 flex flex-col items-center select-none">
      {/* Hidden file input for uploading custom polaroids */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/20 border border-red-500/40 text-red-300 font-bold font-fredoka text-xs sm:text-sm">
          <Camera className="w-4 h-4 text-red-400" />
          SPIDEY POLAROID GALLERY (3 FOTO KENANGAN)
        </span>
        <h2 className="font-bangers text-4xl sm:text-6xl text-white tracking-wide mt-3 drop-shadow">
          MOMEN INDAH BERSAMA JENO 📸❤️
        </h2>
        <p className="text-slate-300 text-sm font-fredoka mt-1 max-w-lg mx-auto">
          Klik foto untuk membalik & membaca pesan rahasia di belakangnya. Kamu juga bisa mengganti foto dengan foto asli kalian berdua!
        </p>
      </motion.div>

      {/* Polaroid Gallery Grid (3 Photos) */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-6 my-4 px-2">
        {photos.map((photo, index) => {
          const isFlipped = !!flippedIds[photo.id];

          return (
            <div
              key={photo.id}
              className="relative flex flex-col items-center perspective-[1000px]"
            >
              {/* Cute Washi Tape at top */}
              <div
                className={`absolute -top-3.5 z-30 w-24 h-6 ${
                  index === 0
                    ? 'bg-red-500/80 -rotate-3'
                    : index === 1
                    ? 'bg-blue-500/80 rotate-2'
                    : 'bg-amber-500/80 -rotate-2'
                } backdrop-blur-sm border border-white/40 shadow-sm opacity-90`}
                style={{
                  clipPath: 'polygon(5% 0%, 95% 0%, 100% 100%, 0% 100%)',
                }}
              ></div>

              {/* Polaroid Frame */}
              <motion.div
                whileHover={{ scale: 1.03, y: -4 }}
                animate={{
                  rotate: photo.rotation,
                  rotateY: isFlipped ? 180 : 0,
                }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                style={{ transformStyle: 'preserve-3d' }}
                onClick={() => toggleFlip(photo.id)}
                className="w-full max-w-[280px] bg-white rounded-lg p-3 pb-5 shadow-[0_15px_35px_rgba(0,0,0,0.6)] border border-slate-200 cursor-pointer relative min-h-[350px] flex flex-col justify-between"
              >
                {/* FRONT OF POLAROID */}
                <div
                  className="w-full h-full flex flex-col justify-between"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  {/* Photo area */}
                  <div className="relative w-full aspect-square bg-slate-100 rounded overflow-hidden border border-slate-300 shadow-inner group">
                    <img
                      src={photo.url}
                      alt={photo.caption}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Cute Spider-Man Sticker overlay */}
                    <div className="absolute top-2 right-2 bg-red-600/90 text-white rounded-full p-1 shadow-md border border-white/60">
                      <span className="text-xs">🕷️</span>
                    </div>

                    {/* Quick upload hover badge */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={(e) => handleUploadClick(photo.id, e)}
                        className="px-2.5 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold font-fredoka flex items-center gap-1 shadow cursor-pointer"
                        title="Upload Foto Sendiri"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        Ganti Foto
                      </button>
                    </div>
                  </div>

                  {/* Polaroid Chin / Caption */}
                  <div className="pt-4 px-1 text-center">
                    <p className="font-caveat text-xl sm:text-2xl text-slate-900 leading-tight">
                      "{photo.caption}"
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-slate-600 font-fredoka mt-2 border-t border-slate-200 pt-1.5">
                      <span>{photo.date}</span>
                      <span className="text-red-500 flex items-center gap-1">
                        <RotateCw className="w-3 h-3" /> Balik Kartu
                      </span>
                    </div>
                  </div>
                </div>

                {/* BACK OF POLAROID (Secret Handwritten Note) */}
                <div
                  className="absolute inset-0 bg-[#fffef5] rounded-lg p-5 flex flex-col justify-between border-2 border-dashed border-red-300 shadow-inner text-slate-800"
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                  }}
                >
                  <div className="border-b border-red-200 pb-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-red-600 font-bangers tracking-wide flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5 fill-red-500" />
                        CATATAN RAHASIA #{index + 1}
                      </span>
                      <span className="text-[11px] text-slate-500 font-fredoka">
                        Balik ↺
                      </span>
                    </div>
                  </div>

                  {/* Note body */}
                  <div className="my-auto py-2">
                    <p className="font-caveat text-xl sm:text-2xl text-slate-800 leading-relaxed text-center">
                      "{photo.backNote}"
                    </p>
                  </div>

                  {/* Footer on the back */}
                  <div className="border-t border-red-200 pt-2 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-500 font-fredoka flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> Dari Pacarmu Tersayang
                    </span>
                    <span className="text-red-500 font-bangers text-sm">SPIDEY & MJ ❤️</span>
                  </div>
                </div>
              </motion.div>

              {/* Action Buttons under each card */}
              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={(e) => handleUploadClick(photo.id, e)}
                  className="px-3 py-1 bg-slate-900/80 hover:bg-red-600 border border-slate-700 hover:border-red-500 rounded-full text-white text-[11px] font-fredoka font-semibold flex items-center gap-1 transition shadow cursor-pointer"
                >
                  <Upload className="w-3 h-3" /> Ganti Foto
                </button>
                <button
                  onClick={() => toggleFlip(photo.id)}
                  className="px-3 py-1 bg-slate-900/80 hover:bg-blue-600 border border-slate-700 hover:border-blue-500 rounded-full text-white text-[11px] font-fredoka font-semibold flex items-center gap-1 transition shadow cursor-pointer"
                >
                  <RotateCw className="w-3 h-3" /> Balik
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Buttons at the bottom */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
        {onBackToLetter && (
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              soundEngine.playThwip();
              onBackToLetter();
            }}
            className="flex items-center gap-2 px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bangers text-xl tracking-wide rounded-2xl shadow-lg border-2 border-slate-700 cursor-pointer transition"
          >
            <span>💌 KEMBALI KE SURAT UCAPAN</span>
          </motion.button>
        )}

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => {
            soundEngine.playThwip();
            onRestart();
          }}
          className="flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-red-600 via-red-500 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-bangers text-xl tracking-wide rounded-2xl shadow-2xl comic-border-blue cursor-pointer transition"
        >
          <RotateCcw className="w-5 h-5" />
          <span>ULANGI PETUALANGAN DARI AMPLOP ↺</span>
        </motion.button>
      </div>
    </div>
  );
};
