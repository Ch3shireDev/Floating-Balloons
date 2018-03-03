class Handle {
    constructor() {
        this.handle = Space.s.rect(0, 0, 40, 40, 10);
        this.handle.attr({
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

    }

    drop() {

    }
}