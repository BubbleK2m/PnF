"use strict"

function Exception(name,message){
  console.error(name+" : "+message);
}

function OverloadingException(){
  Exception("OverloadingException","unknown overloading");
}
