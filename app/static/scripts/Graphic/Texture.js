"use strict"

function Texture(image){
  Shape.apply(this,[]);

  //일단 빨간색으로 로드//나중에 texture는 해당 이미지로 변경된다

  this.texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, this.texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([255, 0, 0, 255]));

  var a=arguments;

  switch (a.length) {

    //이미지 텍스쳐
    case 1:{
      createTexture(this.texture,image);
      this.imageWidth=image.naturalWidth;
      this.imageHeight=image.naturalHeight;
      if(a[0] instanceof Text){
        //text는 읽기 전용 속성
        this.text = a[0];
        this.textWidth=this.texture.textWidth;
        this.textHeight=this.texture.textHeight;
        //옮긴후 제거
        delete this.texture.textWidth;
        delete this.texture.textHeight;
      }
    }break;

    //단순 색깔 텍스쳐
    //원래 이기능은 Shape가 담당하지만 UI의 특성상 대부분 이미지를 쓰므로
    //인자 형태를 Sprite로 제한하였기 때문에 단색 버튼을 구현할때 사용하기 위한 생성자다.
    case 4:{
      gl.bindTexture(gl.TEXTURE_2D, this.texture);
      //각 값은 0~255까지의 값이다.
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([a[0], a[1], a[2], a[3]]));

      this.imageWidth=-1;
      this.imageHeight=-1;
    }break;

    default:OverloadingException();
  }

  this.uvs=[
    0.0, 0.0,
    0.0, 1.0,
    1.0, 1.0,
    1.0, 0.0,
  ];

  this.uvBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.uvs), gl.STATIC_DRAW);
  this.uvBuffer.itemSize = 2;
  this.uvBuffer.numItems = 4;
}

inherit(Shape,Texture);

Texture.prototype.setUvBuffer=function(x, y, fx, fy){
  this.uvs[0]=x;this.uvs[1]=y;
  this.uvs[2]=x;this.uvs[3]=fy;
  this.uvs[4]=fx;this.uvs[5]=fy;
  this.uvs[6]=fx;this.uvs[7]=y;

  gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.uvs), gl.STATIC_DRAW);
}

Texture.prototype.getImageWidth=function () {
  return this.imageWidth;
}

Texture.prototype.getImageHeight=function () {
  return this.imageHeight;
}

Texture.prototype.render=function() {

  var a=arguments;

  switch (a.length) {
    case 2:{

      let mvMtrx=a[0]
      let pMtrx=a[1];

      this.render(mvMtrx,pMtrx,0.0,0.0,1.0,1.0);
    }break;

    case 6:{
      let mvMtrx=a[0]
      let pMtrx=a[1];
      let x=a[2];
      let y=a[3];
      let fx=a[4];
      let fy=a[5];

      this.setUvBuffer(x,y,fx,fy);

      gl.useProgram(shaderProgram);

      // get handle to vertex shader's vPosition member
      var mPositionHandle = gl.getAttribLocation(shaderProgram, "aVertexPosition");

      // Enable generic vertex attribute array
      gl.enableVertexAttribArray(mPositionHandle);
      //bind
      gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
      // Prepare the triangle coordinate data
      gl.vertexAttribPointer(mPositionHandle, this.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);


      // Get handle to texture coordinates location
      var mTexCoordLoc = gl.getAttribLocation(shaderProgram, "aTextureCoord");

      // Enable generic vertex attribute array
      gl.enableVertexAttribArray ( mTexCoordLoc );
      //bind
      gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
      // Prepare the texturecoordinates
      gl.vertexAttribPointer ( mTexCoordLoc, this.uvBuffer.itemSize, gl.FLOAT, false, 0, 0);


      // Get handle to shape's transformation matrix
      var pMtrxhandle = gl.getUniformLocation(shaderProgram, "uPMatrix");

      // Apply the projection
      gl.uniformMatrix4fv(pMtrxhandle, false, pMtrx);


      // Get handle to shape's transformation matrix
      var mvMtrxhandle = gl.getUniformLocation(shaderProgram, "uMVMatrix");

      // Apply the modelView
      gl.uniformMatrix4fv(mvMtrxhandle, false, mvMtrx);


      // Get handle to textures locations
      var mSamplerLoc = gl.getUniformLocation (shaderProgram, "uSampler" );

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.texture);
      // Set the sampler texture unit to 0, where we have saved the texture.
      gl.uniform1i ( mSamplerLoc, 0);

      //bind
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.drawListBuffer);
      // Draw the triangle
      gl.drawElements(gl.TRIANGLES, this.drawListBuffer.numItems, gl.UNSIGNED_SHORT, 0);

      // Disable vertex array
      gl.disableVertexAttribArray(mPositionHandle);
      gl.disableVertexAttribArray(mTexCoordLoc);
    }break;

    default: OverloadingException();

  }

}
