class Handle {
    constructor() {
        this.arrow = null;
        this.isDragged = false;
        this.width = 40;
        this.parentBalloon = Balloons.getLast();
        this.handle = Space.s.rect(0, 0, this.width, this.width);
        this.handle.attr({
            class: 'balloon',
            id: 'handle',
            fill: 'red',
            opacity: 0.8
        });
    }

    getXY() {
        var x = parseFloat(this.handle.attr('x')),
            y = parseFloat(this.handle.attr('y'));
        return [x, y];
    }

    screenXY() {
        const [x, y] = this.getXY();
        return Space.internalToScreen(x, y);
    }

    setLocation(r) {
        this.handle.attr('x', r.x - this.width / 2);
        this.handle.attr('y', r.y - this.width / 2);
    }

    grab() {
        this.isDragged = true;
        if (this.arrow !== null)
            this.arrow.remove();
        if (this.parentBalloon !== null) {
            var [x, y] = this.getXY();
            [x, y] = [x + this.width / 2, y + this.width / 2];
            [x, y] = Space.svgToInternal(x, y);
            this.arrow = new Arrow(this.parentBalloon, [x, y]);
            this.parentBalloon.centerTail(this.arrow);
        }
    }

    move(x, y) {
        this.handle.attr('x', x);
        this.handle.attr('y', y);
        [x, y] = Space.svgToInternal(x, y);
        this.arrow.moveHead(x + this.width / 2, y + this.width / 2);
    }

    drop(x, y, e) {
        this.handle.attr({ visibility: 'hidden' }); //must remain to create balloon
        this.arrow.hide();
        var [, , element] = Space.getElement(e);
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
        if (b !== null && typeof b !== 'undefined') {
            this.parentBalloon.childArrows.push(this.arrow);
            this.parentBalloon.childBalloons.push(b);
            b.parentBalloons.push(this.parentBalloon);
            this.arrow.headBalloon = b;
            b.parentArrows.push(this.arrow);
            b.centerHead(this.arrow);
        }
        if (this.parentBalloon !== null) {
            this.parentBalloon.centerTail(this.arrow);
        }
        this.arrow.show();
        this.handle.attr({ visibility: 'visible' });
        this.arrow = null;
        this.isDragged = false;
    }

    showHandle() {
        if (this.isDragged) return;
        var [x, y] = Space.mousePos;
        [x, y] = Space.screenToSVG(x, y);
        var closestBalloon = Balloons.findClosest(x, y);
        if (closestBalloon !== null && closestBalloon !== this.parentBalloon) {
            this.parentBalloon = closestBalloon;
            this.parentBalloon.drop();
        }
        var r = Snap.closestPoint(this.parentBalloon.path, x, y);
        this.setLocation(r);
    }

    createBalloon(x, y) {
        return Balloons.addBalloon(x, y);
    }
}