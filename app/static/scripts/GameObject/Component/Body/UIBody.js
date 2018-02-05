"use strict"

function UIBody(owner) {
    Component.apply(this, [owner]);
    this.width = 100;
    this.height = 100;

    this.pos = new Vector2d(0, 0);

    this.rotateAngle = 0; // radians
}

inherit(Component, UIBody);
