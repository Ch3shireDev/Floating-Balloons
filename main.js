'use strict';

var Space = {
    circlet: null,
    currentElement: null,
    mouseDown: false,
    s: Snap('#body'),
    svg: document.querySelector('svg'),
    xy: [0, 0],
    dxy: [0, 0],

    ScreenCTM: () => {
        return this.svg.getScreenCTM();
    },

    cursorPoint: (x, y) => {
        return (new Point(x, y)).toCursorPoint();
    },

    screenPoint: (x, y) => {
        return (new Point(x, y)).toScreenPoint();
    },

    getElement: (event) => {
        var x = event.clientX,
            y = event.clientY,
            e = document.elementFromPoint(x, y);
        [x, y] = Space.cursorPoint(x, y);
        return [x, y, e];
    },

    grabElement: (evt) => {
    }
}

class Point {
    constructor(x, y) {
        this.pt = Space.svg.createSVGPoint();
        this.pt.x = x;
        this.pt.y = y;
    }

    getScreenCTM() {
        return Space.svg.getScreenCTM();
    }

    toCursorPoint() {
        const p = this.pt.matrixTransform(this.getScreenCTM().inverse());
        return [p.x, p.y];
    }

    toScreenPoint() {
        const p = this.pt.matrixTransform(this.getScreenCTM());
        return [p.x, p.y];
    }
}

var numBalloons = 0;

function createBalloon(x, y) {
    const w = 200;
    const h = 200;
    x = x - w / 2;
    y = y - h / 2;

    const div = Space.s.rect(x, y, w, h, 20, 20);
    div.attr({
        id: `balloon${numBalloons}`,
        class: 'balloon',
        stroke: '#123456',
        'strokeWidth': 10,
        fill: 'red',
        'opacity': 0.8
    });

    const fO = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
    fO.setAttribute('id', `fo${numBalloons}`);
    fO.setAttribute('x', x);
    fO.setAttribute('y', y);
    fO.setAttribute('width', w);
    fO.setAttribute('height', h);
    fO.innerHTML = '<div>text</div>';
    div.after(fO);

    numBalloons++;

    return [fO, div];
}

function CreatePath(x, y) {
    var r0 = roundPathCorners('M0 0 L 200 0 L200 200 L 0 200 Z', 20);
    var path = Space.s.path(r0)
        .transform(`translate(${x - 130}, ${y - 130}) scale(1.3)`)
        .remove();

    var r = Snap.path.map(path.realPath, path.matrix);

    path = Space.s.path(r)
        .remove();

    return path;
}

class Balloon {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.W = 100;
        this.H = 100;

        this.grabbed = false;

        const tb = createBalloon(x, y);

        [this.fO, this.div] = tb;

        this.id = this.div.attr('id');

        this.wh = function () {
            var w = this.div.attr('width'),
                h = this.div.attr('height');
            return (new Point(w, h)).toScreenPoint();
        }

        this.w = function () {
            return this.wh()[0];
        }
        this.h = function () {
            return this.wh()[1];
        }

        this.path = CreatePath(x, y);
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
        this.path = CreatePath(this.x + 100, this.y + 100);
    }

    rect() {
        const div = this.div;
        const w = parseFloat(div.attr('width'));
        const h = parseFloat(div.attr('height'));
        const x = parseFloat(div.attr('x'));
        const y = parseFloat(div.attr('y'));
        return [x, y, w, h];
    }

    move(x, y) {
        [x, y] = (new Point(x, y)).toCursorPoint();
        this.div.attr('x', x);
        this.div.attr('y', y);
        this.fO.setAttribute('x', x);
        this.fO.setAttribute('y', y);
        this.x = x;
        this.y = y;
    }
}

var Balloons = {
    balloonsList: [],

    findFromElement: function (element) {
        while (element != null) {
            if (element.parentElement === null) return null;
            if (element.parentElement.tagName === 'svg') {
                break;
            }
            element = element.parentElement;
        }
        if (element == null) return null;

        const id = element.id;
        var name = id;

        if (name == null) return null;

        if (element.tagName === 'foreignObject') {
            return Balloons.findFromForeignId(element.id);
        }

        name = name.replace(/[0-9]*/g, '');
        if (name === 'balloon') {
            return this.findFromId(id);
        } else if (name === 'fo') {
            return this.findFromForeignId(id);
        } else {
            return null;
        }
    },

    findFromId: function (id) {
        const n = this.balloonsList.length;
        const b = this.balloonsList;
        for (let i = 0; i < n; i++) {
            if (b[i].id === id) {
                return b[i];
            }
        }
        return null;
    },

    findFromForeignId: function (id) {
        const n = this.balloonsList.length;
        const b = this.balloonsList;
        for (let i = 0; i < n; i++) {
            if (b[i].fO.getAttribute('id') === id) {
                return b[i];
            }
        }
        return null;
    },

    findFromDiv: function (div) {
        return this.findFromId(div.attr('id'));
    },

    insert: function (balloon) {
        this.balloonsList.push(balloon);
    },

    addBalloon: function (x, y) {
        const b = new Balloon(x, y);
        this.insert(b);
        return b;
    },

    getLast: function () {
        const n = this.balloonsList.length;
        if (n > 0) {
            return this.balloonsList[n - 1];
        } else {
            return null;
        }
    },

    removeLast: function () {
        const b = this.getLast();
        b.div.remove();
        b.div = null;
        b.fO.remove();
        b.fO = null;
        this.balloonsList.pop();
    },

    clear: () => { while (Balloons.balloonsList.length > 0) Balloons.removeLast(); }
};