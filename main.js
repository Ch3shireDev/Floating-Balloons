var s = Snap('#body');
var svg = document.querySelector('svg');
var pt = svg.createSVGPoint();

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

    this.div = createBalloon(x, y);
    this.id = this.div.attr('id');

    this.Move = function (x, y) {
        const w = this.W;
        const h = this.H;

        x = x - w / 2;
        y = y - h / 2;

        pt = cursorPoint(x, y);

        x = pt.x;
        y = pt.y;

        this.div.attr('x', x);
        this.div.attr('y', y);
    }

    this.isGrabbed = function () {
        return this.grabbed;
    }

    this.grab = function () {
        this.grabbed = true;
    }

    this.drop = function () {
        this.grabbed = false;
    }

    this.rect = function () {
        var div = this.div;
        var w = parseFloat(div.attr('width')),
            h = parseFloat(div.attr('height')),
            x = parseFloat(div.attr('x')),
            y = parseFloat(div.attr('y'));
        return [x, y, w, h];
    }
}

var Balloons = {
    balloonsList: [],

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

    findFromDiv: function (div) {
        return this.findFromId(div.attr('id'));
    },

    insert: function (balloon) {
        this.balloonsList.push(balloon);
    },

    addBalloon: function (x, y) {
        this.insert(new Balloon(x, y));
    },

    getLastBalloon: function () {
        const n = this.balloonsList.length;
        if (n > 0) {
            return this.balloonsList[n - 1];
        } else {
            return null;
        }
    },

    removeLast: function () {
        var b = this.getLastBalloon();
        b.div.remove();
        this.balloonsList.pop();
    }
};

var numBalloons = 0;

function createBalloon(x, y) {
    pt = cursorPoint(x, y);
    x = pt.x - 100;
    y = pt.y - 100;

    const div = s.rect(x, y, 200, 200, 200, 200);
    div.attr({
        id: `balloon${numBalloons}`,
        stroke: '#123456',
        'strokeWidth': 20,
        fill: 'red',
        'opacity': 0.8
    });

    numBalloons++;

    return div;
}

$('body').dblclick(function (event) {
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

    var id = element.id;
    console.log(element.outerHTML);
    currElement = Balloons.findFromId(id);
    currElement.grab();
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
        currElement.Move(x, y);
    }
}