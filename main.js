function main() {
	/** @type {HTMLCanvasElement} */
	const canvas = document.getElementById("canvas")
	const gl = canvas.getContext("webgl")
	
	var vertices = [
		0.0, 0.0,		// tengah
		-0.5, 0.5,	// kiri atas
		0.0, 1.0,		// atas
		0.5, 0.5,		// kanan atas
		0.0, 0.0, 	// tengah
		0.5, -0.5,	// kanan bawah
		0.0, -1.0,	// bawah
		-0.5, -0.5,	// kiri bawah
		0.0, 0.0		// tengah
	]

	var buffer = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)

	// Vertex Shader
	var vertexShaderCode = `
	attribute vec2 aPosition;
	void main() {
		float x = aPosition.x;
		float y = aPosition.y;
		gl_PointSize = 10.0;
		gl_Position = vec4(x, y, 0.0, 1.0);
	}
	`
	const vertexShaderObject = gl.createShader(gl.VERTEX_SHADER)
	gl.shaderSource(vertexShaderObject, vertexShaderCode)
	gl.compileShader(vertexShaderObject) // sampai sini jadi .o
	
	// Fragment Shader
	var fragmentShaderCode = `
	precision mediump float;
	void main() {
		float r = 0.0;
		float g = 0.0;
		float b = 1.0;
		gl_FragColor = vec4(r, g, b, 1.0);
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

	// Mengajari GPU cara mengoleksi nilai posisi dari ARRAY_BUFFER untuk setiap verteks yang diproses
	var aPosition = gl.getAttribLocation(shaderProgram, "aPosition")
	gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0)
	gl.enableVertexAttribArray(aPosition)

	gl.clearColor(1.0, 0.65, 0, 1.0)

	gl.clear(gl.COLOR_BUFFER_BIT)

	gl.drawArrays(gl.TRIANGLE_FAN, 0, 8)
}