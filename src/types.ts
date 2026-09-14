export type AppStage = 'envelope' | 'games' | 'cake' | 'gallery' | 'wishes';

export interface PolaroidPhoto {
  id: string;
  url: string;
  caption: string;
  backNote: string;
  date: string;
  rotation: number;
}

export interface BirthdayConfig {
  boyfriendName: string;
  senderName: string;
  age: string;
  personalMessage: string;
  customAudioUrl?: string;
  customAudioName?: string;
}

export interface WebTarget {
  id: number;
  x: number;
  y: number;
  type: 'goblin' | 'octopus' | 'heart_balloon' | 'spidey_gift';
  points: number;
  isHit: boolean;
  speed: number;
}

export interface MemoryCard {
  id: number;
  pairId: number;
  name: string;
  icon: string;
  color: string;
  isFlipped: boolean;
  isMatched: boolean;
}
