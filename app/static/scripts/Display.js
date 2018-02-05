"use strict"


var gl;
var shaderProgram;
var colorShaderProgram;
//static

function Display(width,height){

  this.canvas;
  this.canvasCtx;

  this.textCanvas;
  this.textCtx;

  this.canvas=document.createElement("canvas");
  this.canvas.id="gameScreen";
  this.canvas.style.position="absolute";
  this.canvas.style.left="0px";
  this.canvas.style.top="0px";
  this.canvas.style.border="3px solid red";
  this.canvas.width=width;
  this.canvas.height=height;
  //html body에 삽입
  document.body.appendChild(this.canvas);

  this.textCanvas=document.createElement("canvas");;
  this.textCanvas.style.position="absolute";
  this.textCanvas.style.left="0px";
  this.textCanvas.style.top="0px";
  this.textCanvas.style.border="3px solid red";
  this.textCanvas.width=width;
  this.textCanvas.height=height;
  //html body에 삽입
  document.body.appendChild(this.textCanvas);
  this.textCtx=this.textCanvas.getContext("2d");

  this.projectionMatrix=mat4.create();
  //                                   -1000,-0   (실제 보여지는 z값은 -1000~0이다(0이 맨앞,-1000이 맨뒤))
  mat4.ortho(this.projectionMatrix,0,this.canvas.width,this.canvas.height,0,1000,0);

  initGL(this.canvas);
  initShaders();

  function initGL(canvas) {
      try {
          gl = canvas.getContext("experimental-webgl");
          gl.viewportWidth = canvas.width;
          gl.viewportHeight = canvas.height;
      } catch (e) {
      }
      if (!gl) {
          alert("Could not initialise WebGL, sorry :-(");
      }
  }


  function getShader(gl, id) {
      var shaderScript = document.getElementById(id);
      if (!shaderScript) {
          return null;
      }

      var str = "";
      var k = shaderScript.firstChild;
      while (k) {
          if (k.nodeType == 3) {
              str += k.textContent;
          }
          k = k.nextSibling;
      }

      var shader;
      if (shaderScript.type == "x-shader/x-fragment") {
          shader = gl.createShader(gl.FRAGMENT_SHADER);
      } else if (shaderScript.type == "x-shader/x-vertex") {
          shader = gl.createShader(gl.VERTEX_SHADER);
      } else {
          return null;
      }

      gl.shaderSource(shader, str);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          alert(gl.getShaderInfoLog(shader));
          return null;
      }

      return shader;
  }

  function initShaders() {
      var fragmentShader = getShader(gl, "shader-fs");
      var vertexShader = getShader(gl, "shader-vs");

      shaderProgram = gl.createProgram();
      gl.attachShader(shaderProgram, vertexShader);
      gl.attachShader(shaderProgram, fragmentShader);
      gl.linkProgram(shaderProgram);

      if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
          alert("Could not initialise shaders");
      }

      fragmentShader = getShader(gl, "solid_color_shader-fs");
      vertexShader = getShader(gl, "solid_color_shader-vs");

      colorShaderProgram = gl.createProgram();
      gl.attachShader(colorShaderProgram, vertexShader);
      gl.attachShader(colorShaderProgram, fragmentShader);
      gl.linkProgram(colorShaderProgram);

      if (!gl.getProgramParameter(colorShaderProgram, gl.LINK_STATUS)) {
          alert("Could not initialise shaders");
      }
  }
}

Display.prototype.update=function(){
  return this.textCtx.clearRect(0,0,this.textCanvas.width,this.textCanvas.height);
}

Display.prototype.fillText=function(string,x,y){
  this.textCtx.fillText(string,x,y);
}

Display.prototype.getProjection=function(){
  return mat4.clone(this.projectionMatrix);
}

Display.prototype.getWidth=function(){
  return this.canvas.width;
}

Display.prototype.getHeight=function(){
  return this.canvas.height;
}

Display.prototype.render=function(renderAble,x,y,width,height,rad){
  var mvMatrix=mat4.create();
  mat4.identity(mvMatrix);

  var translation = vec3.create();
  vec3.set(translation, x, y, 0);
  mat4.translate(mvMatrix, mvMatrix, translation);

  mat4.rotateZ(mvMatrix, mvMatrix, rad);

  var scale = vec3.create();
  vec3.set(scale, width, height, 1);
  mat4.scale(mvMatrix, mvMatrix, scale);

  renderAble.render(mvMatrix,this.getProjection());
}

function createTexture(texture,image) {

    var a=arguments;

    function handleLoadedTexture(texture) {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        //어차피 mat4.ortho(left,right,bottom,top,near,far)를 통해 뒤집어지므로 아래 메서드는 생략한다.(일반적인 3d 좌표에서는 아래 메서드를 써야 uv좌표가 알맞게 나온다.)
        // gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL , true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    switch (a.length) {
      case 2:{
        texture.image = image;
        handleLoadedTexture(texture);
      }break;

      //text,font
      case 3:{
        var txtImg=display.textCanvas;
        var ctx=txtImg.getContext("2d");

        // ctx.save();

        var text=a[1];//    "www.jrr.kr";
        ctx.font=a[2];//    "bold 20px Arial";

        txtImg.width  = 100;
        txtImg.height = 50;
        ctx.font = a[2];
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "black";
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.fillText(text, txtImg.width / 2, txtImg.height / 2);

        // ctx.restore();

        texture.image = txtImg;
        texture.image.onload = function () {
            handleLoadedTexture(texture);
        }
        texture.image.src = txtImg.toDataURL("image/png");
      }break;

      default:OverloadingException();

    }
}
