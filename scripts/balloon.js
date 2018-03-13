class Balloon {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.W = 100;
        this.H = 100;

        this.grabbed = false;

        [this.fO, this.div] = this.createBalloon(x, y);

        this.id = this.div.attr('id');

        this.path = this.CreatePath(x, y);

        //remove selection
        if (window.getSelection) { window.getSelection().removeAllRanges(); }
        else if (document.selection) { document.selection.empty(); }

        this.childBalloons = [];
        this.childArrows = [];
    }

    wh() {
        var w = this.div.attr('width'),
            h = this.div.attr('height');
        return (new Point(w, h)).toScreenPoint();
    }

    w() {
        return this.wh()[0];
    }
    h() {
        return this.wh()[1];
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
        this.grabbed = false;
        this.path = this.CreatePath(this.x + 100, this.y + 100);
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

    screenXY() {
        //if negative then more left, if positive then more right
        var [x, y] = this.getXY();
        [x, y] = Space.toScreenPoint(x, y);
        return [x, y];
    }

    move(x, y) {
        [x, y] = (new Point(x, y)).toCursorPoint();
        this.div.attr('x', x);
        this.div.attr('y', y);
        this.fO.setAttribute('x', x);
        this.fO.setAttribute('y', y);
        this.x = x;
        this.y = y;

        //alert(this.childBalloons.length);

        //console.log(this.childArrows);
        //if (this.childArrows.length === 0) return;
        //this.childArrows.forEach(function(arrow) {
        //arrow.moveTail(x, y);
        //});
    }

    createBalloon(x, y) {
        const w = 200;
        const h = 200;
        x = x - w / 2;
        y = y - h / 2;

        const div = Space.s.rect(x, y, w, h);
        div.attr({
            id: `balloon${Balloons.numBalloons}`,
            class: 'balloon',
            fill: 'red',
            'opacity': 0.8
        });

        const fO = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
        fO.setAttribute('id', `fo${Balloons.numBalloons}`);
        fO.setAttribute('x', x);
        fO.setAttribute('y', y);
        fO.setAttribute('width', w);
        fO.setAttribute('height', h);
        fO.innerHTML = '<div class="inner-text">text</div>';
        div.after(fO);

        Balloons.numBalloons++;

        return [fO, div];
    }

    CreatePath(x, y) {
        var r0 = roundPathCorners('M0 0 L 200 0 L200 200 L 0 200 Z', 20);
        var path = Space.s.path(r0)
            .transform(`translate(${x - 130}, ${y - 130}) scale(1.3)`)
            .remove();
        var r = Snap.path.map(path.realPath, path.matrix);
        path = Space.s.path(r).remove();
        return path;
    }

    distance(x, y) {
        var [x2, y2] = this.screenXY();
        var d = Math.sqrt((x - x2) * (x - x2) + (y - y2) * (y - y2));
        return d;
    }
}