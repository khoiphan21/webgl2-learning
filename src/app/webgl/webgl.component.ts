import { Component, OnInit } from '@angular/core';

// Global variables for webGL and the canvas
let canvas;
let gl;

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
  selector: 'app-webgl',
  templateUrl: './webgl.component.html',
  styleUrls: ['./webgl.component.scss']
})
export class WebglComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
    this.initiateWebGL();
  }

  initiateWebGL() {
    // Setting up the global variables
    canvas = document.getElementById('webglCanvas');
    gl = canvas.getContext('webgl2');
    if (!gl) {
      alert('No WebGL2 available!')
    }

    // Create the 2 shaders
    let vertexShader = this.createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    let fragmentShader = this.createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)

    // Link those 2 shaders into a program
    let program = this.createProgram(gl, vertexShader, fragmentShader);

    // Start supplying data to the GLSL program
    // Look up the location of the attribute for the 
    // program we just created
    let positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
    // Now look up position for the color attribute
    let colorLocation = gl.getAttribLocation(program, 'a_color');
    // Create a buffer where attributes get their data from
    let positionBuffer = gl.createBuffer();
    // Bind the position buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    
    // Now we put data in that buffer by referencing it through the bind pont
    // Three 2D points
    let positions = [
      0, 0,
      0, 0.5,
      0.7, 0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    // Now we need to tell the attribute how to get data out of the buffer
    let vao = gl.createVertexArray(); // Vertex Array Object
    // And make this the current vertex array
    gl.bindVertexArray(vao);
    
    // Setup the attributes in the vertex array
    // Turn the attribute on
    gl.enableVertexAttribArray(positionAttributeLocation);
    // also for color
    gl.enableVertexAttribArray(colorLocation);

    // Now specify how to pull the data out
    let size = 2; // 2 components per iteration
    let type = gl.FLOAT; // the data is 32 bit floats
    let normalize = false; // don't normalize the data
    let stride = 0; // 0 = move forward size * sizeof(type) each iteration
    let offset = 0; // start at the beginning of the buffer
    gl.vertexAttribPointer(
      positionAttributeLocation, size, type, normalize, stride, offset
    )
    // Also for color


    // Resize canvas
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Clear the canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Tell WebGL which shader program to execute
    gl.useProgram(program);
    // Tell WebGL which set of buffers to use and how to pull data out of those buffers
    gl.bindVertexArray(vao);

    // FINALLY ASK WEBGL TO EXECUTE THE GLSL PROGRAM
    let primitiveType = gl.TRIANGLES;
    let count = 3;
    offset = 0;
    gl.drawArrays(primitiveType, offset, count);
  }

  createProgram(gl, vertexShader, fragmentShader) {
    let program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
      return program;
    }

    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
  }

  /**
   * Create a WebGL2 shader
   * @param gl the WebGL2 library variable
   * @param type 
   * @param source 
   */
  createShader(gl, type, source) {
    let shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
      return shader;
    }

    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
  }

}
