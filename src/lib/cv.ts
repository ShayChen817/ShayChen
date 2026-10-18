import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { sitePath } from './url';

// Built at render time so replacing the PDF also invalidates cached download links.
const version = createHash('sha256')
  .update(readFileSync(resolve(process.cwd(), 'public/assets/ShayChen_CV.pdf')))
  .digest('hex').slice(0, 12);
export const cvUrl = sitePath(`/assets/ShayChen_CV.pdf?v=${version}`);
