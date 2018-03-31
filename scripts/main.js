var b1 = Balloons.addBalloon(500, 500);
//Space.zoom(1000);
//var value = 1000;
//var [x, y, w, h] = Space.point.getRect();
//var alpha = w / h;
//x += value * alpha / 2;
//y += value / 2;
//w -= value * alpha;
//h -= value;
//Space.point.update(x, y, w, h);
Space.refresh();
var b2 = Balloons.addBalloon(500, 500);
Space.refresh();

var [x1, y1] = b1.getXY();
var [x2, y2] = b2.getXY();

console.log(x1, y1, x2, y2);