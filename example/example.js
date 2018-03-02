var attr = {
    fill: 'transparent',
    stroke: 'black'
};

var s = Snap('svg');

var p0 = roundPathCorners('M0 0 L 100 0 L100 100 L 0 100 Z', 20);
var p = Space.s.path(p0)
    .transform('translate(70, 50) scale(2)')
    .attr(attr);

var r = Snap.path.map(p.realPath, p.matrix);

p.remove();
p = Space.s.path(r).attr(attr);
p.remove();

var mousePos = [0, 0];

document.body.onmousemove = (ev) => {
    mousePos = [ev.pageX, ev.pageY];
}

setInterval(() => {
    var [x, y] = mousePos;
    var r2 = Snap.closestPoint(p, x, y);
}, 50);