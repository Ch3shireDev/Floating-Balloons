class Handle {
    constructor() {
        this.arrow = null;
        this.isDragged = false;
        this.parentBalloon = Balloons.getLast();
        this.handle = Space.s.rect(0, 0, 40, 40);
        this.handle.attr({
            class: 'balloon',
            id: 'handle',
            fill: 'red',
            opacity: 0.8
        });
    }

    getXY() {
        var x = parseFloat(this.handle.attr('x'));
        var y = parseFloat(this.handle.attr('y'));
        return [x, y];
    }

    screenXY() {
        const [x, y] = this.getXY();
        return Space.toScreenPoint(x, y);
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
            var [x, y] = this.getXY();
            [x, y] = [x + 20, y + 20];
            this.arrow = new Arrow(this.parentBalloon, [x, y]);
        }
    }

    move(x, y) {
        [x, y] = (new Point(x, y)).toCursorPoint();
        this.handle.attr('x', x);
        this.handle.attr('y', y);
        this.arrow.moveHead(x + 20, y + 20);
    }

    drop(x, y, e) {
        this.handle.attr({ visibility: 'hidden' });
        this.arrow.hide();

        var [x0, y0, element] = Space.getElement(e);

        var b = null;

        if (element.id === 'body') {
            b = this.createBalloon(x, y);
        }
        else if (element.class === 'balloon') {
            b = Balloons.findFromElement(element);
        }
        else if (element.getAttribute('class') === 'inner-text') {
            b = Balloons.findFromElement(element.parentElement);
        }

        if (b !== null) {
            this.parentBalloon.childArrows.push(this.arrow);
            this.parentBalloon.childBalloons.push(b);
            this.arrow.headBalloon = b;
        }

        this.arrow.show();
        this.arrow = null;
        this.isDragged = false;
        this.handle.attr({ visibility: 'visible' });
    }

    showHandle() {
        if (this.parentBalloon === null || this.isDragged) return;
        
        var [x, y] = Space.mousePos;
        console.log(this.parentBalloon.distance(x, y));
        [x, y] = Space.toCursorPoint(x, y);
        var r = Snap.closestPoint(this.parentBalloon.path, x, y);
        this.setLocation(r);
    }

    createBalloon(x, y) {
        return Balloons.addBalloon(x, y);
    }
}