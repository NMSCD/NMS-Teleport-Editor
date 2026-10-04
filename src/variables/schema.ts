import { z } from 'zod';

export const teleporterTypesEnum = z.enum([
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
]);

export const endpointSchema = z.object({
  UniverseAddress: z.object({
    RealityIndex: z.int(),
    GalacticAddress: z.object({
      VoxelX: z.int(),
      VoxelY: z.int(),
      VoxelZ: z.int(),
      SolarSystemIndex: z.int(),
      PlanetIndex: z.int(),
    }),
  }),
  Position: z.number().array().length(3),
  Facing: z.number().array().length(3),
  TeleporterType: teleporterTypesEnum,
  Name: z.string(),
  CalcWarpOffset: z.boolean(),
  IsFeatured: z.boolean(),
  IsFavourite: z.boolean(),
});
