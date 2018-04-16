describe('Handle behavior',
    () => {
        function handlePos(x, y) {
            Mouse.move(x, y);
            Space.showHandle();
            return Space.handle.getXY();
        }

        it('should show handle near the balloon',
            () => {
                Space.clear();
                var b = Balloons.addBalloon(x0, y0);
                var [x, y] = [b.x, b.y];
                var [x1, y1] = handlePos(x - 100, y);
                var [x2, y2] = handlePos(x, y - 100);
                var [x3, y3] = handlePos(x + 100, y);
                var [x4, y4] = handlePos(x, y + 100);
                x1.should.be.below(x2);
                x2.should.be.below(x3);
                y2.should.be.below(y3);
                y3.should.be.below(y4);
                Space.showHandle();
                Space.clear();
            });

        it('should show handle near the balloon after movement of space',
            () => {
                Mouse.click(x0, y0);
                Space.draggingSpace.should.equal(true);
                Mouse.move(x0 + 200, y0);
                Mouse.release(x0 + 200, y0);
                Space.draggingSpace.should.equal(false);
                var b = Balloons.addBalloon(x0, y0);
                var [x, y] = [b.x, b.y];
                var [x1, y1] = handlePos(x - 100, y);
                var [x2, y2] = handlePos(x, y - 100);
                var [x3, y3] = handlePos(x + 100, y);
                var [x4, y4] = handlePos(x, y + 100);
                x1.should.be.below(x2);
                x2.should.be.below(x3);
                y2.should.be.below(y3);
                y3.should.be.below(y4);
                Space.showHandle();
                Space.clear();
            });

        it('should show handle near the balloon after movement of balloon',
            () => {
                var b = Balloons.addBalloon(x0, y0);
                Mouse.click(x0, y0);
                b.isGrabbed().should.equal(true);
                Mouse.move(x0 + 200, y0);
                Mouse.release(x0 + 200, y0);
                var [x, y] = [b.x, b.y];
                var [x1, y1] = handlePos(x - 100, y);
                var [x2, y2] = handlePos(x, y - 100);
                var [x3, y3] = handlePos(x + 100, y);
                var [x4, y4] = handlePos(x, y + 100);
                x1.should.be.below(x2);
                x2.should.be.below(x3);
                y2.should.be.below(y3);
                y3.should.be.below(y4);
                Space.showHandle();
                Space.clear();
            });

        it('should show handle near the balloon after zoom',
            () => {
                var b = Balloons.addBalloon(x0, y0);
                Space.zoom(1000);
                var [x, y] = [b.x, b.y];
                var dx = 1000;
                var [x1, y1] = handlePos(x - dx, y);
                var [x2, y2] = handlePos(x, y - dx);
                var [x3, y3] = handlePos(x + dx, y);
                var [x4, y4] = handlePos(x, y + dx);
                x1.should.be.below(x2);
                x2.should.be.below(x3);
                y2.should.be.below(y3);
                y3.should.be.below(y4);
                Space.showHandle();
                Space.clear();
            });

        it('should switch a handle from one balloon to another on mouse movement',
            () => {
                Mouse.doubleclick(x0, y0);
                var b1 = Balloons.getLast();
                Mouse.doubleclick(x0 + 1000, y0);
                var b2 = Balloons.getLast();
                var c = (b1.x + b2.x) / 2;
                Mouse.move(c - 50, y0);
                Space.showHandle();
                var x1 = Space.handle.getXY()[0];
                Mouse.move(c + 50, y0);
                Space.showHandle();
                var x2 = Space.handle.getXY()[0];
                (x2 - x1).should.be.above(500);
                Space.clear();
            });

        it('should switch a handle from one balloon to another on mouse movement after space translation',
            () => {
                Mouse.doubleclick(200, 300, true);
                var b1 = Balloons.getLast();
                Mouse.doubleclick(600, 300, true);
                var b2 = Balloons.getLast();
                var c = 400;
                var d = 50;
                Mouse.move(c - d, y0, true);
                Space.showHandle();
                var x1 = Space.handle.getXY()[0];
                Mouse.move(c + d, y0, true);
                Space.showHandle();
                var x2 = Space.handle.getXY()[0];
                (x2 - x1).should.be.above(300);
                Space.point.x += 500;
                Space.refresh();
                c = 300;
                d = 40;
                Mouse.move(c - d, y0, true);
                Space.showHandle();
                var x1 = Space.handle.getXY()[0];
                Mouse.move(c + d, y0, true);
                Space.showHandle();
                var x2 = Space.handle.getXY()[0];
                (x2 - x1).should.be.above(300);
                Space.clear();
            });

        it('should switch a handle from one balloon to another on mouse movement after zoom',
            () => {
                Space.zoom(1000);
                Mouse.doubleclick(200, 300, true);
                var b1 = Balloons.getLast();
                Mouse.doubleclick(600, 300, true);
                var b2 = Balloons.getLast();
                var c = 300;
                Mouse.move(300, y0, true);
                Space.showHandle();
                var x1 = Space.handle.getXY()[0];
                Mouse.move(500, y0, true);
                Space.showHandle();
                var x2 = Space.handle.getXY()[0];
                (x2 - x1).should.be.above(300);
                Space.clear();
            });

        it('should allow to grab and move a handle',
            () => {
                Space.isTesting = true;
                Mouse.doubleclick(x0, y0);
                Mouse.move(x, y);
                Space.showHandle();
                var [x, y] = Space.handle.getXY();
                Mouse.click(x + 5, y + 5);
                Space.draggingHandle.should.equal(true);
                Mouse.move(x + 100, y + 100, true);
                var a = Space.handle.arrow;
                var [x1, y1] = [a.x1, a.y1];
                [x1, y1] = Space.internalToSVG(x1, y1);
                (x + 100 - x1).should.be.below(10);
                (y + 100 - y1).should.be.below(10);
                var [x2, y2] = Space.handle.getXY();
                (x + 100 - x2).should.be.below(10);
                (y + 100 - y2).should.be.below(10);
                Space.clear();
            });

        it('should make a grabbed handle follow mouse',
            () => {
                Space.isTesting = true;
                Mouse.doubleclick(x0, y0);
                Space.showHandle();
                var h = Space.handle;
                var [x, y] = h.getXY();
                [x, y] = Space.svgToInternal(x, y);
                var dx = 10;
                Mouse.click(x + dx, y + dx);
                Space.draggingHandle.should.be.equal(true);
                var [xm, ym] = [x + 500, y + 500];
                Mouse.move(xm, ym);
                [x, y] = h.getXY();
                [x, y] = Space.svgToInternal(x, y);
                [x, y] = [x + dx, y + dx];
                Math.abs(xm - x).should.be.below(20);
                Math.abs(ym - y).should.be.below(20);
                Space.clear();
            });

        it('should make a grabbed handle follow mouse after space translation',
            () => {
                Space.isTesting = true;
                Mouse.click(x0, y0);
                Mouse.move(x0 + 500, y0);
                Mouse.release(x0, y0);
                Mouse.doubleclick(x0, y0);
                Space.showHandle();
                var h = Space.handle;
                var [x, y] = h.getXY();
                [x, y] = Space.svgToInternal(x, y);
                var dx = 10;
                Mouse.click(x + dx, y + dx);
                Space.draggingHandle.should.be.equal(true);
                var [xm, ym] = [x + 500, y + 500];
                Mouse.move(xm, ym);
                [x, y] = h.getXY();
                [x, y] = Space.svgToInternal(x, y);
                [x, y] = [x + dx, y + dx];
                Math.abs(xm - x).should.be.below(20);
                Math.abs(ym - y).should.be.below(20);
                Space.clear();
            });

        it('should make a grabbed handle follow mouse after zoom',
            () => {
                Space.isTesting = true;
                Space.zoom(150);
                Mouse.doubleclick(x0, y0);
                Space.showHandle();
                var h = Space.handle;
                var [x, y] = h.getXY();
                [x, y] = Space.svgToInternal(x, y);
                var dx = 15;
                Mouse.click(x + dx, y + dx);
                Space.draggingHandle.should.be.equal(true);
                var [xm, ym] = [x + 300, y + 300];
                Mouse.move(xm, ym);
                [x, y] = h.getXY();
                [x, y] = Space.svgToInternal(x, y);
                [x, y] = [x + dx, y + dx];
                Math.abs(xm - x).should.be.below(20);
                Math.abs(ym - y).should.be.below(20);
                Space.clear();
            });

        //it('should move handle around the bubble together with cursor');

        //it('should show small handle when cursor is on bubble\'s edge');

        //it('should show handle near every balloon when cursor is nearby');

        //it('should move handle between balloons after zoom together with cursor');
    });