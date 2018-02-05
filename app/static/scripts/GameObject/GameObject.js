"use strict"

function GameObject(){
    this.body;
    this.model;
    this.collision;
}

GameObject.prototype.render=function(pMtrx) {
  if(this.model!=null)
  this.model.render(pMtrx,this.body);
}

GameObject.prototype.update=function() {

}

GameObject.prototype.remove=function() {

}
