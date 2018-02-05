"use strict"

function Component(owner){
  this.owner=owner;
}

Component.prototype.getOwner=function(){
  return this.owner;
}
