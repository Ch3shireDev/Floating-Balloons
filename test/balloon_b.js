describe('Balloon behavior',
    () => {
        it('should understand double click as a command to create a new bubble',
            () => {
                Space.clear();
                function checkBalloonCreation() {
                    Mouse.doubleclick(x0, y0);
                    var b = Balloons.getLast();
                    b.should.not.equal(null);
                    var [x, y] = b.getXY();
                    (x0 - x - b.W() / 2).should.be.below(10);
                    (y0 - y - b.H() / 2).should.be.below(10);
                    Space.clear();
                }

                checkBalloonCreation();
                Space.zoom(1000);
                checkBalloonCreation();
                Mouse.click(x0, y0);
                Mouse.move(x0 + 100, y0 + 100);
                Mouse.release(x0 + 100, y0 + 100);
                checkBalloonCreation();
            });

        it('should allow to move space properly',
            () => {
                function checkMovingSpace() {
                    Space.isTesting = true;
                    Mouse.doubleclick(x0, y0);
                    var b = Balloons.getLast();
                    var [x1, y1] = b.getXY();
                    Mouse.click(x0 + 300, y0 + 300);
                    b.isGrabbed().should.be.equal(false);
                    Space.draggingSpace.should.be.equal(true);
                    Mouse.move(x0 + 400, y0 + 400);
                    var [x2, y2] = b.getXY();
                    Math.abs(x2 - x1 - b.W() / 2).should.be.below(10);
                    Math.abs(y2 - y1 - b.H() / 2).should.be.below(10);
                    Mouse.release(x0, y0);
                    Space.clear();
                }
                checkMovingSpace();
                Space.zoom(1000);
                checkMovingSpace();
            });

        it('should not drastically move created balloon after moving space to different place',
            () => {
                function checkCreation() {
                    var dx = 80;
                    Space.isTesting = true;
                    Space.draggingSpace.should.equal(false);
                    Mouse.click(x0, y0);
                    Space.draggingSpace.should.equal(true);
                    Mouse.move(x0 + dx, y0 + dx);
                    Mouse.release(x0 + dx, y0 + dx);

                    var b = Balloons.addBalloon(x0, y0);
                    var [x1, y1] = b.getXY();
                    [x1, y1] = [x1 + b.W() / 2, y1 + b.H() / 2];

                    Math.abs(x1 - x0 - dx).should.be.below(10);
                    Math.abs(y1 - y0 - dx).should.be.below(10);

                    Balloons.refresh();
                    var [x2, y2] = b.getXY();
                    [x2, y2] = [x2 + b.W() / 2, y2 + b.H() / 2];
                    Math.abs(x1 - x2).should.be.below(20);
                    Math.abs(y1 - y2).should.be.below(20);
                    Space.clear();
                }

                Space.clear();
                checkCreation();
                Space.zoom(1000);
                var dx = 80;
                Space.isTesting = true;
                Space.draggingSpace.should.equal(false);
                Mouse.click(x0, y0);
                Space.draggingSpace.should.equal(true);
                Mouse.move(x0 + dx, y0 + dx);
                Mouse.release(x0 + dx, y0 + dx);

                var b = Balloons.addBalloon(x0, y0);
                var [x1, y1] = b.getXY();
                [x1, y1] = [x1 + b.W() / 2, y1 + b.H() / 2];

                Math.abs(x1 - x0 - 460).should.be.below(10);
                Math.abs(y1 - y0 - 357).should.be.below(10);

                Balloons.refresh();
                var [x2, y2] = b.getXY();
                [x2, y2] = [x2 + b.W() / 2, y2 + b.H() / 2];
                Math.abs(x1 - x2).should.be.below(20);
                Math.abs(y1 - y2).should.be.below(20);
                Space.clear();
            });

        it('should not drastically move moved balloon after moving space',
            () => {
                Space.clear();
                Space.isTesting = true;
                Space.point.x.should.equal(0);
                Space.draggingSpace.should.equal(false);
                Mouse.click(x0, y0);
                Space.draggingSpace.should.equal(true);
                var dx = 50;
                Mouse.move(x0 + dx, y0);
                Mouse.release(x0 + dx, y0);
                Math.abs(Space.point.x + dx).should.be.below(10);
                var b = Balloons.addBalloon(x0, y0);
                Mouse.click(x0, y0);
                b.isGrabbed().should.equal(true);
                Mouse.move(x0 + dx, y0 + dx);
                Mouse.release();
                var [x1, y1] = b.getXY();
                Balloons.refresh();
                var [x2, y2] = b.getXY();
                Math.abs(x1 - x2).should.be.below(20);
                Math.abs(y1 - y2).should.be.below(20);
                Space.useViewBox = true;
                Space.clear();
            });

        it('should not move path after grabbing space',
            () => {
                Space.isTesting = true;
                Space.point.x.should.equal(0);
                var b = Balloons.addBalloon(x0, y0);
                Space.showHandle();
                var [x1, y1] = [b.pathx, b.pathy];
                b.drop();
                Space.showHandle();
                var [x2, y2] = [b.pathx, b.pathy];
                Math.abs(x1 - x2).should.be.below(10);
                Math.abs(y1 - y2).should.be.below(10);
                Space.useViewBox = true;
                Space.clear();
            });

        it('should allow to zoom-in and out balloons',
            () => {
                var [w, h] = Space.point.getWH0();
                var b = Balloons.addBalloon(600, 800);
                var [x1, y1] = b.getXY();
                var [dx1, dy1] = [w / 2 - x1, h / 2 - y1];
                var [w1, h1] = b.getAttrWH();
                var alpha1 = w1 / h1;
                Space.zoom(1000);
                var [x2, y2] = b.getXY();
                var [dx2, dy2] = [w / 2 - x2, h / 2 - y2];
                var [w2, h2] = b.getAttrWH();
                w2.should.be.below(w1);
                h2.should.be.below(h1);
                Math.abs(dy1 / dx1 - dy2 / dx2).should.be.below(0.05);
                Space.useViewBox = true;
                Space.clear();
            });

        it('should create balloons in same place after zoom',
            () => {
                var b1 = Balloons.addBalloon(500, 500);
                Space.zoom(1000);
                Space.refresh();
                var b2 = Balloons.addBalloon(500, 500);
                Space.refresh();

                var [x1, y1] = b1.getXY();
                var [x2, y2] = b2.getXY();
                console.log(x1, y1, x2, y2);

                Math.abs(x1 - x2).should.be.below(10);
                Math.abs(y1 - y2).should.be.below(10);

                Space.useViewBox = true;
                Space.clear();
            });

        it('should move handle properly after zooming',
            () => {
                var b1 = Balloons.addBalloon(500, 500);
                Space.zoom(1000);
                Space.refresh();
                b1.drop();
                Mouse.move(300 - Space.point.x, 400 - Space.point.y);
                Space.showHandle();
                Mouse.move(600 - Space.point.x, 400 - Space.point.y);
                Space.showHandle();
                Space.useViewBox = true;
                Space.clear();
            });

        it('should be grabbed on click-and-hold',
            () => {
                Mouse.doubleclick(x0, y0);
                Mouse.click(x0, y0);

                Balloons.getLast().isGrabbed().should.equal(true);
                Space.clear();
            });

        it('should move with cursor when grabbed',
            () => {
                var [dx, dy] = [10, 20];

                Mouse.doubleclick(x0, y0);

                var b = Balloons.getLast();
                var [x2, y2] = b.getXY();

                Space.draggingBalloon.should.equal(false);
                Mouse.click(x0, y0);
                Space.draggingBalloon.should.equal(true);
                Mouse.move(x0 + dx, y0 + dy);
                Mouse.release(x0 + dx, y0 + dy);

                var [x3, y3] = [b.div.attr('x'), b.div.attr('y')];

                (x2).should.not.equal(x3);
                (y2).should.not.equal(y3);

                Space.clear();
            });

        it('should no longer be grabbed when released',
            () => {
                var b1 = Balloons.addBalloon(50, 100);
                Mouse.click(50, 100);
                Mouse.move(100, 100);
                var x0 = b1.div.attr('x');
                Mouse.release(100, 100);
                Mouse.move(300, 100);
                var x1 = b1.div.attr('x');
                x0.should.equal(x1);
                b1.isGrabbed().should.equal(false);
                Space.clear();
            });

        it('should not make a big step when grabbed not in center',
            () => {
                Space.clear();
                var b1 = Balloons.addBalloon(x0, y0);
                var x1 = b1.div.attr('x');
                Mouse.click(x0, y0);
                Mouse.move(x0 + 50, y0);
                Mouse.release(x0 + 50, y0);
                var x2 = b1.div.attr('x');
                var dx = 10;
                Mouse.click(x0 + 50 + dx, y0);
                Mouse.move(x0 + 100 + dx, y0);
                var x3 = b1.div.attr('x');
                var dx1 = x2 - x1, dx2 = x3 - x2;
                (Math.abs(dx1 - dx2) < 5).should.equal(true);
                Space.clear();
            });

        it('should get on top when grabbed');

        it('should allow to move balloon');

        //it('should not drastically move created balloon after moving space to different place',
        //    () => {
        //
        //        Space.isTesting = true;
        //        Space.point.x.should.equal(0);
        //        Space.draggingSpace.should.equal(false);
        //        Mouse.click(x0, y0);
        //        Space.draggingSpace.should.equal(true);
        //        var dx = 25;
        //        Mouse.move(x0 + dx, y0);
        //        Mouse.release(x0 + dx, y0);
        //        Math.abs(Space.point.x + dx).should.be.below(10);
        //        var b = Balloons.addBalloon(x0, y0);
        //        var [x1, y1] = b.getXY();
        //        Math.abs(x1 - x0 + 100).should.be.below(10);
        //        Math.abs(y1 - y0 + 100).should.be.below(10);
        //        Balloons.refresh();
        //        var [x2, y2] = b.getXY();
        //        Math.abs(x1 - x2).should.be.below(10);
        //        Math.abs(y1 - y2).should.be.below(10);
        //        Space.useViewBox = true;
        //        Space.clear();
        //    });

        it('should create new balloons in new size after zoom');

        it('should move arrows in place of balloons after zoom');
    });