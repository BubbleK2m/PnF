"use strict"

function Shape(){
  // Geometric variables
    this.vertices=Shape.vertices;
    this.indices=Shape.indices;

    this.vertexBuffer=gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
    this.vertexBuffer.itemSize = 3;
    this.vertexBuffer.numItems = 4;

    this.drawListBuffer=gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.drawListBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);
    this.drawListBuffer.itemSize = 1;
    this.drawListBuffer.numItems = 6;

    this.color=[0.5,0.7,0.5,1];
}

Shape.vertices=[
    -0.5, -0.5, 0.0,//left down
    -0.5, 0.5, 0.0,//left up
    0.5, 0.5, 0.0,//right up
    0.5, -0.5, 0.0,//right down
];

Shape.indices=[0, 1, 2, 0, 2, 3];

Shape.prototype.setColor=function(r,g,b,a) {
  this.color=[r,g,b,a];
}

Shape.prototype.setVertices=function(vertices) {
  this.vertices=[];
  for(let i=0;i<vertices.length;i++){
    this.vertices[i]=vertices[i];
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
  this.vertexBuffer.numItems = vertices.length;
}

Shape.prototype.setIndices=function(indices) {
  this.indices=[];
  for(let i=0;i<indices.length;i++){
    this.indices[i]=indices[i];
  }

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.drawListBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);
  this.drawListBuffer.numItems = indices.length;
}

Shape.prototype.render=function (mvMtrx,pMtrx) {

  gl.useProgram(colorShaderProgram);

  // get handle to vertex shader's vPosition member
  var mPositionHandle = gl.getAttribLocation(colorShaderProgram, "aVertexPosition");

  // Enable generic vertex attribute array
  gl.enableVertexAttribArray(mPositionHandle);
  //bind
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
  // Prepare the triangle coordinate data
  gl.vertexAttribPointer(mPositionHandle, this.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);


  // Get handle to shape's transformation matrix
  var pMtrxhandle = gl.getUniformLocation(colorShaderProgram, "uPMatrix");

  // Apply the projection
  gl.uniformMatrix4fv(pMtrxhandle, false, pMtrx);


  // Get handle to shape's transformation matrix
  var mvMtrxhandle = gl.getUniformLocation(colorShaderProgram, "uMVMatrix");

  // Apply the modelView
  gl.uniformMatrix4fv(mvMtrxhandle, false, mvMtrx);


  var colorUniformLocation = gl.getUniformLocation(colorShaderProgram, "vColor");
  // Apply the color
  gl.uniform4f(colorUniformLocation, this.color[0], this.color[1], this.color[2], this.color[3]);


  //bind
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.drawListBuffer);
  // Draw the triangle
  gl.drawElements(gl.TRIANGLES, this.drawListBuffer.numItems, gl.UNSIGNED_SHORT, 0);

  // Disable vertex array
  gl.disableVertexAttribArray(mPositionHandle);
};
