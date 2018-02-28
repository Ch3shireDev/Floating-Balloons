var mouseDown = false;
var editOpen = false;
var xy = { x: 0, y: 0 };
var dxy = { x: 0, y: 0 };

var currElement = null;

$('body').dblclick(function (event) {
    var x = event.clientX,
        y = event.clientY;
    const element = document.elementFromPoint(x, y);
    const tag = element.tagName.toLowerCase();

    if (tag === 'svg') {
        [x, y] = cursorPoint(x, y);
        Balloons.addBalloon(x, y);
    } else {
        const b = Balloons.findFromElement(element);
        if (b != null) {
            b.openContent();
            $('#tarea').onclick = function () {
            };
        }
    }
});

document.body.onmousedown = (evt) => {
    mouseDown = true;
    var x = evt.clientX, y = evt.clientY;
    xy = { x: x, y: y };

    var element = document.elementFromPoint(x, y);
    if (element == null) return;

    if (element.id === 'tarea') {
        mouseDown = false;
        return;
    }
    closeCurrentTextarea();

    currElement = Balloons.findFromElement(element);
    if (currElement == null) {
        return;
    }

    if (currElement != null) {
        currElement.grab();
    }

    //code to avoid jumping balloon on grab
    var [x0, y0, w, h] = currElement.rect();
    var [x1, y1] = cursorPoint(x, y);

    var [xx, yy] = screenPoint(x1 - x0, y1 - y0);

    dxy.x = xx;
    dxy.y = yy;
};

$('body').contextmenu(() => {
    return false;
});

document.body.onmouseup = () => {
    mouseDown = false;
    if (currElement != null) {
        var [x, y] = cursorPoint(mousePos.x, mousePos.y);
        currElement.drop();
        dxy.x = 0;
        dxy.y = 0;
    }
};

var isDragging = false;

var oldCircle = null;

var mousePos = { x: 0, y: 0 };

document.body.onmousemove = (evt) => {
    const x = evt.clientX;
    const y = evt.clientY;
    mousePos = { x: x, y: y };
    if (currElement == null) return;

    if (mouseDown) {
        const dx = x - xy.x;
        const dy = y - xy.y;
        if (dx * dx + dy * dy > 10) {
            isDragging = true;
            currElement.move(x - dxy.x, y - dxy.y);
        }
    }
};

var circlet = null;

setInterval(
    function (e) {
        showHandle();
    },
    1);

function showHandle() {
    var b = Balloons.getLast();
    if (b === null) return;
    var p = b.path;
    if (p === null) return;
    var [x, y] = cursorPoint(mousePos.x, mousePos.y);
    var r = Snap.closestPoint(p, x, y);
    if (circlet === null) {
        circlet = s.rect(r.x, r.y, 20, 20, 5);
        circlet.attr({
            id: 'handle',
            stroke: '#123456',
            'strokeWidth': 5,
            fill: 'red',
            'opacity': 0.8
        });
    }
    else {
        circlet.attr('x', r.x - 10);
        circlet.attr('y', r.y - 10);
    }
}