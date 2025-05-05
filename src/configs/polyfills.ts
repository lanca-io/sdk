import 'core-js/stable'
import { Buffer } from 'buffer'

if (typeof window !== 'undefined') {
  window.Buffer = Buffer;
  // @ts-expect-error: Polyfilling process for browsers
  window.process = { env: {} }
}
