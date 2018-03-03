class Handle {
    constructor() {
        this.isDragged = false;
        this.handle = Space.s.rect(0, 0, 40, 40, 10);
        this.handle.attr({
            class: 'balloon',
            id: 'handle',
            stroke: '#123456',
            'strokeWidth': 5,
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
        this.arrow = Space.s.path(this.pathStr + x + ' ' + y);
        this.arrow.attr({
            stroke: 'black',
            fill: 'transparent'
        });
    }

    move(x, y) {
        [x, y] = (new Point(x, y)).toCursorPoint();
        this.handle.attr('x', x-20);
        this.handle.attr('y', y-20);
        this.arrow.attr({d: this.pathStr + x + ' ' + y});
    }

    drop() {
        this.isDragged = false;
    }

    showHandle(b) {
        if (b === null || this.isDragged) return;
        this.setLocation(b.closestPoint());
    }
}