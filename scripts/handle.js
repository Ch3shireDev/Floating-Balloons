class Handle {
    constructor() {
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

    setLocation(r) {
        this.handle.attr('x', r.x - 20);
        this.handle.attr('y', r.y - 20);
    }

    grab() {

    }

    move(x, y) {
        [x, y] = (new Point(x, y)).toCursorPoint();
        this.handle.attr('x', x);
        this.handle.attr('y', y);
    }

    drop() {

    }

    showHandle(b) {
        if (b === null) return;
        this.setLocation(b.closestPoint());
    }
}