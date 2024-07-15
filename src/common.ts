import { GalacticCoordinate, PortalCode, VoxelCoordinate, type VoxelCoordinates } from '@nmscd/coordinate-conversion';
import type { TeleportEndpoint, TeleporterTypes } from './types/teleportEndpoint';

type Pos = [number, number, number];

interface EndpointArgs {
  name: string;
  teleporterType: TeleporterTypes;
  x: number;
  y: number;
  z: number;
  galaxy: number;
  systemIndex: number;
  planet: number;
}

const defaultEndpointArgs: EndpointArgs = {
  name: '',
  teleporterType: 'Spacestation',
  x: 0,
  y: 0,
  z: 0,
  galaxy: 0,
  systemIndex: 0,
  planet: 0,
};

export function createEndpoint(
  { name, teleporterType, x, y, z, galaxy, systemIndex, planet }: EndpointArgs = structuredClone(defaultEndpointArgs)
): TeleportEndpoint {
  const defaultFacing: Pos = [1, 1, 1];
  return {
    UniverseAddress: {
      RealityIndex: galaxy,
      GalacticAddress: {
        VoxelX: x,
        VoxelY: y,
        VoxelZ: z,
        SolarSystemIndex: systemIndex,
        PlanetIndex: planet,
      },
    },
    Position: defaultFacing,
    Facing: defaultFacing,
    TeleporterType: teleporterType,
    Name: name,
    CalcWarpOffset: false,
    IsFeatured: false,
  };
}

const xyzToGlyphs = (voxelCoords: VoxelCoordinates): string => VoxelCoordinate(voxelCoords).toGlyph().value.code;

export function endpointToGlyphs(endpoint: TeleportEndpoint) {
  const { VoxelX, VoxelY, VoxelZ, SolarSystemIndex, PlanetIndex } = endpoint.UniverseAddress.GalacticAddress;
  return xyzToGlyphs({ VoxelX, VoxelY, VoxelZ, SolarSystemIndex, PlanetIndex });
}

export function addressToXYZ(input: string) {
  const glyphLength = 12;
  if (input.length < glyphLength) return;
  const coordinates =
    input.trim().length === glyphLength ? PortalCode({ code: input }).toGalacticCoordinates().value.code : input;

  return GalacticCoordinate({ code: coordinates }).toVoxel().value;
}
