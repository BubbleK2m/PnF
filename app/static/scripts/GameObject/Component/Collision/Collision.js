"use strict"

function Collision(owner) {
    Component.apply(this, [owner]);
}

inherit(Component, Collision);

Collision.prototype.hitTest = function(collision) {

}

function ResolveCollision(A, B, normal) {
    // Calculate relative velocity
    var rv = B.velocity.sub(A.velocity);

    // Calculate relative velocity in terms of the normal direction
    var velAlongNormal = rv.dot(normal);

    // Do not resolve if velocities are separating
    if (velAlongNormal > 0)
        return;

    // Calculate restitution
    var e = min(A.restitution, B.restitution);

    // Calculate impulse scalar
    var j = -(1 + e) * velAlongNormal;
    j /= A.inv_mass + B.inv_mass;

    // Apply impulse
    var impulse = normal.scale(j);
    A.applyImpulse(impulse.scale(-1));
    B.applyImpulse(impulse);

    //Friction Calculate

    // Re-calculate relative velocity after normal impulse
    // is applied (impulse from first article, this code comes
    // directly thereafter in the same resolve function)
    rv = B.velocity.sub(A.velocity);

    // Solve for the tangent vector
    var t = rv.sub(normal.scale(rv.dot(normal)));
    t.normalizeLocal();

    // Solve for magnitude to apply along the friction vector
    var jt = -1 * rv.dot(t);
    jt /= A.inv_mass + B.inv_mass;

    if (-0.001 < jt && jt < 0.001)
        return;

    // PythagoreanSolve = A^2 + B^2 = C^2, solving for C given A and B
    // Use to approximate mu given friction coefficients of each body
    var mu = Math.sqrt(A.staticFriction * A.staticFriction + B.staticFriction * B.staticFriction);

    // Clamp magnitude of friction and create impulse vector
    var frictionImpulse;
    var dynamicFriction;
    if (Math.abs(jt) < j * mu) {
        frictionImpulse = t.scale(jt);
    } else {
        dynamicFriction = Math.sqrt(A.dynamicFriction * A.dynamicFriction + B.dynamicFriction * B.dynamicFriction);
        frictionImpulse = t.scale(-j * dynamicFriction);
    }

    A.applyImpulse(frictionImpulse.scale(-1));
    B.applyImpulse(frictionImpulse);
}

function ResolveCollision2(A, B, normal, contacts) {

    // Calculate average restitution
    var e = min( A.restitution, B.restitution );

    // Calculate static and dynamic friction
    var sf = Math.sqrt( A.staticFriction * B.staticFriction );
    var df = Math.sqrt( A.dynamicFriction * B.dynamicFriction );

    for (let i = 0; i < contacts.length; i++) {
        // Calculate relative velocity
        let ra = contacts[i].sub(A.pos);
        let rb = contacts[i].sub(B.pos);

        // Relative velocity
        let rv = B.velocity.add(Vector2d.cross( B.angularVelocity, rb )).sub(A.velocity).sub(Vector2d.cross( A.angularVelocity, ra ));

        // Calculate relative velocity in terms of the normal direction
        var contactVel = rv.dot(normal);

        // Do not resolve if velocities are separating
        if (contactVel > 0)
            return;

        let raCrossN=ra.cross(normal);
        let rbCrossN=rb.cross(normal);
        let invMassSum=A.inv_mass+B.inv_mass+(raCrossN*raCrossN)*A.inv_inertia+(rbCrossN*rbCrossN)*B.inv_inertia;

        // Calculate impulse scalar
        var j = -(1 + e) * contactVel;
        j /= invMassSum;
        j /= contacts.length;

        // Apply impulse
        var impulse = normal.scale(j);
        A.applyImpulse(impulse.scale(-1), ra);
        B.applyImpulse(impulse, rb);

        // Friction impulse
        rv = B.velocity.add(Vector2d.cross( B.angularVelocity, rb )).sub(A.velocity).sub(Vector2d.cross( A.angularVelocity, ra ));

        let t=rv.sub(normal.scale(rv.dot(normal)));
        t.normalizeLocal();

        // j tangent magnitude
        let jt=-rv.dot(t);
        jt/=invMassSum;
        jt/=contacts.length;

        // Don't apply tiny friction impulses
        if(jt<=0.001)
          return;

        let tangentImpulse;
        if(Math.abs(jt)<j*sf)
          tangentImpulse=t*jt;
        else
          tangentImpulse=t*-j*df;
        // Coulumb's law
        A.applyImpulse(impulse.scale(-1), ra);
        B.applyImpulse(impulse, rb);
    }
}


function PositionalCorrection(A, B, normal, penetration) {
    var percent = 0.4; // usually 20% to 80% // Penetration percentage to correct
    var slop = 0.01; // usually 0.01 to 0.1 // Penetration allowance
    var correction = normal.scale(percent * (max(penetration - slop, 0.0) / (A.inv_mass + B.inv_mass)));
    A.pos.subLocal(correction.scale(A.inv_mass));
    B.pos.addLocal(correction.scale(B.inv_mass));
}

function AABBvsCircle(A, B) {


    var normal;
    var penetration;

    // Vector from A to B
    var n = B.pos.sub(A.pos);

    // Closest point on A to center of B
    var closest = n.clone();

    // Calculate half extents along each axis
    var x_extent = A.width / 2;
    var y_extent = A.height / 2;

    // Clamp point to edges of the AABB
    closest.x = clamp(closest.x, -x_extent, x_extent);
    closest.y = clamp(closest.y, -y_extent, y_extent);

    var inside = false;

    // Circle is inside the AABB, so we need to clamp the circle's center
    // to the closest edge
    if (n.x == closest.x && n.y == closest.y) {
        inside = true;

        // Find closest axis
        if (Math.abs(n.x) > Math.abs(n.y)) {
            // Clamp to closest extent
            if (closest.x > 0)
                closest.x = x_extent;
            else
                closest.x = -x_extent;
        }

        // y axis is shorter
        else {
            // Clamp to closest extent
            if (closest.y > 0)
                closest.y = y_extent;
            else
                closest.y = -y_extent;
        }
    }

    normal = n.sub(closest);
    var d = normal.lengthSquared();
    var r = B.radius;

    // Early out of the radius is shorter than distance to closest point and
    // Circle not inside the AABB
    if (d > r * r && !inside)
        return false;

    // Avoided sqrt until we needed
    d = normal.length();

    // Collision normal needs to be flipped to point outside if circle was
    // inside the AABB
    normal.normalizeLocal();

    if (inside)
        normal = normal.scale(-1);

    penetration = r - d;

    if (normal != undefined && penetration != undefined) {
        PositionalCorrection(A, B, normal, penetration);
        ResolveCollision(A, B, normal);
    }

    return true;
}
