class Handle {
    constructor() {
        this.arrow = null;
        this.isDragged = false;
        this.parentBalloon = Balloons.getLast();
        this.handle = Space.s.rect(0, 0, 40, 40, 10);
        this.handle.attr({
            class: 'balloon',
            id: 'handle',
            stroke: '#123456',
            strokeWidth: 5,
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
        var [x, y] = this.getXY();
        this.pathStr = 'M ' + x + ' ' + y + ' L ';
        if (this.arrow !== null) {
            this.arrow.remove();
        }
        this.arrow = Space.s.path(this.pathStr + x + ' ' + y);
        this.arrow.attr({
            stroke: 'black',
            strokeWidth: 2,
            opacity: 0.8,
            fill: 'transparent'
        });

    }

    move(x, y) {
        [x, y] = (new Point(x, y)).toCursorPoint();
        this.handle.attr('x', x - 20);
        this.handle.attr('y', y - 20);
        this.arrow.attr({ d: this.pathStr + x + ' ' + y });
    }

    drop(x, y, e) {
        this.isDragged = false;
        this.createBalloon(x, y);
    }

    showHandle() {
        if (this.parentBalloon === null || this.isDragged) return;
        this.setLocation(this.parentBalloon.closestPoint());
    }

    createBalloon(x, y) {
        Balloons.addBalloon(x, y);
    }
}