import type { TeleportEndpoint } from './teleportEndpoint';

export interface DialogProps {
  endpointData?: TeleportEndpoint;
}

export interface DialogWrapperProps extends DialogProps {
  label: string;
}
