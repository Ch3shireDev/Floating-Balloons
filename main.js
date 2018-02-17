﻿var s = Snap('#body');
var svg = document.querySelector('svg');
var pt = svg.createSVGPoint();

var numBalloons = 0;

function createBalloon(x, y) {
    pt = cursorPoint(x, y);
    x = pt.x - 100;
    y = pt.y - 100;

    const w = 200;
    const h = 200;

    const div = s.rect(x, y, w, h, 200, 200);
    div.attr({
        id: `balloon${numBalloons}`,
        stroke: '#123456',
        'strokeWidth': 20,
        fill: 'red',
        'opacity': 0.8
    });

    const fO = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
    fO.setAttribute('id', `fo${numBalloons}`);
    fO.setAttribute('x', x);
    fO.setAttribute('y', y);
    fO.setAttribute('width', w);
    fO.setAttribute('height', h);
    fO.innerHTML = 'text';
    div.after(fO);

    numBalloons++;

    return [fO, div];
}

function cursorPoint(x, y) {
    pt.x = x;
    pt.y = y;
    return pt.matrixTransform(svg.getScreenCTM().inverse());
}

function Balloon(x, y) {
    this.x = x;
    this.y = y;

    this.W = 100;
    this.H = 100;

    this.grabbed = false;

    const tb = createBalloon(x, y);

    [this.fO, this.div] = tb;

    this.id = this.div.attr('id');

    this.move = function(x, y) {
        const w = this.W;
        const h = this.H;

        x = x - w / 2;
        y = y - h / 2;

        pt = cursorPoint(x, y);

        x = pt.x;
        y = pt.y;

        this.div.attr('x', x);
        this.div.attr('y', y);

        this.fO.setAttribute('x', x);
        this.fO.setAttribute('y', y);
    };

    this.isGrabbed = function() {
        return this.grabbed;
    };

    this.grab = function() {
        this.grabbed = true;
        this.bringToFront();
    };

    this.bringToFront = function() {
        //probably not the best way to accomplish that
        this.div.remove();
        this.fO.remove();
        s.append(this.div);
        svg.appendChild(this.fO);
    };

    this.drop = function() {
        this.grabbed = false;
    };

    this.rect = function() {
        const div = this.div;
        const w = parseFloat(div.attr('width'));
        const h = parseFloat(div.attr('height'));
        const x = parseFloat(div.attr('x'));
        const y = parseFloat(div.attr('y'));
        return [x, y, w, h];
    };

    this.openContent = function() {
        closeCurrentTextarea();
        const x = this.fO.innerHTML;
        this.fO.innerHTML = '<textarea>Abc</textarea>';
        currentTextareaBalloon = this;
    };
}

var currentTextareaBalloon = null;

function closeCurrentTextarea() {
    if (currentTextareaBalloon === null) return;
    if (currentTextareaBalloon.fO === null) return;
    var str = $(currentTextareaBalloon.fO.innerHTML);
    str = str.text();
    currentTextareaBalloon.fO.innerHTML = str;
    currentTextareaBalloon = null;
}

var Balloons = {
    balloonsList: [],

    findFromElement: function(element) {

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
        console.log(element);

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

    findFromId: function(id) {
        const n = this.balloonsList.length;
        const b = this.balloonsList;
        for (let i = 0; i < n; i++) {
            if (b[i].id === id) {
                return b[i];
            }
        }
        return null;
    },

    findFromForeignId: function(id) {
        const n = this.balloonsList.length;
        const b = this.balloonsList;
        for (let i = 0; i < n; i++) {
            if (b[i].fO.getAttribute('id') === id) {
                return b[i];
            }
        }
        return null;
    },

    findFromDiv: function(div) {
        return this.findFromId(div.attr('id'));
    },

    insert: function(balloon) {
        this.balloonsList.push(balloon);
    },

    addBalloon: function(x, y) {
        const b = new Balloon(x, y);
        this.insert(b);
        return b;
    },

    getLast: function() {
        const n = this.balloonsList.length;
        if (n > 0) {
            return this.balloonsList[n - 1];
        } else {
            return null;
        }
    },

    removeLast: function() {
        const b = this.getLast();
        b.div.remove();
        b.div = null;
        b.fO.remove();
        b.fO = null;
        this.balloonsList.pop();
    }
};

var mouseDown = false;
var editOpen = false;
var xy = {};

var currElement = null;

document.body.onmousedown = (evt) => {
    mouseDown = true;
    var x = evt.clientX, y = evt.clientY;
    xy = { x: x, y: y };

    var element = document.elementFromPoint(x, y);

    if (element == null) return;
    console.log(element.tagName);
    if (element.tagName.toLowerCase() === 'textarea') return;
    closeCurrentTextarea();

    currElement = Balloons.findFromElement(element);

    if (currElement != null) {
        currElement.grab();
    }
};

$('body').dblclick(function(event) {
    const x = event.clientX;
    const y = event.clientY;
    const element = document.elementFromPoint(x, y);
    const tag = element.tagName.toLowerCase();

    if (tag === 'svg') {
        Balloons.addBalloon(x, y);
    } else {
        console.log('double click');
        const b = Balloons.findFromElement(element);
        console.log(b);
        if (b != null) {
            b.openContent();
        }
    }
});

$('body').contextmenu(() => {
    return false;
});

document.body.onmouseup = () => {
    mouseDown = false;
    if (currElement != null) {
        currElement.drop();
    }
};

var isDragging = false;
document.body.onmousemove = (evt) => {
    if (mouseDown) {
        const x = evt.clientX;
        const y = evt.clientY;
        const dx = x - xy.x;
        const dy = y - xy.y;
        if (dx * dx + dy * dy > 10) {
            isDragging = true;
            dragSelectedObject(x, y);
        }
    }
};

function dragSelectedObject(x, y) {
    if (currElement != null) {
        currElement.move(x, y);
    }
}