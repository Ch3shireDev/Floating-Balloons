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

    if (mouseDown) {
        if (currElement == null) return;

        const dx = x - xy.x;
        const dy = y - xy.y;
        if (dx * dx + dy * dy > 10) {
            isDragging = true;
            currElement.move(x - dxy.x, y - dxy.y);
        }
    }
};

function Distance() {
    //alert("distance");
}

setInterval(function (e) {
    var b = Balloons.getLast();
    if (b != null) {
        var rect = b.rect();

        var x0 = rect[0] + rect[2] / 2,
            y0 = rect[1] + rect[3] / 2,
            [x1, y1] = cursorPoint(mousePos.x, mousePos.y);

        var r0 = [x0, y0],
            r1 = [x1, y1];

        var element = document.elementFromPoint(x1, y1);
        if (b === Balloons.findFromElement(element)) return;

        var x2 = 0,
            y2 = 0;

        for (var i = 0; i < 20; i++) {
            var x = (t) => { return r0[0] + t * (r1[0] - r0[0]); }
            var y = (t) => { return r0[1] + t * (r1[1] - r0[1]); }
            var p = (t) => { return [x(t), y(t)]; }

            var p2 = p(0.5);

            x2 = p2[0];
            y2 = p2[1];

            var [x3, y3] = screenPoint(x2, y2);

            element = document.elementFromPoint(x3, y3);
            if (b === Balloons.findFromElement(element))
                r0 = p2;
            else
                r1 = p2;
        }

        s.circle(r0[0], r0[1], 2).attr({ fill: "blue" });
        s.circle(r1[0], r1[1], 2).attr({ fill: "red" });
    }
}, 10);