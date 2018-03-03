setInterval(() => { Space.showHandle(); }, 10);

$('body').contextmenu(() => { return false; });

document.body.ondblclick = (event) => {
    Space.createElement(event);
}

document.body.onmousedown = (event) => {
    Space.grabElement(event);
};

document.body.onmouseup = () => {
    Space.releaseElement();
};

document.body.onmousemove = (event) => {
    Space.moveElement(event);
};

Mouse = {
    runEvent(name, x, y) {
        var [x, y] = Space.screenPoint(x, y);
        $('body')[0].dispatchEvent(
            new MouseEvent(name,
                {
                    view: window,
                    clientX: x,
                    clientY: y
                })
        );
    },

    doubleclick(x, y) {
        this.runEvent('dblclick', x, y);
    },

    click(x, y) {
        this.runEvent('mousedown', x, y);
    },

    move(x, y) {
        this.runEvent('mousemove', x, y);
    },

    release(x, y) {
        this.runEvent('mouseup', x, y);
    }
};