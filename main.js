function main() {
	/** @type {HTMLCanvasElement} */
	const canvas = document.getElementById("canvas")
	const gl = canvas.getContext("webgl")

	var vertices = [
		0.5, 0.0,   0.0, 1.0, 1.0,	// A: kanan atas		CYAN
		0.0, -0.5,  1.0, 0.0, 1.0,	// B: bawah tengah		MAGENTA
		-0.5, 0.0,  1.0, 1.0, 0.0,	// C: kiri atas			YELLOW
		0.0, 0.5,   1.0, 1.0, 1.0,	// D: atas tengah		KEY
	]

	var buffer = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)

	// Vertex Shader - Poin
	var vertexShaderCode = `
	attribute vec2 aPosition;
	attribute vec3 aColor;
	uniform float uTheta;
	uniform vec2 uTranslation;
	varying vec3 vColor;
	void main() {
		float x = -sin(uTheta) * aPosition.x + cos(uTheta) * aPosition.y + uTranslation.x;
		float y = cos(uTheta) * aPosition.x + sin(uTheta) * aPosition.y + uTranslation.y;
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
	var freeze = false
	var translation = [0.0, 0.0]

	// Variabel pointer ke GLSL
	var uTheta = gl.getUniformLocation(shaderProgram, "uTheta")
	var uTranslation = gl.getUniformLocation(shaderProgram, "uTranslation")

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

	// Grafika interaktif
	// Mouse
	function onMouseClick(e) {
		freeze = !freeze
	}
	document.addEventListener("click", onMouseClick)

	function onKeyDown(e) {
		if (e.keyCode === 32) freeze = !freeze
	}
	function onKeyUp(e) {
		if (e.keyCode === 32) freeze = !freeze
	}
	document.addEventListener("keydown", onKeyDown)
	document.addEventListener("keyup", onKeyUp)

	var controller = {
		w: false,
		a: false,
		s: false,
		d: false
	}

	window.onkeydown = event => {
		if (event.key == 'w')
		{
			controller.w = true
		} 
		if (event.key == 'a')
		{
			controller.a = true
		}
		if (event.key == 's')
		{
			controller.s = true
		}
		if (event.key == 'd')
		{
			controller.d = true
		}
	}

	window.onkeyup = event => {
		if (event.key == 'w')
		{
			controller.w = false
		} 
		if (event.key == 'a')
		{
			controller.a = false
		}
		if (event.key == 's')
		{
			controller.s = false
		}
		if (event.key == 'd')
		{
			controller.d = false
		}
	}

	function render() {
		gl.clearColor(0.0, 0.0, 0.0, 0.03)
		gl.clear(gl.COLOR_BUFFER_BIT)

		if (!freeze) {
			theta += 0.1
		}

		if (controller.w) {
			translation[1] += 0.01
		}
		if (controller.a) {
			translation[0] -= 0.01
		}
		if (controller.s) {
			translation[1] -= 0.01
		}
		if (controller.d) {
			translation[0] += 0.01
		}

		gl.uniform1f(uTheta, theta)
		gl.uniform2fv(uTranslation, translation)

		gl.drawArrays(gl.TRIANGLE_FAN, 0, 4)
		requestAnimationFrame(render)
	}
	
	render()
}