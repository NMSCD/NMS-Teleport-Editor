import type { TeleportEndpoint, TeleporterTypes } from './types/teleportEndpoint';

type Pos = [number, number, number];

export function createEndpoint(
  name: string = '',
  teleporterType: TeleporterTypes = 'Spacestation',
  x: number = 0,
  y: number = 0,
  z: number = 0,
  galaxy: number = 0,
  systemIndex: number = 0,
  planet: number = 0,
  position: Pos = [0, 0, 0],
  facing: Pos = [0, 0, 0],
  isFeatured: boolean = false,
  calcWarpOffset: boolean = false
): TeleportEndpoint {
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
    Position: position,
    Facing: facing,
    TeleporterType: teleporterType,
    Name: name,
    CalcWarpOffset: calcWarpOffset,
    IsFeatured: isFeatured,
  };
}

export function endpointToAddress(endpoint: TeleportEndpoint) {
  const  {VoxelX, VoxelY, VoxelZ, SolarSystemIndex, PlanetIndex } = endpoint.UniverseAddress.GalacticAddress;
  return xyzToAddress(VoxelX, VoxelY, VoxelZ, SolarSystemIndex, PlanetIndex);
}

export function xyzToAddress(voxelX: number, voxelY: number, voxelZ: number, system_idx: number, planet_idx: number): string {
  let x_glyphs, y_glyphs, z_glyphs;
  if (voxelX < 0) {
    x_glyphs = voxelX + 4096;
  } else {
    x_glyphs = voxelX;
  }
  if (voxelZ < 0) {
    z_glyphs = voxelZ + 4096;
  } else {
    z_glyphs = voxelZ;
  }
  if (voxelY < 0) {
    y_glyphs = voxelY + 256;
  } else {
    y_glyphs = voxelY;
  }

  const hexAddress = [system_idx, y_glyphs, z_glyphs, x_glyphs];
  const address = hexAddress.map((coord) => coord.toString(16).toUpperCase());
  const glyphY = address.splice(1, 1)[0].padStart(2, '0');
  const paddedAddress = address.map((coord) => coord.padStart(3, '0'));
  paddedAddress.splice(1, 0, glyphY);

  return `${planet_idx}${paddedAddress.join('')}`;
}

export function addressToXYZ(input: string) {
  const glyphLength = 12;
  if (input.length < glyphLength) return;
  const coordinates = input.trim().length === 12 ? convertGlyphs(input) : convertCoords(input);
  const numberCoords = coordinates.map((coordinate) => parseInt(coordinate, 16));

  const x_glyphs = numberCoords[0];
  const y_glyphs = numberCoords[1];
  const z_glyphs = numberCoords[2]; // NoSonar this is stupid indexing
  const system_idx = numberCoords[3]; // NoSonar this is stupid indexing

  let VoxelX, VoxelY, VoxelZ;
  if (x_glyphs > 2047) {
    VoxelX = x_glyphs - 4096;
  } else {
    VoxelX = x_glyphs;
  }
  if (z_glyphs > 2047) {
    VoxelZ = z_glyphs - 4096;
  } else {
    VoxelZ = z_glyphs;
  }
  if (y_glyphs > 127) {
    VoxelY = y_glyphs - 256;
  } else {
    VoxelY = y_glyphs;
  }

  return {
    VoxelX,
    VoxelY,
    VoxelZ,
    SolarSystemIndex: system_idx,
  };
}

function convertGlyphs(glyphs: string): string[] {
  const x_glyphs = glyphs.substring(9, 12);
  const y_glyphs = glyphs.substring(4, 6);
  const z_glyphs = glyphs.substring(6, 9);
  const system_idx = glyphs.substring(1, 4);

  return [x_glyphs, y_glyphs, z_glyphs, system_idx];
}

function convertCoords(coords: string): string[] {
  const glyphs = coords2Glyphs(coords);
  return convertGlyphs(glyphs);

  function coords2Glyphs(coords: string): string {
    if (coords.length !== 19) return '';

    const X_Z_POS_SHIFT = 2049;
    const X_Z_NEG_SHIFT = 2047;
    const Y_POS_SHIFT = 129;
    const Y_NEG_SHIFT = 127;

    const x_coords = parseInt(coords.substring(0, 4), 16);
    const y_coords = parseInt(coords.substring(5, 9), 16);
    const z_coords = parseInt(coords.substring(10, 14), 16);
    const system_idx = parseInt(coords.substring(15, 19), 16);

    let portal_x = 0;
    let portal_y = 0;
    let portal_z = 0;
    if (x_coords < X_Z_NEG_SHIFT) {
      portal_x = x_coords + X_Z_POS_SHIFT;
    } else {
      portal_x = x_coords - X_Z_NEG_SHIFT;
    }
    if (z_coords < X_Z_NEG_SHIFT) {
      portal_z = z_coords + X_Z_POS_SHIFT;
    } else {
      portal_z = z_coords - X_Z_NEG_SHIFT;
    }
    if (y_coords < Y_NEG_SHIFT) {
      portal_y = y_coords + Y_POS_SHIFT;
    } else {
      portal_y = y_coords - Y_NEG_SHIFT;
    }

    const glyphs = [];
    glyphs[0] = '0';
    glyphs[1] = system_idx.toString(16).toUpperCase().padStart(3, '0');
    glyphs[2] = portal_y.toString(16).toUpperCase().padStart(2, '0');
    glyphs[3] = portal_z.toString(16).toUpperCase().padStart(3, '0');
    glyphs[4] = portal_x.toString(16).toUpperCase().padStart(3, '0');
    return glyphs.join('');
  }
}
