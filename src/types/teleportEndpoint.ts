import type { endpointSchema, teleporterTypesEnum } from '@/variables/schema';
import type { z } from 'zod';

export type TeleporterTypes = z.infer<typeof teleporterTypesEnum>;
export type TeleportEndpoint = z.infer<typeof endpointSchema>;
