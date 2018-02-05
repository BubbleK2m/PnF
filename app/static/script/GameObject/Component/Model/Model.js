"use strict"

class Model extends Component{
  constructor(owner){
    super(owner);

    this.isFlipped=false;

  }

  setFlip(isFlipped){
    this.isFlipped=isFlipped;
  }

  render(pMtrx,body) {}

}
