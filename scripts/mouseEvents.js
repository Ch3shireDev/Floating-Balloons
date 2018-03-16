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
    //if (event.target.id === 'body') {
    //    if (event.relatedTarget === null) {
    //        Space.leave(event);
    //    }
    //}
});

$(document).idle({
    onIdle: function () {
        Space.show();
    },
    idle: 10
})

document.body.addEventListener('wheel',
    (event) => {
        Space.zoom(10 * event.deltaY);
    });

Mouse = {
    runEvent(name, x, y) {
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