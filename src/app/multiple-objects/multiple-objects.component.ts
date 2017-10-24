import { Component, OnInit } from '@angular/core';



// Shader sources to be put on the GPU
let vertexShaderSource = `#version 300 es

// an attribute is an input (in) to a vertex shader.
// It will receive data from a buffer
in vec4 a_position;
in vec4 a_color;

out vec4 v_color;

// all shaders have a main function
void main() {

  // gl_Position is a special variable a vertex shader
  // is responsible for setting
  gl_Position = a_position;

  // Convert from clipspace to colorspace.
  // clipspace goes -1.0 to +1.0
  // Colorspace goes from 0.0 to 1.0
  v_color = a_position * 0.5 + 0.5;
}
`;
let fragmentShaderSource = `#version 300 es

// fragment shaders don't have a default precision so we need
// to pick one. mediump is a good default. It means "medium precision"
precision mediump float;

// we need to declare an output for the fragment shader
in vec4 v_color;

out vec4 outColor;

void main() {
  // Just set the output to a constant redish-purple
  outColor = v_color;
}
`;

@Component({
  selector: 'app-multiple-objects',
  templateUrl: './multiple-objects.component.html',
  styleUrls: ['./multiple-objects.component.scss']
})
export class MultipleObjectsComponent implements OnInit {
  // Canvas and WebGLRenderingContext
  gl: WebGLRenderingContext;
  program: WebGLProgram;
  canvas;

  constructor() { }

  ngOnInit() {
    this.initiateWebGL();
  }

  initiateWebGL() {
    // Shorten the variables
    let gl: WebGLRenderingContext = this.gl;
    let canvas: HTMLCanvasElement = this.canvas;
    // Setting up the global variables
    canvas = <HTMLCanvasElement>document.getElementById('webglCanvas');
    gl = <WebGLRenderingContext>canvas.getContext('webgl2');
    if (!gl) {
      alert('No WebGL2 available!')
    }

    // Create the shaders
    // Create the 2 shaders
    let vertexShader = this.compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
    let fragmentShader = this.compileShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);
    // Link those 2 shaders into a program
    this.program = this.createProgram(gl, vertexShader, fragmentShader);
  }


  /**
   * Creates and compiles a shader.
   *
   * @param {!WebGLRenderingContext} gl The WebGL Context.
   * @param {string} shaderSource The GLSL source code for the shader.
   * @param {number} shaderType The type of shader, VERTEX_SHADER or
   *     FRAGMENT_SHADER.
   * @return {!WebGLShader} The shader.
   */
  compileShader(gl: WebGLRenderingContext, shaderSource: string, shaderType: number): WebGLShader {
    // Create the shader object
    let shader: WebGLShader = gl.createShader(shaderType);

    // Set the shader source code.
    gl.shaderSource(shader, shaderSource);

    // Compile the shader
    gl.compileShader(shader);

    // Check if it compiled
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!success) {
      // Something went wrong during compilation; get the error
      throw "Unable to compile shader:" + gl.getShaderInfoLog(shader);
    }

    return shader;
  }

  /**
   * Creates a program from 2 shaders.
   *
   * @param {!WebGLRenderingContext) gl The WebGL context.
   * @param {!WebGLShader} vertexShader A vertex shader.
   * @param {!WebGLShader} fragmentShader A fragment shader.
   * @return {!WebGLProgram} A program.
   */
  createProgram(
    gl: WebGLRenderingContext,
    vertexShader: WebGLShader,
    fragmentShader: WebGLShader
  ): WebGLProgram {
    // create a program.
    var program = gl.createProgram();

    // attach the shaders.
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    // link the program.
    gl.linkProgram(program);

    // Check if it linked.
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!success) {
      // something went wrong with the link
      throw ("Failed to link program:" + gl.getProgramInfoLog(program));
    }

    return program;
  };
}