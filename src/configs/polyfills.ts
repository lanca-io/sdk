import { Buffer } from 'buffer'
import 'core-js/stable'

if (typeof window !== 'undefined') {
	window.Buffer = Buffer
	// @ts-expect-error: Polyfilling process for browsers
	window.process = { env: {} }
}
