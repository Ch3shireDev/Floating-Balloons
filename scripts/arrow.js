class Arrow {
    constructor(balloon, p) {
        [this.x0, this.y0] = p;
        [this.x1, this.y1] = p;
        this.headBalloon = null;
        this.tailBalloon = balloon;
        balloon.childArrows.push(this);
        this.arrow = Space.s.line();
        this.updateArrow();
    }

    setVisibility(value) {
        this.arrow.attr({ visibility: value });
    }

    hide() {
        this.setVisibility('hidden');
    }

    show() {
        this.setVisibility('visible');
    }

    getStartAndEnd() {
        var [x0, y0, x1, y1] = [this.x0, this.y0, this.x1, this.y1];
        var [dx, dy] = [x1 - x0, y1 - y0];
        var d = Math.sqrt(dx * dx + dy * dy);
        if (d > 200) {
            var x = function (t) { return x0 + (x1 - x0) * t; }
            var y = function (t) { return y0 + (y1 - y0) * t; }

            var [w1, h1] = [220, 220];
            if (this.tailBalloon !== null) {
                [w1, h1] = this.tailBalloon.internalWH();
                [w1, h1] = [w1 / 2 * 1.5, h1 / 2 * 1.5];
            }
            var [w2, h2] = [220, 220];
            if (this.headBalloon !== null) {
                [w2, h2] = this.headBalloon.internalWH();
                [w2, h2] = [w2 / 2 * 1.5, h2 / 2 * 1.5];
            }

            var [t0, t1] = [w1 / d, 1 - (w2+70) / d];
            var [t2, t3] = [h1 / d, 1 - (h2+70) / d];
            [x0, y0, x1, y1] = [x(t0), y(t2), x(t1), y(t3)];
        }
        return [x0, y0, x1, y1];
    }

    getPathString() {
        const [x0, y0, x1, y1] = this.getStartAndEnd();
        return `M ${x0} ${y0} L ${x1} ${y1}`;
    }

    updateArrow() {
        var [x1, y1, x2, y2] = this.getStartAndEnd();
        [x1, y1] = Space.internalToSVG(x1, y1);
        [x2, y2] = Space.internalToSVG(x2, y2);
        this.arrow.attr({
            x1: x1,
            y1: y1,
            x2: x2,
            y2: y2,
            class: 'arrow',
            stroke: 'black',
            strokeWidth: 8,
            opacity: 0.8
        });
        this.arrow.node.setAttribute('marker-end', 'url(#arrowhead)');
    }

    moveHead(x, y) {
        [this.x1, this.y1] = [x, y];
        this.updateArrow();
    }

    moveTail(x, y) {
        [this.x0, this.y0] = [x, y];
        this.updateArrow();
    }

    getHeadXY() {
        return [this.x1, this.y1];
    }

    getTailXY() {
        return [this.x0, this.y0];
    }

    positionToParent() {
        if (this.tailBalloon === null) return;
        this.tailBalloon.centerTail(this);
    }

    positionToChildren() {
        if (this.headBalloon === null) return;
        this.headBalloon.centerHead(this);
    }

    remove() {
        this.arrow.remove();
    }
}