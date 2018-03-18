﻿var Space = {
    currentElement: null,
    handle: null,
    mouseDown: false,
    draggingBalloon: false,
    draggingHandle: false,
    draggingSpace: false,
    autoText: true,
    moveChildren: true,
    isVisible: true,
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
        this.hide();
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

        if (Space.handle !== null) {
        }

        if (typeof Space.isTesting === 'undefined' && event.buttons !== 1) return;
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
                Balloons.drop();
                //Space.currentElement.drop();
            }
        }
        else if (this.draggingHandle) {
            Space.handle.drop(x, y, event);
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
        if (Balloons.getLast() === null) return;
        if (Space.handle === null) {
            Space.handle = new Handle();
        }
        this.handle.showHandle();
    },

    clear() {
        this.currentElement = null;
        this.handle = null;
        this.draggingBalloon = false;
        this.draggingHandle = false;
        this.draggingSpace = false;
        this.moveChildren = true;
        Balloons.clear();
        this.svg.innerHTML = '';
        var [x, y, w, h] = [0, 0, 3200, 2400];
        this.s.attr({ viewBox: `${x},${y},${w},${h}` });
        this.svg.innerHTML += '<marker id="arrowhead" markerWidth="10" markerHeight="7" refX = "0" refY= "3.5" orient= "auto" ><polygon points="0 0, 10 3.5, 0 7" /></marker >';
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

    getXY() {
        const [x, y, ,] = this.viewBox();
        return [x, y];
    },

    zoom(value) {
        this.hide();
        var [x, y, w, h] = this.viewBox();
        var alpha = w / h;
        x -= value * alpha / 2;
        y -= value / 2;
        w += value * alpha;
        h += value;
        this.viewBox(x, y, w, h);
    },

    hide() {
        var tab = $('#body').children();
        var n = tab.length;
        for (var i = 0; i < n; i++) {
            if ($(tab[i]).attr('class') !== 'arrow') continue;
            $(tab[i]).css({ display: 'none' });
        }
        this.isVisible = false;
    },

    show() {
        var tab = $('#body').children();
        var n = tab.length;
        for (var i = 0; i < n; i++) {
            $(tab[i]).css({ display: 'initial' });
        }
        this.isVisible = true;
    }
}

Space.clear();