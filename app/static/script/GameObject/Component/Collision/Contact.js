"use strict"

class Contact {
    constructor(A, B) {
        //A와 B는 body
        this.A = A;
        this.B = B;
        this.penetration = 0;
        this.normal = new Vector2d();
        //회전 적용할때 쓰는 변수
        this.contacts = [new Vector2d(), new Vector2d()];
        this.contactCount = 0;

        this.e;
        this.sf;
        this.df;
    }

    solve() {
        let a = this.A.owner.ordinal;
        let b = this.B.owner.ordinal;
        Collision.dispatch[a][b](this, this.A, this.B);
    }

    initialize() {
        let A = this.A;
        let B = this.B;
        let contacts = this.contacts;

        // Calculate average restitution
        this.e = min(A.restitution, B.restitution);

        // Calculate static and dynamic friction
        this.sf = Math.sqrt(A.staticFriction * A.staticFriction + B.staticFriction * B.staticFriction);
        this.df = Math.sqrt(A.dynamicFriction * A.dynamicFriction + B.dynamicFriction * B.dynamicFriction);

        for (let i = 0; i < this.contactCount; ++i) {
            // Calculate radii from COM to contact
            // Vec2 ra = contacts[i] - A->position;
            // Vec2 rb = contacts[i] - B->position;
            let ra = contacts[i].sub(A.pos);
            let rb = contacts[i].sub(B.pos);

            // Vec2 rv = B->velocity + Cross( B->angularVelocity, rb ) -
            // A->velocity - Cross( A->angularVelocity, ra );
            let rv = B.velocity.add(Vector2d.cross(B.angularVelocity, rb)).sub(A.velocity).sub(Vector2d.cross(A.angularVelocity, ra));

            // Determine if we should perform a resting collision or not
            // The idea is if the only thing moving this object is gravity,
            // then the collision should be performed without any restitution
            // if(rv.LenSqr( ) < (dt * gravity).LenSqr( ) + EPSILON)
            if (rv.lengthSquared() < World.GRAVITY.lengthSquared() + 0.001) {
                this.e = 0.0;
            }
        }
    }

    // 회전 적용 버전
    resolveCollision() {
        let A = this.A;
        let B = this.B;
        let normal = this.normal;
        let contacts = this.contacts;
        let contactCount = this.contactCount;

        if (A.inv_mass + B.inv_mass == 0) {
            this.infiniteMassCorrection();
            return;
        }

        for (let i = 0; i < contactCount; i++) {
            // Calculate relative velocity
            let ra = contacts[i].sub(A.pos);
            let rb = contacts[i].sub(B.pos);

            // Relative velocity
            let rv = B.velocity.add(Vector2d.cross(B.angularVelocity, rb)).sub(A.velocity).sub(Vector2d.cross(A.angularVelocity, ra));

            // Calculate relative velocity in terms of the normal direction
            var contactVel = rv.dot(normal);

            // Do not resolve if velocities are separating
            if (contactVel > 0)
                return;

            let raCrossN = ra.cross(normal);
            let rbCrossN = rb.cross(normal);
            let invMassSum = A.inv_mass + B.inv_mass + (raCrossN * raCrossN) * A.inv_inertia + (rbCrossN * rbCrossN) * B.inv_inertia;

            // Calculate impulse scalar
            var j = -(1 + this.e) * contactVel;
            j /= invMassSum;
            j /= contactCount;

            // Apply impulse
            var impulse = normal.scale(j);

            A.applyImpulse(impulse.scale(-1), ra);
            B.applyImpulse(impulse, rb);

            // Friction impulse
            rv = B.velocity.add(Vector2d.cross(B.angularVelocity, rb)).sub(A.velocity).sub(Vector2d.cross(A.angularVelocity, ra));

            let t = rv.sub(normal.scale(rv.dot(normal)));
            t.normalizeLocal();

            // j tangent magnitude
            let jt = -rv.dot(t);
            jt /= invMassSum;
            jt /= contactCount;

            // Don't apply tiny friction impulses
            if (-0.001 <= jt && jt <= 0.001)
                return;

            let tangentImpulse;
            if (Math.abs(jt) < j * this.sf) {
                tangentImpulse = t.scale(jt);
            } else {
                tangentImpulse = t.scale(-j * this.df);
            }
            // Coulumb's law
            A.applyImpulse(tangentImpulse.scale(-1), ra);
            B.applyImpulse(tangentImpulse, rb);
        }
    }


    positionalCorrection() {
        let A = this.A;
        let B = this.B;
        let normal = this.normal;
        let penetration = this.penetration;

        var percent = 0.4; // usually 20% to 80% // Penetration percentage to correct
        var slop = 0.05; // usually 0.01 to 0.1 // Penetration allowance

        var correction = normal.scale(percent * (max(penetration - slop, 0.0) / (A.inv_mass + B.inv_mass)));
        A.pos.subLocal(correction.scale(A.inv_mass));
        B.pos.addLocal(correction.scale(B.inv_mass));
    }

    infiniteMassCorrection() {
        this.A.velocity.set(0, 0);
        this.B.velocity.set(0, 0);
    }

}
