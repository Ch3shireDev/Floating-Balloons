Balloons.addBalloon(500, 500);
Balloons.addBalloon(1700, 500);
Balloons.addBalloon(500, 800);
Balloons.addBalloon(1000, 1000);

var s = Balloons.serialize();
Space.clear();
Balloons.deserialize(s);