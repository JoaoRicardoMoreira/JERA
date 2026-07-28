export type SettlementDistrictKey =
  | 'GREAT_HALL'
  | 'GRANARY'
  | 'HARBOR'
  | 'MARKET'
  | 'PALISADE'
  | 'HALL_OF_ACHIEVEMENTS'
  | 'LIGHTHOUSE';

export interface SettlementHotspot {
  key: SettlementDistrictKey;
  x: number;
  y: number;
  width: number;
  height: number;
}

const hotspotSizes: Record<SettlementDistrictKey, { width: number; height: number }> = {
  GREAT_HALL: { width: 14, height: 22 },
  GRANARY: { width: 10, height: 16 },
  HARBOR: { width: 17, height: 19 },
  MARKET: { width: 11, height: 17 },
  PALISADE: { width: 17, height: 23 },
  HALL_OF_ACHIEVEMENTS: { width: 10, height: 15 },
  LIGHTHOUSE: { width: 8, height: 18 },
};

type Position = { x: number; y: number };

function createHotspots(positions: Record<SettlementDistrictKey, Position>): SettlementHotspot[] {
  return (Object.entries(positions) as [SettlementDistrictKey, Position][]).map(
    ([key, position]) => ({
      key,
      x: position.x,
      y: position.y,
      width: hotspotSizes[key].width,
      height: hotspotSizes[key].height,
    }),
  );
}

const stageHotspots: Record<string, SettlementHotspot[]> = {
  camp: createHotspots({
    GREAT_HALL: { x: 57, y: 55 },
    GRANARY: { x: 65, y: 66 },
    HARBOR: { x: 34, y: 74 },
    MARKET: { x: 51, y: 65 },
    PALISADE: { x: 77, y: 55 },
    HALL_OF_ACHIEVEMENTS: { x: 59, y: 68 },
    LIGHTHOUSE: { x: 42, y: 67 },
  }),
  'nascent-village': createHotspots({
    GREAT_HALL: { x: 75, y: 50 },
    GRANARY: { x: 83, y: 66 },
    HARBOR: { x: 34, y: 73 },
    MARKET: { x: 59, y: 66 },
    PALISADE: { x: 72, y: 76 },
    HALL_OF_ACHIEVEMENTS: { x: 68, y: 48 },
    LIGHTHOUSE: { x: 47, y: 63 },
  }),
  'viking-village': createHotspots({
    GREAT_HALL: { x: 73, y: 54 },
    GRANARY: { x: 82, y: 67 },
    HARBOR: { x: 25, y: 73 },
    MARKET: { x: 59, y: 69 },
    PALISADE: { x: 72, y: 79 },
    HALL_OF_ACHIEVEMENTS: { x: 85, y: 42 },
    LIGHTHOUSE: { x: 47, y: 61 },
  }),
  'prosperous-port': createHotspots({
    GREAT_HALL: { x: 76, y: 51 },
    GRANARY: { x: 84, y: 66 },
    HARBOR: { x: 25, y: 73 },
    MARKET: { x: 62, y: 68 },
    PALISADE: { x: 69, y: 79 },
    HALL_OF_ACHIEVEMENTS: { x: 86, y: 43 },
    LIGHTHOUSE: { x: 48, y: 56 },
  }),
  'northern-domain': createHotspots({
    GREAT_HALL: { x: 78, y: 53 },
    GRANARY: { x: 87, y: 67 },
    HARBOR: { x: 29, y: 72 },
    MARKET: { x: 64, y: 67 },
    PALISADE: { x: 69, y: 80 },
    HALL_OF_ACHIEVEMENTS: { x: 88, y: 37 },
    LIGHTHOUSE: { x: 47, y: 53 },
  }),
  'great-kingdom': createHotspots({
    GREAT_HALL: { x: 78, y: 52 },
    GRANARY: { x: 88, y: 65 },
    HARBOR: { x: 31, y: 72 },
    MARKET: { x: 64, y: 66 },
    PALISADE: { x: 70, y: 80 },
    HALL_OF_ACHIEVEMENTS: { x: 88, y: 34 },
    LIGHTHOUSE: { x: 48, y: 53 },
  }),
};

export function getSettlementHotspots(stageAssetKey: string): SettlementHotspot[] {
  return stageHotspots[stageAssetKey] ?? stageHotspots.camp;
}
