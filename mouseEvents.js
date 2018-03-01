var dxy = [0, 0];
var mousePos = { x: 0, y: 0 };

var mouseDown = false;
var editOpen = false;
var isDragging = false;
var oldCircle = null;

setInterval(() => { showHandle(); }, 10);

$('body').contextmenu(() => { return false; });

document.body.ondblclick = (event) => {
    var [x, y, element] = Space.getElement(event);

    const tag = element.tagName.toLowerCase();

    if (tag === 'svg') {
        Balloons.addBalloon(x, y);
    }
    else {
        const b = Balloons.findFromElement(element);
        if (b != null) {
            b.openContent();
            $('#tarea').onclick = () => { };
        }
    }
}

document.body.onmousedown = (evt) => {
    mouseDown = true;
    var [x, y, element] = Space.getElement(evt);
    Space.xy = [evt.clientX, evt.clientY];

    if (element == null) return;

    if (element.id === 'tarea') {
        mouseDown = false;
        return;
    }
    closeCurrentTextarea();
    Space.grabElement(evt);
    //var [x, y, element] = Space.getElement(evt);
    Space.currentElement = Balloons.findFromElement(element);
    if (Space.currentElement == null) {
        return;
    }

    if (Space.currentElement != null) {
        Space.currentElement.grab();
    }

    //code to avoid jumping balloon on grab
    var [x0, y0, ,] = Space.currentElement.rect();
    dxy = Space.screenPoint(x - x0, y - y0);
};

document.body.onmouseup = () => {
    mouseDown = false;
    if (Space.currentElement != null) {
        Space.currentElement.drop();
        dxy = [0, 0];
    }
};

document.body.onmousemove = (evt) => {
    const x = evt.clientX;
    const y = evt.clientY;
    mousePos = { x: x, y: y };
    if (Space.currentElement == null) return;

    if (mouseDown) {
        const [dx, dy] = [x - Space.xy[0], y - Space.xy[1]];
        if (dx * dx + dy * dy > 10) {
            isDragging = true;
            Space.currentElement.move(x - dxy[0], y - dxy[1]);
        }
    }
};

function showHandle() {
    var b = Balloons.getLast();
    if (b === null) return;
    var p = b.path;
    if (p === null) return;
    var [x, y] = Space.cursorPoint(mousePos.x, mousePos.y);
    var r = Snap.closestPoint(p, x, y);
    if (Space.circlet === null) {
        Space.circlet = Space.s.rect(0, 0, 40, 40, 10);
        Space.circlet.attr({
            id: 'handle',
            stroke: '#123456',
            'strokeWidth': 5,
            fill: 'red'
        });
    }

    Space.circlet.attr('x', r.x - 20);
    Space.circlet.attr('y', r.y - 20);

    //var d = r.distance / 20;
    var opacity = 0.8;//Math.exp(-d * d / 2);

    Space.circlet.attr('opacity', opacity);
}