var s = Snap('#body');
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
    fO.setAttribute('width', 2 * w);
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
}

var Balloons = {
    balloonsList: [],

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

    getLastBalloon: function() {
        const n = this.balloonsList.length;
        if (n > 0) {
            return this.balloonsList[n - 1];
        } else {
            return null;
        }
    },

    removeLast: function() {
        const b = this.getLastBalloon();
        b.div.remove();
        b.div = null;
        b.fO.remove();
        b.fO = null;
        this.balloonsList.pop();
    }
};

$('body').dblclick(function(event) {
    const x = event.clientX;
    const y = event.clientY;
    const element = document.elementFromPoint(x, y);
    const tag = element.tagName.toLowerCase();

    if (tag === 'svg') {
        Balloons.addBalloon(x, y);
    } else if (tag === 'rect') {
        //OpenBalloonContent(element);
    }
});

$('body').contextmenu(() => {
    return false;
});

var mouseDown = false;
var xy = {};

var currElement = null;

document.body.onmousedown = (evt) => {
    mouseDown = true;
    var x = evt.clientX, y = evt.clientY;
    xy = { x: x, y: y };

    var element = document.elementFromPoint(x, y);

    if (element == null) return;

    if (element.tagName === 'foreignObject') {
        currElement = Balloons.findFromForeignId(element.id);
    } else {
        currElement = Balloons.findFromId(element.id);
    }

    if (currElement != null) {
        currElement.grab();
    }
};

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
        if (dx * dx + dy * dy > 1000) {
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