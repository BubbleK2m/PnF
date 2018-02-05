"use strict"

class QuadTree {
    constructor(pLevel, pBounds) {
        this.MAX_OBJECTS = 10;
        this.MAX_LEVELS = 5;

        this.level = pLevel;
        this.objects = [];
        this.bounds = pBounds;
        this.nodes = [];
    }

    /*
     * Clears the quadtree
     */
    clear() {
        this.objects = [];

        for (let i = 0; i < this.nodes.length; i++) {
            if (this.nodes[i] != null) {
                this.nodes[i].clear();
                this.nodes[i] = null;
            }
        }
    }

    /*
     * Splits the node into 4 subnodes
     */
    split() {
        var x = this.bounds.getX();
        var y = this.bounds.getY();
        var subWidth = Math.floor(this.bounds.getWidth() / 2);
        var subHeight = Math.floor(this.bounds.getHeight() / 2);

        this.nodes[0] = new QuadTree(this.level + 1, new Rectangle(x + subWidth, y, subWidth, subHeight));
        this.nodes[1] = new QuadTree(this.level + 1, new Rectangle(x, y, subWidth, subHeight));
        this.nodes[2] = new QuadTree(this.level + 1, new Rectangle(x, y + subHeight, subWidth, subHeight));
        this.nodes[3] = new QuadTree(this.level + 1, new Rectangle(x + subWidth, y + subHeight, subWidth, subHeight));
    }

    /*
     * Determine which node the object belongs to. -1 means
     * object cannot completely fit within a child node and is part
     * of the parent node
     */
    getIndex(pRect) {
        var bound=pRect.bound;

        var index = -1;
        var verticalMidpoint = this.bounds.getX() + (this.bounds.getWidth() / 2);
        var horizontalMidpoint = this.bounds.getY() + (this.bounds.getHeight() / 2);

        // Object can completely fit within the top quadrants
        var topQuadrant = (bound.getY() < horizontalMidpoint && bound.getY() + bound.getHeight() < horizontalMidpoint);
        // Object can completely fit within the bottom quadrants
        var bottomQuadrant = (bound.getY() > horizontalMidpoint);

        // Object can completely fit within the left quadrants
        if (bound.getX() < verticalMidpoint && bound.getX() + bound.getWidth() < verticalMidpoint) {
            if (topQuadrant) {
                index = 1;
            } else if (bottomQuadrant) {
                index = 2;
            }
        }
        // Object can completely fit within the right quadrants
        else if (bound.getX() > verticalMidpoint) {
            if (topQuadrant) {
                index = 0;
            } else if (bottomQuadrant) {
                index = 3;
            }
        }

        return index;
    }

    /*
     * Insert the object into the quadtree. If the node
     * exceeds the capacity, it will split and add all
     * objects to their corresponding nodes.
     */
    insert(pRect) {
        if (this.nodes[0] != null) {
            let index = this.getIndex(pRect);

            if (index != -1) {
                this.nodes[index].insert(pRect);

                return;
            }
        }

        this.objects.push(pRect);

        if (this.objects.length > this.MAX_OBJECTS && this.level < this.MAX_LEVELS) {
            if (this.nodes[0] == null) {
                this.split();
            }

            var i = 0;
            while (i < this.objects.length) {
                let index = this.getIndex(this.objects[i]);
                if (index != -1) {
                    let obj = this.objects[i];
                    this.nodes[index].insert(obj);
                    this.objects.splice(i, 1);
                } else {
                    i++;
                }
            }
        }
    }


    /*
     * Return all objects that could collide with the given object
     */
    retrieve(returnObjects, pRect) {
        var index = this.getIndex(pRect);
        if (index != -1 && this.nodes[0] != null) {
            this.nodes[index].retrieve(returnObjects, pRect);
        }

        for (var obj of this.objects) {
            returnObjects.push(obj);
        }

        return returnObjects;
    }
}
