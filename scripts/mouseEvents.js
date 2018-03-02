setInterval(() => { Space.showHandle(); }, 10);

$('body').contextmenu(() => { return false; });

document.body.ondblclick = (evt) => {
    Space.createElement(evt);
}

document.body.onmousedown = (evt) => {
    Space.grabElement(evt);
};

document.body.onmouseup = () => {
    Space.releaseElement();
};

document.body.onmousemove = (evt) => {
    Space.moveElement(evt);
};