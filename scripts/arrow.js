class Arrow {
    constructor(balloon, p) {
        [this.x0, this.y0] = p;
        [this.x1, this.y1] = p;
        this.headBalloon = null;
        this.tailBalloon = balloon;
        this.arrow = Space.s.path(this.getPathString());
        this.arrow.attr({
            stroke: 'black',
            strokeWidth: 2,
            opacity: 0.8,
            fill: 'transparent'
        });
    }

    getStartAndEnd() {
        return [this.x0, this.y0, this.x1, this.y1];
    }

    getPathString() {
        const [x0, y0, x1, y1] = this.getStartAndEnd();
        return `M ${x0} ${y0} L ${x1} ${y1}`;
    }

    updateArrow() {
        this.arrow.attr({ d: this.getPathString() });
    }

    moveHead(x, y) {
        [this.x1, this.y1] = [x, y];
        this.updateArrow();
    }

    moveTail(x, y) {
        [this.x0, this.y0] = [x, y];
        this.updateArrow();
    }

    remove() {
        this.arrow.remove();
    }
}