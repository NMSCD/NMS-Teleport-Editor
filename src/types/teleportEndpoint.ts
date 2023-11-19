export const teleporterTypesEnum = {
  Base: 'Base',
  Spacestation: 'Spacestation',
  Atlas: 'Atlas',
  PlanetAwayFromShip: 'PlanetAwayFromShip',
  ExternalBase: 'ExternalBase',
  EmergencyGalaxyFix: 'EmergencyGalaxyFix',
  OnNexus: 'OnNexus',
  SpacestationFixPosition: 'SpacestationFixPosition',
  Settlement: 'Settlement',
  Freighter: 'Freighter',
  Frigate: 'Frigate',
} as const;

type ObjectValues<T> = T[keyof T];

export type TeleporterTypes = ObjectValues<typeof teleporterTypesEnum>;

export interface TeleportEndpoint {
  UniverseAddress: {
    RealityIndex: number;
    GalacticAddress: {
      VoxelX: number;
      VoxelY: number;
      VoxelZ: number;
      SolarSystemIndex: number;
      PlanetIndex: number;
    };
  };
  Position: [number, number, number];
  Facing: [number, number, number];
  TeleporterType: TeleporterTypes;
  Name: string;
  CalcWarpOffset: boolean;
  IsFeatured: boolean;
}
