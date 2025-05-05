import 'core-js/stable';
import { Buffer } from 'buffer';

if (typeof window !== 'undefined') {
  // @ts-ignore
  window.Buffer = Buffer;
  // @ts-ignore
  window.process = { env: {} };
}
