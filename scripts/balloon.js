class Balloon {
    constructor(x, y) {
        this.W0 = 200;
        this.H0 = 200;
        this.n = Balloons.numBalloons;
        Balloons.numBalloons++;

        [this.fO, this.div] = this.createBalloon(x, y);

        this.grabbed = false;
        this.freezeMovement = false;
        this.id = this.div.attr('id');
        //remove selection
        if (window.getSelection) {
            window.getSelection().removeAllRanges();
        }
        else if (document.selection) {
            document.selection.empty();
        }
        this.childBalloons = [];
        this.parentBalloons = [];
        this.childArrows = [];
        this.parentArrows = [];
        this.move(x, y);
        this.path = this.createPath();
    }

    W() {
        var w = Space.point.w;
        var w0 = (new Point()).getRect()[2];
        return w0 / w * this.W0;
    }

    H() {
        var h = Space.point.h;
        var h0 = (new Point()).getRect()[3];
        return h0 / h * this.H0;
    }

    wh() {
        var w = this.div.attr('width'),
            h = this.div.attr('height');
        [w, h] = Space.internalToScreen(w, h);
        var [x, y] = Space.internalToScreen(0, 0);
        return [w - x, h - y];
    }

    isGrabbed() {
        return this.grabbed;
    }

    grab() {
        this.grabbed = true;
        this.bringToFront();
    }

    bringToFront() {
        //probably not the best way to accomplish that
        this.div.remove();
        this.fO.remove();
        Space.s.append(this.div);
        Space.svg.appendChild(this.fO);
    }

    drop() {
        this.grabbed = false
        this.path = this.createPath();
    }

    rect() {
        const div = this.div;
        const w = parseFloat(div.attr('width'));
        const h = parseFloat(div.attr('height'));
        const [x, y] = this.getXY();
        return [x, y, w, h];
    }

    getXY() {
        const div = this.div;
        const x = parseFloat(div.attr('x')),
            y = parseFloat(div.attr('y'));
        return [x, y];
    }

    getAttrWH() {
        const div = this.div;
        const w = parseFloat(div.attr('width')),
            h = parseFloat(div.attr('height'));
        return [w, h];
    }

    screenXY() {
        var [x, y] = this.getXY();
        [x, y] = Space.internalToScreen(x, y);
        return [x, y];
    }

    moveInternal(x, y, dx, dy) {
        [x, y] = Space.internalToSVG(x-this.W()/2, y-this.H()/2);
        this.div.attr('x', x);
        this.div.attr('y', y);
        this.fO.setAttribute('x', x);
        this.fO.setAttribute('y', y);
        var b = this;
        this.childArrows.forEach(function (arrow) {
            b.centerTail(arrow);
        });
        this.parentArrows.forEach(function (arrow) {
            b.centerHead(arrow);
        });
    }

    move(x, y, dx, dy) {
        if (this.freezeMovement) return;
        this.freezeMovement = true;
        var [w, h] = [Space.point.w, Space.point.h];
        var [x2, y2] = Space.internalToScreen(x, y);
        var [x0, y0] = [x2, y2];
        var [x1, y1] = this.screenXY();
        this.x = x;
        this.y = y;
        this.moveInternal(this.x, this.y, dx, dy);
        if (Space.moveChildren) {
            var balloonSet = new Set(this.childBalloons);
            var n = 0;
            while (balloonSet.size != n) {
                balloonSet.forEach(function (balloon) {
                    balloon.childBalloons.forEach(function (b) {
                        balloonSet.add(b);
                    });
                });
                n = balloonSet.size;
            }
            var b = this;
            balloonSet.forEach(function (balloon) {
                if (balloon === b) return;
                if (b.parentBalloons.includes(balloon)) return;
                var [x, y] = [balloon.x, balloon.y];
                balloon.moveInternal(x, y, dx, dy);
            });
        }
        this.freezeMovement = false;
    }

    centerTail(arrow) {
        arrow.moveTail(this.x, this.y);
    }

    centerHead(arrow) {
        arrow.moveHead(this.x, this.y);
    }

    createBalloon(x, y) {
        const w = 200;
        const h = 200;
        x = x - w / 2;
        y = y - h / 2;
        const div = Space.s.rect(x, y, w, h);
        div.attr({
            id: `balloon${this.n}`,
            class: 'balloon',
            fill: 'red',
            'opacity': 0.8
        });
        const fO = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
        fO.setAttribute('id', `fo${this.n}`);
        fO.setAttribute('x', x);
        fO.setAttribute('y', y);
        fO.setAttribute('width', w);
        fO.setAttribute('height', h);
        fO.innerHTML = '<div class="inner-text"></div>';
        div.after(fO);
        return [fO, div];
    }

    createPath() {
        [this.pathx, this.pathy] = [this.x, this.y];
        var r0 = roundPathCorners(`M0 0 L ${this.W()} 0 L${this.W()} ${this.H()} L 0 ${this.H()} Z`, 20);
        var path = Space.s.path(r0);
        var [x, y] = this.getXY();
        x -= this.W() / 2 * 0.3;
        y -= this.H() / 2 * 0.3;
        var s = 1.3;

        path.transform(`translate(${x}, ${y}) scale(${s})`).remove();
        var r = Snap.path.map(path.realPath, path.matrix);
        path = Space.s.path(r).remove();
        return path;
    }

    distance(x, y) {
        var [x1, y1] = this.getXY();
        var [x2, y2] = Space.internalToScreen(x1, y1);
        var d = Math.sqrt((x - x2) * (x - x2) + (y - y2) * (y - y2));
        return d;
    }

    refresh() {
        this.moveInternal(this.x, this.y);
        this.div.attr('width', this.W());
        this.div.attr('height', this.H());
    }
}