/**
@author ertdfgcvb
@title  Hotlink
@desc   Function hotlink example (GitHub)
        The code for the Open Simplex Noise function is downloaded from GitHub
        and evaluated through “new Function()”.
*/

import fetch from 'node-fetch'
// Don’t do this :)
fetch("https://raw.githubusercontent.com/blindman67/SimplexNoiseJS/master/simplexNoise.js")
.then(e => e.text())
.then(e => {
	const openSimplexNoise = new Function("return " + e)()
	noise3D = openSimplexNoise(Date.now()).noise3D
})

// Stub function
function noise3D() { return 0 }

const density = '...--'

export function main(coord, context, cursor, buffer) {
	const t = context.time * 0.0004
	const s = 0.1
	const x = coord.x * s
	const y = coord.y * s / context.metrics.aspect + t
	const i = Math.floor((noise3D(x, y, t) * 0.5 + 0.5) * density.length)
	return density[i]
}
