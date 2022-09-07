function main() {
	/** @type {HTMLCanvasElement} */
	const canvas = document.getElementById("canvas")
	const gl = canvas.getContext("webgl")
	
	// Vertex Shader
	var vertexShaderCode = 
	"void main() {" +
	"}"
	const vertexShaderObject = gl.createShader(gl.VERTEX_SHADER)
	gl.shaderSource(vertexShaderObject, vertexShaderCode)
	gl.compileShader(vertexShaderObject) // sampai sini jadi .o
	
	// Fragment Shader
	var fragmentShaderCode = `
	void main() {
		
	}`
	const fragmentShaderObject = gl.createShader(gl.FRAGMENT_SHADER)
	gl.shaderSource(fragmentShaderObject, fragmentShaderCode)
	gl.compileShader(fragmentShaderObject) // sampai sini jadi .o

	var shaderProgram = gl.createProgram() // wadah dari .exe
	gl.attachShader(shaderProgram, vertexShaderObject)
	gl.attachShader(shaderProgram, fragmentShaderObject)
	gl.linkProgram(shaderProgram)
	gl.useProgram(shaderProgram)

	gl.clearColor(1.0, 1.0, 0, 1.0)

	gl.clear(gl.COLOR_BUFFER_BIT)
}