var Space = {
    currentElement: null,
    mouseDown: false,
    draggingBalloon: false,
    draggingHandle: false,
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

        if (element.id === 'handle') {
            this.draggingHandle = true;
            Balloons.handle.grab();
            return;
        }

        Space.currentElement = Balloons.findFromElement(element);
        
        if (Space.currentElement != null) {
            Space.draggingBalloon = true;
            Space.currentElement.grab();
            //code to avoid jumping balloon on grab
            const [x0, y0, ,] = Space.currentElement.rect();
            Space.dxy = Space.screenPoint(x - x0, y - y0);
        }
    },

    releaseElement: () => {
        Space.mouseDown = false;
        if (Space.currentElement != null) {
            Space.currentElement.drop();
            Space.dxy = [0, 0];
        }
    },

    moveElement: (evt) => {
        var [x, y] = [evt.clientX, evt.clientY];
        Space.mousePos = [x, y];
        if (Space.currentElement == null) return;

        if (Space.mouseDown) {
            const [dx, dy] = [x - Space.xy[0], y - Space.xy[1]];
            [x, y] = [x - Space.dxy[0], y - Space.dxy[1]];
            if (dx * dx + dy * dy > 10) {
                if (Space.draggingBalloon) {
                    Space.currentElement.move(x, y);
                }
                else if (Space.draggingHandle) {
                    Balloons.handle.move(x, y);
                }
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

    showHandle: () => {Balloons.showHandle();}
}