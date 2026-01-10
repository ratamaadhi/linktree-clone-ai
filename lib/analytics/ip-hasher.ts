import { createHash } from 'crypto';

export function hashIP(ipAddress: string): string {
  const hash = createHash('sha256');
  hash.update(ipAddress);
  return hash.digest('hex');
}
