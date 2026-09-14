import React from 'react';
import { motion } from 'motion/react';

interface SpideyChibiProps {
  className?: string;
  size?: number;
  mood?: 'happy' | 'swinging' | 'waving' | 'cheering';
  showSpeech?: string;
}

export const SpideyChibi: React.FC<SpideyChibiProps> = ({
  className = '',
  size = 220,
  mood = 'swinging',
  showSpeech,
}) => {
  return (
    <div className={`relative inline-flex flex-col items-center select-none ${className}`}>
      {/* Speech Bubble if present */}
      {showSpeech && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="relative mb-2 px-4 py-2 bg-white text-slate-900 rounded-2xl shadow-lg border-2 border-slate-900 text-xs sm:text-sm font-bold font-fredoka max-w-[220px] text-center"
        >
          {showSpeech}
          {/* Bubble tail */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-white"></div>
          <div className="absolute -bottom-[10px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[9px] border-t-slate-900 -z-10"></div>
        </motion.div>
      )}

      {/* Chibi Spider-Man Vector Artwork */}
      <motion.div
        animate={
          mood === 'swinging'
            ? { y: [-6, 6, -6], rotate: [-2, 2, -2] }
            : mood === 'cheering'
            ? { y: [0, -12, 0], scale: [1, 1.05, 1] }
            : { y: [-3, 3, -3] }
        }
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        style={{ width: size, height: size * 1.35 }}
        className="relative"
      >
        <svg
          viewBox="0 0 300 400"
          className="w-full h-full drop-shadow-[0_10px_20px_rgba(220,38,38,0.25)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Swing Web line */}
          <motion.path
            d="M 230 40 Q 210 10 200 -30"
            stroke="#ffffff"
            strokeWidth="3"
            strokeDasharray="4 2"
            opacity="0.8"
          />

          {/* Body & Limbs */}
          {/* Back Right Arm & Hand */}
          <g>
            <path
              d="M 195 185 C 235 150 250 110 260 85 C 263 78 275 88 268 98 C 255 125 240 160 205 198 Z"
              fill="#d92429"
              stroke="#111827"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            {/* Hand fingers */}
            <path d="M 258 84 C 265 65 272 65 268 80" stroke="#111827" strokeWidth="4" fill="#d92429" />
            <path d="M 267 80 C 278 72 284 80 273 90" stroke="#111827" strokeWidth="4" fill="#d92429" />
            <path d="M 270 90 C 285 92 285 102 272 104" stroke="#111827" strokeWidth="4" fill="#d92429" />
            {/* Glove webbing */}
            <path d="M 225 150 L 245 165" stroke="#111827" strokeWidth="2" />
            <path d="M 240 125 L 258 140" stroke="#111827" strokeWidth="2" />
          </g>

          {/* Left Leg (Bent) */}
          <g>
            <path
              d="M 115 230 C 95 240 75 255 70 270 C 65 285 90 305 110 300 C 130 295 135 270 135 245 Z"
              fill="#0d52a7"
              stroke="#111827"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            {/* Left Boot */}
            <path
              d="M 70 270 C 60 285 50 310 65 330 C 80 345 105 330 110 300 C 95 295 80 285 70 270 Z"
              fill="#d92429"
              stroke="#111827"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            {/* Boot webbing */}
            <path d="M 62 295 Q 75 305 90 305" stroke="#111827" strokeWidth="2" />
            <path d="M 68 315 Q 82 320 98 318" stroke="#111827" strokeWidth="2" />
          </g>

          {/* Right Leg (Extended in jump/swing) */}
          <g>
            <path
              d="M 175 230 C 205 245 235 270 230 300 C 220 315 200 310 185 285 C 175 270 170 250 165 240 Z"
              fill="#0d52a7"
              stroke="#111827"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            {/* Right Boot */}
            <path
              d="M 230 300 C 240 320 250 350 230 370 C 210 380 195 355 195 320 C 205 315 218 310 230 300 Z"
              fill="#d92429"
              stroke="#111827"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            {/* Boot webbing */}
            <path d="M 210 330 Q 225 335 238 325" stroke="#111827" strokeWidth="2" />
            <path d="M 205 350 Q 218 360 230 350" stroke="#111827" strokeWidth="2" />
          </g>

          {/* Torso & Suit */}
          <g>
            {/* Blue Side panels */}
            <path
              d="M 115 190 C 105 215 110 240 125 250 C 145 255 175 255 185 245 C 195 230 195 205 185 190 Z"
              fill="#0d52a7"
              stroke="#111827"
              strokeWidth="4"
            />
            {/* Red Chest Inset */}
            <path
              d="M 125 185 Q 150 180 175 185 Q 185 215 170 245 Q 150 250 130 245 Q 115 215 125 185 Z"
              fill="#d92429"
              stroke="#111827"
              strokeWidth="3.5"
            />
            {/* Chest Webbing Lines */}
            <path d="M 150 185 L 150 248" stroke="#111827" strokeWidth="2" />
            <path d="M 130 200 Q 150 208 170 200" stroke="#111827" strokeWidth="2" />
            <path d="M 128 218 Q 150 226 172 218" stroke="#111827" strokeWidth="2" />
            <path d="M 132 235 Q 150 240 168 235" stroke="#111827" strokeWidth="2" />

            {/* Black Chest Spider Emblem */}
            <ellipse cx="150" cy="212" rx="4" ry="7" fill="#111827" />
            <path d="M 150 207 L 140 198 M 150 207 L 160 198" stroke="#111827" strokeWidth="2" strokeLinecap="round" />
            <path d="M 150 211 L 138 211 M 150 211 L 162 211" stroke="#111827" strokeWidth="2" strokeLinecap="round" />
            <path d="M 150 215 L 141 224 M 150 215 L 159 224" stroke="#111827" strokeWidth="2" strokeLinecap="round" />
            <path d="M 150 217 L 144 230 M 150 217 L 156 230" stroke="#111827" strokeWidth="2" strokeLinecap="round" />
          </g>

          {/* Front Left Arm (Shooting Web pose) */}
          <g>
            <path
              d="M 125 195 C 95 210 60 230 40 240 C 32 244 20 232 26 220 C 45 190 85 180 115 185 Z"
              fill="#d92429"
              stroke="#111827"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            {/* Web shooter fingers (Spidey hand sign 🤟) */}
            <path d="M 25 220 C 15 212 8 220 18 230" stroke="#111827" strokeWidth="3.5" fill="#d92429" />
            <path d="M 20 232 C 10 235 12 245 22 242" stroke="#111827" strokeWidth="3.5" fill="#d92429" />
            <path d="M 28 244 C 20 252 28 260 36 250" stroke="#111827" strokeWidth="3.5" fill="#d92429" />
            <path d="M 38 245 C 42 262 55 260 48 245" stroke="#111827" strokeWidth="3.5" fill="#d92429" />
            {/* Glove Webbing */}
            <path d="M 60 205 L 50 225" stroke="#111827" strokeWidth="2" />
            <path d="M 80 195 L 70 215" stroke="#111827" strokeWidth="2" />

            {/* Little web stream from wrist */}
            <path
              d="M 22 235 Q 5 245 -20 255"
              stroke="#ffffff"
              strokeWidth="3.5"
              strokeLinecap="round"
              className="drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
            />
          </g>

          {/* Oversized Cute Chibi Head */}
          <g>
            {/* Head Base (Bright Spidey Red) */}
            <ellipse
              cx="150"
              cy="110"
              rx="75"
              ry="82"
              fill="#e62429"
              stroke="#111827"
              strokeWidth="5"
            />

            {/* Shading/Lighting highlight on forehead */}
            <path
              d="M 105 55 C 130 45 170 45 195 55"
              stroke="#ff6b6b"
              strokeWidth="4"
              strokeLinecap="round"
              opacity="0.7"
            />

            {/* Radial Web Grid Lines */}
            <g stroke="#111827" strokeWidth="2.5" opacity="0.95">
              {/* Vertical / Radial spokes originating from center between eyes */}
              <line x1="150" y1="110" x2="150" y2="30" />
              <line x1="150" y1="110" x2="115" y2="35" />
              <line x1="150" y1="110" x2="185" y2="35" />
              <line x1="150" y1="110" x2="85" y2="55" />
              <line x1="150" y1="110" x2="215" y2="55" />
              <line x1="150" y1="110" x2="78" y2="100" />
              <line x1="150" y1="110" x2="222" y2="100" />
              <line x1="150" y1="110" x2="85" y2="150" />
              <line x1="150" y1="110" x2="215" y2="150" />
              <line x1="150" y1="110" x2="115" y2="185" />
              <line x1="150" y1="110" x2="185" y2="185" />
              <line x1="150" y1="110" x2="150" y2="192" />

              {/* Concentric Web Arcs */}
              {/* Ring 1 */}
              <path d="M 125 75 Q 138 72 150 72 Q 162 72 175 75" fill="none" />
              <path d="M 100 85 Q 112 80 125 75" fill="none" />
              <path d="M 175 75 Q 188 80 200 85" fill="none" />
              {/* Ring 2 */}
              <path d="M 115 50 Q 132 46 150 46 Q 168 46 185 50" fill="none" />
              <path d="M 88 65 Q 102 56 115 50" fill="none" />
              <path d="M 185 50 Q 198 56 212 65" fill="none" />
              {/* Lower rings */}
              <path d="M 120 160 Q 135 165 150 165 Q 165 165 180 160" fill="none" />
              <path d="M 130 178 Q 140 181 150 181 Q 160 181 170 178" fill="none" />
            </g>

            {/* Left Eye (Bold Comic Stylized) */}
            <g>
              {/* Outer Black Border */}
              <path
                d="M 135 110 C 135 85 105 75 88 95 C 75 110 82 135 112 140 C 130 142 135 125 135 110 Z"
                fill="#111827"
              />
              {/* Inner White Lens */}
              <path
                d="M 130 110 C 130 89 106 81 94 98 C 84 110 90 130 112 134 C 126 136 130 122 130 110 Z"
                fill="#ffffff"
              />
              {/* Light blue soft reflection */}
              <path
                d="M 98 102 Q 112 95 124 100"
                stroke="#93c5fd"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </g>

            {/* Right Eye (Bold Comic Stylized) */}
            <g>
              {/* Outer Black Border */}
              <path
                d="M 165 110 C 165 85 195 75 212 95 C 225 110 218 135 188 140 C 170 142 165 125 165 110 Z"
                fill="#111827"
              />
              {/* Inner White Lens */}
              <path
                d="M 170 110 C 170 89 194 81 206 98 C 216 110 210 130 188 134 C 174 136 170 122 170 110 Z"
                fill="#ffffff"
              />
              {/* Light blue soft reflection */}
              <path
                d="M 202 102 Q 188 95 176 100"
                stroke="#93c5fd"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </g>
          </g>
        </svg>
      </motion.div>
    </div>
  );
};
