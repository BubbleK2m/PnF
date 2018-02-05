"use strict"

function Entity(){
  GameObject.apply(this,[]);
  this.id=Math.random();
  Entity.list[this.id]=this;
}

inherit(GameObject,Entity);

Entity.list={};

Entity.prototype.update=function(){
}

Entity.clear=function(){
  Entity.list={};
}

Entity.prototype.remove=function(){
  delete Entity.list[this.id];
}

Entity.prototype.hitProcess=function(e){

}

Entity.renderAll=function(camera){
  for(var id in Entity.list){
    var e=Entity.list[id];
    e.render(camera.getProjection());
  }
}

Entity.updateAll=function(){
  for(var id in Entity.list){
    var e=Entity.list[id];
    e.update();
  }
}
