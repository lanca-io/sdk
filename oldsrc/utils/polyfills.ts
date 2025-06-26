import { Buffer } from 'node:buffer'
import 'core-js/stable'

if (typeof window !== 'undefined') {
  window.global = window
  window.Buffer = Buffer
}
