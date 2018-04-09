setInterval(() => { Space.showHandle(); }, 10);

$('body').contextmenu(() => { return false; });

document.body.ondblclick = (event) => {
    Space.createElement(event);
}

document.body.onmousedown = (event) => {
    Space.grabElement(event);
};

document.body.onmouseup = (event) => {
    Space.releaseElement(event);
};

document.body.onmousemove = (event) => {
    Space.moveElement(event);
};

document.body.onkeyup = (event) => {
    if (event.keyCode == 32) {
        if (!Space.isVisible) {
            Space.show();
        }
        else {
            Space.hide();
        }
    }
};

$(document).mouseout((event) => {
});

$(document).idle({
    onIdle: function () {
        if (Space.draggingSpace) return;
        Space.show();
    },
    idle: 50
})

document.body.addEventListener('wheel',
    (event) => {
        Space.zoom(10 * event.deltaY);
    });

Mouse = {
    runEvent(name, x, y, screen = false) {
        if (!screen) {
            [x, y] = Space.internalToScreen(x, y);
        }
        $('body')[0].dispatchEvent(
            new MouseEvent(name,
                {
                    view: window,
                    clientX: x,
                    clientY: y
                })
        );
    },

    doubleclick(x, y, screen = false) {
        this.runEvent('dblclick', x, y, screen);
    },

    click(x, y, screen = false) {
        this.runEvent('mousedown', x, y, screen);
    },

    move(x, y, screen = false) {
        this.runEvent('mousemove', x, y, screen);
    },

    release(x, y, screen = false) {
        this.runEvent('mouseup', x, y, screen);
    },

    scroll(value) {
        $('body')[0].dispatchEvent(
            new MouseEvent(name,
                {
                    view: window,
                    deltaY: 10 * value
                })
        );
    }
};