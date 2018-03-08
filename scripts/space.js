var Space = {
    currentElement: null,
    handle: null,
    mouseDown: false,
    draggingBalloon: false,
    draggingHandle: false,
    draggingSpace: false,
    s: Snap('#body'),
    svg: document.querySelector('svg'),
    xy: [0, 0],
    dxy: [0, 0],
    mousePos: [0, 0],

    ScreenCTM() {
        console.log(this.svg.getScreenCTM());
        return this.svg.getScreenCTM();
    },

    toCursorPoint(x, y) {
        return (new Point(x, y)).toCursorPoint();
    },

    toScreenPoint(x, y) {
        return (new Point(x, y)).toScreenPoint();
    },

    leave(event) {
        Space.mouseDown = false;
    },

    getElement(event) {
        var x = event.clientX,
            y = event.clientY,
            e = document.elementFromPoint(x, y);
        [x, y] = Space.toCursorPoint(x, y);
        return [x, y, e];
    },

    grabElement(event) {
        Space.mouseDown = true;
        var [x, y, element] = Space.getElement(event);
        this.xy = Space.toCursorPoint(event.clientX, event.clientY);
        this.draggingBalloon = false;
        this.draggingHandle = false;
        this.draggingSpace = false;

        if (element == null) return;

        if (element.id === 'tarea') {
            Space.mouseDown = false;
        }
        else {
            closeCurrentTextarea();

            if (element.id === 'body') {
                Space.draggingSpace = true;
            }

            if (element.id === 'handle') {
                this.draggingHandle = true;
                Space.handle.grab();
                return;
            }

            Space.currentElement = Balloons.findFromElement(element);

            if (Space.currentElement != null) {
                Space.draggingBalloon = true;
                Space.currentElement.grab();
            }
        }
    },

    moveSpace(dx, dy) {
        var [x, y, w, h] = this.viewBox();
        dx *= 0.5;
        dy *= 0.5;
        this.viewBox(x - dx, y - dy, w, h);
    },

    moveElement(event) {
        if (event === null) return;
        if (typeof event == 'undefined') return;
        var [x1, y1] = Space.toCursorPoint(event.clientX, event.clientY);
        var [x0, y0] = this.xy;
        Space.mousePos = [event.clientX, event.clientY];
        var [dx, dy] = [x1 - x0, y1 - y0];
        this.xy = [x1, y1];
        if (event.buttons !== 1) return;
        if (Space.mouseDown === false) return;
        if (Space.draggingBalloon) {
            if (Space.currentElement == null) return;
            var [x, y] = Space.currentElement.getXY();
            [x, y] = Space.toScreenPoint(x + dx, y + dy);
            Space.currentElement.move(x, y);
        }
        else if (Space.draggingHandle) {
            var [x, y] = Space.handle.getXY();
            [x, y] = Space.toScreenPoint(x + dx, y + dy);
            Space.handle.move(x, y);
        }
        else if (Space.draggingSpace) {
            this.moveSpace(dx, dy);
        }
    },

    releaseElement(event) {
        Space.mouseDown = false;
        var [x, y, e] = this.getElement(event);
        if (this.draggingBalloon) {
            Space.dxy = [0, 0];
            if (Space.currentElement !== null) {
                Space.currentElement.drop();
            }
        }
        else if (this.draggingHandle) {
            Space.handle.drop(x, y, e);
        }
        this.draggingBalloon = false;
        this.draggingHandle = false;
        this.draggingSpace = false;
    },

    createElement(event) {
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
    },

    showHandle() {
        Balloons.showHandle();
    },

    clear() {
        this.currentElement = null;
        this.draggingBalloon = false;
        this.draggingHandle = false;
        this.draggingSpace = false;
        Balloons.clear();
        this.svg.innerHTML = '';
        var [x, y, w, h] = [0, 0, 800, 600];
        this.s.attr({ viewBox: `${x},${y},${w},${h}` });
    },

    viewBox(x, y, w, h) {
        if (x === undefined) {
            var vb = this.s.attr('viewBox');
            return [vb.x, vb.y, vb.w, vb.h];
        }
        else if (h !== undefined) {
            this.s.attr({ viewBox: `${x},${y},${w},${h}` });
        }
    },

    zoom(value) {
        var [x, y, w, h] = this.viewBox();
        var alpha = (w - x) / (h - y);
        x -= value * alpha / 2;
        y -= value / 2;
        w += value * alpha;
        h += value;
        this.viewBox(x, y, w, h);
    },

    refresh() {
        $('#body').css({ display: 'none' });
        $('#body').css({ display: 'initial' });
    }
}

Space.clear();