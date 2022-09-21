function main() {
	/** @type {HTMLCanvasElement} */
	const canvas = document.getElementById("canvas")
	const gl = canvas.getContext("webgl")
	
	var vertices = [
		0.5, 0.5, 0.0, 1.0, 1.0,		// A: kanan atas		CYAN
		0.0, 0.0, 1.0, 0.0, 1.0,		// B: bawah tengah		MAGENTA
		-0.5, 0.5, 1.0, 1.0, 0.0,		// C: kiri atas			YELLOW
		0.0, 1.0, 1.0, 1.0, 1.0			// D: atas tengah		KEY
	]

	var buffer = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)

	// Vertex Shader - Poin
	var vertexShaderCode = `
	attribute vec2 aPosition;
	attribute vec3 aColor;
	uniform float uTheta;
	varying vec3 vColor;
	void main() {
		float x = -sin(uTheta) * aPosition.x + cos(uTheta) * aPosition.y;
		float y = cos(uTheta) * aPosition.x + sin(uTheta) * aPosition.y;
		gl_Position = vec4(x, y, 0.0, 1.0);
		vColor = aColor;
	}
	`
	const vertexShaderObject = gl.createShader(gl.VERTEX_SHADER)
	gl.shaderSource(vertexShaderObject, vertexShaderCode)
	gl.compileShader(vertexShaderObject) // sampai sini jadi .o
	
	// Fragment Shader - Color
	var fragmentShaderCode = `
	precision mediump float;
	varying vec3 vColor;
	void main() {
		gl_FragColor = vec4(vColor, 1.0);
	}
	`
	const fragmentShaderObject = gl.createShader(gl.FRAGMENT_SHADER)
	gl.shaderSource(fragmentShaderObject, fragmentShaderCode)
	gl.compileShader(fragmentShaderObject) // sampai sini jadi .o

	var shaderProgram = gl.createProgram() // wadah dari .exe
	gl.attachShader(shaderProgram, vertexShaderObject)
	gl.attachShader(shaderProgram, fragmentShaderObject)
	gl.linkProgram(shaderProgram)
	gl.useProgram(shaderProgram)

	// Variabel lokal
	var theta = 0.0

	// Variabel pointer ke GLSL
	var uThete = gl.getUniformLocation(shaderProgram, "uTheta")

	// Mengajari GPU cara mengoleksi nilai posisi dari ARRAY_BUFFER untuk setiap verteks yang diproses
	var aPosition = gl.getAttribLocation(shaderProgram, "aPosition")
	gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 
		5 * Float32Array.BYTES_PER_ELEMENT, 
		0)
	gl.enableVertexAttribArray(aPosition)

	var aColor = gl.getAttribLocation(shaderProgram, "aColor")
	gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 
		5 * Float32Array.BYTES_PER_ELEMENT, 
		2 * Float32Array.BYTES_PER_ELEMENT)
	gl.enableVertexAttribArray(aColor)

	function render() {
		gl.clearColor(0.0, 0.0, 0.0, 0.1)
		gl.clear(gl.COLOR_BUFFER_BIT)
		theta += 0.05
		gl.uniform1f(uThete, theta)
		gl.drawArrays(gl.TRIANGLE_FAN, 0, 4)
	}
	setInterval(render, 1000/60)
}