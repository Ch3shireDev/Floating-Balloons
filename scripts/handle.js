class Handle {
    constructor() {
        this.arrow = null;
        this.isDragged = false;
        this.parentBalloon = Balloons.getLast();
        this.handle = Space.s.rect(0, 0, 40, 40);
        this.handle.attr({
            class: 'balloon',
            id: 'handle',
            //stroke: '#123456',
            //strokeWidth: 5,
            fill: 'red',
            opacity: 0.8
        });
    }

    getXY() {
        var x = parseFloat(this.handle.attr('x')) + 20;
        var y = parseFloat(this.handle.attr('y')) + 20;
        return [x, y];
    }

    setLocation(r) {
        this.handle.attr('x', r.x - 20);
        this.handle.attr('y', r.y - 20);
    }

    grab() {
        this.isDragged = true;
        if (this.arrow !== null) {
            this.arrow.remove();
        }
        if (this.parentBalloon !== null) {
            this.arrow = new Arrow(this.parentBalloon, this.getXY());
        }
    }

    move(x, y) {
        [x, y] = (new Point(x, y)).toCursorPoint();
        this.handle.attr('x', x - 20);
        this.handle.attr('y', y - 20);
        this.arrow.moveHead(x, y);
    }

    drop(x, y, e) {
        this.isDragged = false;
        var b = this.createBalloon(x, y);
        this.parentBalloon.childBalloons.push(b);
        this.parentBalloon.childArrows.push(this.arrow);
        this.arrow.headBalloon = b;
        this.arrow = null;
    }

    showHandle() {
        if (this.parentBalloon === null || this.isDragged) return;
        this.setLocation(this.parentBalloon.closestPoint());
    }

    createBalloon(x, y) {
        return Balloons.addBalloon(x, y);
    }
}