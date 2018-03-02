var Space = {
    circlet: null,
    currentElement: null,
    mouseDown: false,
    isDragging: false,
    s: Snap('#body'),
    svg: document.querySelector('svg'),
    xy: [0, 0],
    dxy: [0, 0],
    mousePos: [0, 0],

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
        Space.mouseDown = true;
        var [x, y, element] = Space.getElement(evt);
        Space.xy = [evt.clientX, evt.clientY];

        if (element == null) return;

        if (element.id === 'tarea') {
            Space.mouseDown = false;
            return;
        }
        closeCurrentTextarea();
        Space.currentElement = Balloons.findFromElement(element);
        if (Space.currentElement == null) {
            return;
        }

        if (Space.currentElement != null) {
            Space.currentElement.grab();
        }

        //code to avoid jumping balloon on grab
        var [x0, y0, ,] = Space.currentElement.rect();
        Space.dxy = Space.screenPoint(x - x0, y - y0);
    },

    releaseElement: () => {
        Space.mouseDown = false;
        if (Space.currentElement != null) {
            Space.currentElement.drop();
            Space.dxy = [0, 0];
        }
    },

    moveElement: (evt) => {
        const [x, y] = [evt.clientX, evt.clientY];
        Space.mousePos = [x, y];
        if (Space.currentElement == null) return;

        if (Space.mouseDown) {
            const [dx, dy] = [x - Space.xy[0], y - Space.xy[1]];
            if (dx * dx + dy * dy > 10) {
                Space.isDragging = true;
                Space.currentElement.move(x - Space.dxy[0], y - Space.dxy[1]);
            }
        }
    },

    createElement: (evt) => {
        var [x, y, element] = Space.getElement(evt);

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
    },

    showHandle: () => {
        var b = Balloons.getLast();
        if (b === null) return;
        var p = b.path;
        if (p === null) return;
        var [x, y] = Space.cursorPoint(Space.mousePos[0], Space.mousePos[1]);
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
}