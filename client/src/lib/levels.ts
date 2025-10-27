export interface LevelConfig {
  id: number;
  name: string;
  danteStart: [number, number, number];
  exitPosition: [number, number, number];
  monsterSpeeds: [number, number, number]; // [lupo, leone, gatto]
  monsterStarts: [[number, number, number], [number, number, number], [number, number, number]];
  walls: Array<{
    position: [number, number, number];
    rotation?: [number, number, number];
    length: number;
  }>;
}

export const levels: LevelConfig[] = [
  // Level 1 - Tutorial facile
  {
    id: 1,
    name: "L'Entrata della Selva",
    danteStart: [-15, 0.9, -15],
    exitPosition: [18, 1, 18],
    monsterSpeeds: [3, 2.5, 2],
    monsterStarts: [
      [15, 0.75, 15],
      [-15, 0.75, 15],
      [0, 0.75, 15]
    ],
    walls: [
      // Outer walls
      { position: [0, 1.5, -20], rotation: [0, 0, 0], length: 40 },
      { position: [0, 1.5, 20], rotation: [0, 0, 0], length: 40 },
      { position: [-20, 1.5, 0], rotation: [0, Math.PI / 2, 0], length: 40 },
      { position: [20, 1.5, 0], rotation: [0, Math.PI / 2, 0], length: 40 },
      // Internal maze walls
      { position: [-10, 1.5, -15], rotation: [0, Math.PI / 2, 0], length: 10 },
      { position: [-10, 1.5, 5], rotation: [0, Math.PI / 2, 0], length: 20 },
      { position: [10, 1.5, -5], rotation: [0, Math.PI / 2, 0], length: 20 },
      { position: [0, 1.5, -10], rotation: [0, 0, 0], length: 15 },
      { position: [5, 1.5, 0], rotation: [0, 0, 0], length: 15 },
      { position: [-5, 1.5, 10], rotation: [0, 0, 0], length: 12 },
      { position: [15, 1.5, 10], rotation: [0, 0, 0], length: 10 },
      { position: [0, 1.5, 15], rotation: [0, Math.PI / 2, 0], length: 8 }
    ]
  },
  // Level 2 - Difficoltà media
  {
    id: 2,
    name: "Il Cerchio dei Lussuriosi",
    danteStart: [-18, 0.9, -18],
    exitPosition: [18, 1, 18],
    monsterSpeeds: [3.5, 3, 2.5],
    monsterStarts: [
      [18, 0.75, 15],
      [-15, 0.75, 18],
      [0, 0.75, 18]
    ],
    walls: [
      // Outer walls
      { position: [0, 1.5, -20], rotation: [0, 0, 0], length: 40 },
      { position: [0, 1.5, 20], rotation: [0, 0, 0], length: 40 },
      { position: [-20, 1.5, 0], rotation: [0, Math.PI / 2, 0], length: 40 },
      { position: [20, 1.5, 0], rotation: [0, Math.PI / 2, 0], length: 40 },
      // More complex maze
      { position: [-12, 1.5, -12], rotation: [0, Math.PI / 2, 0], length: 16 },
      { position: [12, 1.5, -12], rotation: [0, Math.PI / 2, 0], length: 16 },
      { position: [-12, 1.5, 12], rotation: [0, Math.PI / 2, 0], length: 16 },
      { position: [12, 1.5, 12], rotation: [0, Math.PI / 2, 0], length: 16 },
      { position: [0, 1.5, 0], rotation: [0, 0, 0], length: 24 },
      { position: [0, 1.5, 0], rotation: [0, Math.PI / 2, 0], length: 24 },
      { position: [-8, 1.5, 8], rotation: [0, 0, 0], length: 8 },
      { position: [8, 1.5, -8], rotation: [0, 0, 0], length: 8 },
      { position: [6, 1.5, 6], rotation: [0, Math.PI / 2, 0], length: 10 },
      { position: [-6, 1.5, -6], rotation: [0, Math.PI / 2, 0], length: 10 }
    ]
  },
  // Level 3 - Difficile
  {
    id: 3,
    name: "Il Girone dei Violenti",
    danteStart: [-18, 0.9, 0],
    exitPosition: [18, 1, 0],
    monsterSpeeds: [4, 3.5, 3],
    monsterStarts: [
      [18, 0.75, 18],
      [18, 0.75, -18],
      [-18, 0.75, 18]
    ],
    walls: [
      // Outer walls
      { position: [0, 1.5, -20], rotation: [0, 0, 0], length: 40 },
      { position: [0, 1.5, 20], rotation: [0, 0, 0], length: 40 },
      { position: [-20, 1.5, 0], rotation: [0, Math.PI / 2, 0], length: 40 },
      { position: [20, 1.5, 0], rotation: [0, Math.PI / 2, 0], length: 40 },
      // Spiral maze design
      { position: [-15, 1.5, -15], rotation: [0, 0, 0], length: 10 },
      { position: [-10, 1.5, -15], rotation: [0, Math.PI / 2, 0], length: 10 },
      { position: [-10, 1.5, -10], rotation: [0, 0, 0], length: 10 },
      { position: [-5, 1.5, -10], rotation: [0, Math.PI / 2, 0], length: 10 },
      { position: [-5, 1.5, -5], rotation: [0, 0, 0], length: 10 },
      { position: [0, 1.5, -5], rotation: [0, Math.PI / 2, 0], length: 10 },
      { position: [0, 1.5, 0], rotation: [0, 0, 0], length: 10 },
      { position: [5, 1.5, 0], rotation: [0, Math.PI / 2, 0], length: 10 },
      { position: [5, 1.5, 5], rotation: [0, 0, 0], length: 10 },
      { position: [10, 1.5, 5], rotation: [0, Math.PI / 2, 0], length: 10 },
      { position: [10, 1.5, 10], rotation: [0, 0, 0], length: 10 },
      { position: [15, 1.5, 10], rotation: [0, Math.PI / 2, 0], length: 10 }
    ]
  }
];

export function getLevel(levelNumber: number): LevelConfig {
  return levels[Math.min(levelNumber - 1, levels.length - 1)] || levels[0];
}
