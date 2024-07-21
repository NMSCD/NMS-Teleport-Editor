export type TeleporterTypes =
  | 'Base'
  | 'Spacestation'
  | 'Atlas'
  | 'PlanetAwayFromShip'
  | 'ExternalBase'
  | 'EmergencyGalaxyFix'
  | 'OnNexus'
  | 'SpacestationFixPosition'
  | 'Settlement'
  | 'Freighter'
  | 'Frigate';

export const teleporterTypes: TeleporterTypes[] = [
  'Atlas',
  'Base',
  'EmergencyGalaxyFix',
  'ExternalBase',
  'Freighter',
  'Frigate',
  'OnNexus',
  'PlanetAwayFromShip',
  'Settlement',
  'Spacestation',
  'SpacestationFixPosition',
];

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
