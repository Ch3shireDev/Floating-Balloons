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
        console.log(this.svg.getScreenCTM());
        return this.svg.getScreenCTM();
    },

    toCursorPoint: (x, y) => {
        return (new Point(x, y)).toCursorPoint();
    },

    toScreenPoint: (x, y) => {
        return (new Point(x, y)).toScreenPoint();
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
        this.xy = this.toScreenPoint(event.clientX, event.clientY);

        if (element == null) return;

        if (element.id === 'tarea') {
            Space.mouseDown = false;
            return;
        }

        closeCurrentTextarea();

        if (element.id === 'handle') {
            this.draggingHandle = true;
            this.draggingBalloon = false;
            Balloons.handle.grab();
            return;
        }

        Space.currentElement = Balloons.findFromElement(element);

        if (Space.currentElement != null) {
            Space.draggingBalloon = true;
            Space.draggingHandle = false;
            Space.currentElement.grab();
            //code to avoid jumping balloon on grab
            var [x1, y1, w, h] = Space.currentElement.rect();
            var [x2, y2] = this.toCursorPoint(event.clientX, event.clientY);
            this.dxy = this.toScreenPoint(x2 - x1, y2 - y1);
        }
    },

    moveElement(event) {
        var [x, y] = [event.clientX, event.clientY];
        Space.mousePos = [x, y];
        if (Space.mouseDown) {
            if (Space.draggingBalloon) {
                if (Space.currentElement == null) return;
                var [dx, dy] = this.dxy;
                Space.currentElement.move(x - dx, y - dy);
            }
            else if (Space.draggingHandle) {
                Balloons.handle.move(x, y);
            }
        }
    },

    releaseElement(event) {
        Space.mouseDown = false;
        var [x, y, e] = this.getElement(event);
        if (this.draggingBalloon) {
            Space.dxy = [0, 0];
            this.draggingBalloon = false;
            if (Space.currentElement === null) return;
            Space.currentElement.drop();
        }
        else if (this.draggingHandle) {
            Balloons.handle.drop(x, y, e);
            this.draggingHandle = false;
        }
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
        Balloons.clear();
        this.svg.innerHTML = '';
        var [x, y, w, h] = [0, 0, 800, 600];
        this.s.attr({ viewBox: `${x},${y},${w},${h}` });
    },

    zoom(value) {
        var viewBox = this.s.attr('viewBox');
        var [x, y, w, h] = [viewBox.x, viewBox.y, viewBox.w, viewBox.h];

        var alpha = (w - x) / (h - y);

        x -= value * alpha;
        y -= value;
        w += value * alpha;
        h += value;
        this.s.attr({ viewBox: `${x},${y},${w},${h}` });
    },

    refresh() {
        $('#body').css({ display: 'none' });
        $('#body').css({ display: 'initial' });
    }
}