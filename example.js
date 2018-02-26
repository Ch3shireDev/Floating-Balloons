var attr = {
    fill: 'transparent',
    stroke: 'black'
};

var s = Snap('svg');

var p0 = roundPathCorners('M0 0 L 100 0 L100 100 L 0 100 Z', 20);
var p = s.path(p0)
    .transform('translate(70, 50) scale(2)')
    .attr(attr);

var r = Snap.path.map(p.realPath, p.matrix);

p.remove();
p = s.path(r).attr(attr);

var mousePos = [0, 0];

document.body.onmousemove = (ev) => {
    mousePos = [ev.pageX, ev.pageY];
    console.log(mousePos);

    var r = mousePos;

    var [x, y] = r;

    var r = Snap.closestPoint(p, x, y);

    s.circle(r.x, r.y, 2);
    s.circle(x, y, 2);
}