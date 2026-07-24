import { z } from 'zod';

export const routableSlugSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use a single lowercase, hyphen-separated slug.');
