$(document).scrollTop(0); //tests fail when scrolled down
var [x0, y0] = [300, 250];
let expect = chai.expect;
Space.autoText = false;
Space.useViewBox = true;

describe('Creating new bubble',
    () => {
        it('should understand double click as a command to create a new bubble',
            () => {
                Mouse.doubleclick(x0, y0);
                (Balloons.getLast()).should.not.equal(null);
                Space.clear();
            });

        it('should create and remove the text together with bubble',
            () => {
                Mouse.doubleclick(x0, y0);
                var b = Balloons.getLast();
                b.fO.should.not.equal(null);
                Balloons.removeLast();
                (b.fO == null).should.equal(true);
                Space.clear();
            });

        it('should move the text together with bubble',
            () => {
                var dx = 100, dy = 0;

                Mouse.doubleclick(x0, y0);

                var b = Balloons.getLast();
                var x1 = b.fO.getAttribute('x'),
                    y1 = b.fO.getAttribute('y');

                var [x3, y3, ,] = b.rect();

                Mouse.click(x0, y0);
                Mouse.move(x0 + dx, y0 + dy);

                var x2 = b.fO.getAttribute('x'),
                    y2 = b.fO.getAttribute('y');

                var [x4, y4, ,] = b.rect();

                x1 = parseFloat(x1);
                y1 = parseFloat(y1);
                x2 = parseFloat(x2);
                y2 = parseFloat(y2);

                (x2 - x1).should.equal(x4 - x3);
                (y2 - y1).should.equal(y4 - y3);
                Space.clear();
            });
    });

describe('Moving a bubble',
    () => {
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

        it('should get on top when grabbed',
            () => {
                var b1 = Balloons.addBalloon(x0, y0);
                var b2 = Balloons.addBalloon(x0, y0);
                var [x, y] = Space.toScreen(x0, y0);
                Mouse.click(x, y);
                b1.isGrabbed().should.equal(false);
                b2.isGrabbed().should.equal(true);
                Mouse.release(x, y);
                b1.grab();
                b1.drop();
                b1.isGrabbed().should.equal(false);
                b2.isGrabbed().should.equal(false);
                Mouse.click(x, y);
                b1.isGrabbed().should.equal(true);
                b2.isGrabbed().should.equal(false);
                Mouse.release(x, y);
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
                while (Balloons.balloonsList.length > 0) Balloons.removeLast();
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
    });

describe('Changing a text',
    () => {
        it('should open a textarea on double click',
            () => {
                closeCurrentTextarea();
                (currentTextareaBalloon === null).should.equal(true);
                Balloons.addBalloon(x0, y0);
                var [x, y] = Space.toScreen(x0, y0);
                Mouse.doubleclick(x, y);
                (currentTextareaBalloon).should.not.equal(null);
                Space.clear();
            });

        it('should close a textarea on click outside the bubble',
            () => {
                Balloons.addBalloon(x0, y0);
                Mouse.doubleclick(x0, y0);
                (currentTextareaBalloon).should.not.equal(null);
                Mouse.click(1, 1);
                (currentTextareaBalloon == null).should.equal(true);
                Space.clear();
            });

        it('should contain current text in a textarea',
            () => {
                var b = Balloons.addBalloon(x0, y0);
                b.fO.innerHTML = 'abc';
                var [x, y] = Space.toScreen(x0, y0);
                Mouse.doubleclick(x, y);
                (currentTextareaBalloon.fO.childNodes[0].innerHTML).should.equal('abc');
                Space.clear();
            });

        it('should contain text from textarea in a textbox',
            () => {
                var b = Balloons.addBalloon(x0, y0);
                var [x, y] = Space.toScreen(x0, y0);
                Mouse.doubleclick(x, y);
                currentTextareaBalloon.fO.childNodes[0].innerHTML = 'abc';
                Mouse.click(x + 200, y);
                b.fO.childNodes[0].innerHTML.should.equal('abc');
                Space.clear();
            });

        it('should resize a balloon when resizing a textbox',
            () => {
                var b = Balloons.addBalloon(x0, y0);
                var [w1, h1] = b.wh();
                var [x, y] = Space.toScreen(x0, y0);
                Mouse.doubleclick(x, y);
                currentTextareaBalloon.fO.childNodes[0].innerHTML = Array(20).join('abc');
                var event = new Event('input');
                currentTextareaBalloon.fO.dispatchEvent(event);
                var [w2, h2] = b.wh();
                (w1 < w2).should.equal(true);
                Space.clear();
            });
    });

describe('Handle behavior',
    () => {
        it('should allow to grab and move a handle',
            () => {
                var [dx, dy] = [100, 200];
                Balloons.addBalloon(x0, y0);
                Space.showHandle();
                var handle = Space.handle;
                var [x, y] = handle.screenXY();
                Mouse.move(0, y);
                handle.showHandle();
                Mouse.click(x, y);
                Mouse.move(x - dx, y - dy);
                var [x2, y2] = handle.getXY();
                x.should.not.equal(x2);
                y.should.not.equal(y2);
                Space.clear();
            });

        it('should move handle around the bubble together with cursor',
            () => {
                Balloons.addBalloon(x0, y0);
                var dx = 200;
                Space.showHandle();
                var [x, y] = Space.toInternal(x0 + dx, y0);
                Mouse.move(200, 20300);
                Space.showHandle();
                var handle = Space.handle;
                var [x1,] = handle.getXY();
                [x, y] = Space.toInternal(x0 - dx, y0);
                Mouse.move(300, -20000);
                Space.showHandle();
                var [x2,] = handle.getXY();
                (x1 !== x2).should.equal(true);
                Space.clear();
            });

        it('should show small handle when cursor is on bubble\'s edge',
            () => {
                var b = Balloons.addBalloon(x0, y0);
                Mouse.move(x0 + 60, y0 + 120);
                Mouse.move(x0 + 60, y0 + 130);
                Space.showHandle();
                ($('#handle')[0].id === 'handle').should.equal(true);
                Space.clear();
            });

        it('should show handle near every balloon when cursor is nearby',
            () => {
                Mouse.doubleclick(x0, y0);
                Mouse.doubleclick(x0 + 400, y0);
                Mouse.move(x0 - 200, y0);
                Mouse.move(x0 - 300, y0);
                Space.showHandle();
                var [x1,] = Space.handle.getXY();
                Mouse.move(x0 + 400, y0);
                Space.showHandle();
                var [x2,] = Space.handle.getXY();
                expect(x2 - x1).to.be.above(200);
                Space.clear();
            });

        it('should move handle between balloons after zoom together with cursor',
            () => {
                Space.zoom(5000);
                Mouse.doubleclick(100, 200);
                Mouse.doubleclick(500, 200);
                Mouse.move(300, 400);
                Space.showHandle();
                var [x1, y1] = Space.handle.getXY();
                Mouse.move(200, 400);
                Space.showHandle();
                var [x2, y2] = Space.handle.getXY();
                x1.should.be.above(x2);
                Space.clear();
            });
    });

describe('Space behavior',
    () => {
        it('should allow to zoom in and out the canvas',
            () => {
                Space.clear();
                var [, , w1, h1] = Space.viewBox();
                Space.zoom(10);
                var [, , w2, h2] = Space.viewBox();
                Space.zoom(-20);
                var [, , w3, h3] = Space.viewBox();

                w2.should.be.above(w1);
                w1.should.be.above(w3);
                h2.should.be.above(h1);
                h1.should.be.above(h3);
            });

        it('should not modify ability to move balloons after zoom',
            () => {
                Space.clear();
                var b = Balloons.addBalloon(x0, y0);
                Space.zoom(10);
                var [x, y] = b.screenXY();
                b.isGrabbed().should.equal(false);
                Mouse.click(x + 1, y + 1);
                b.isGrabbed().should.equal(true);
                Mouse.move(x + 10, y + 10);
                var [x2, y2] = b.getXY();
                x.should.not.equal(x2);
                y.should.not.equal(y2);
                Space.clear();
            });

        it('should not move balloons far away when grabbed after zoom',
            () => {
                Space.clear();
                Space.zoom(10);
                Space.draggingBalloon.should.equal(false);
                Mouse.doubleclick(x0, y0);
                var b = Balloons.getLast();
                Mouse.click(x0, y0);
                Space.draggingBalloon.should.equal(true);
                var [x1, y1] = b.getXY();
                Mouse.move(x0, y0);
                var [x2, y2] = b.getXY();
                (Math.abs(x2 - x1) < 1).should.equal(true);
                (Math.abs(y2 - y1) < 1).should.equal(true);
                Space.clear();
            });
    });

describe('Arrow behavior',
    () => {
        it('should move arrow together with balloons',
            () => {
                Space.isTesting = true;
                Space.moveChildren = false;
                Mouse.doubleclick(x0, y0);
                var b1 = Balloons.getLast();
                Mouse.doubleclick(x0 + 400, y0);
                var b2 = Balloons.getLast();
                Mouse.move(x0, y0);
                Space.showHandle();
                var [x, y] = Space.handle.getXY();
                [x, y] = Space.toScreen(x, y);
                Mouse.click(x + 5, y + 5);
                [x, y] = b2.screenXY();
                Mouse.move(x + 50, y + 50);
                Mouse.release(x + 50, y + 50);

                var arrow = b1.childArrows[0];
                var [x1, y1, x2, y2] = arrow.getStartAndEnd();

                Mouse.click(x0, y0);
                Mouse.move(x0 + 100, y0 + 100);
                Mouse.release(x0 + 100, y0 + 100);

                var [x3, y3, x4, y4] = arrow.getStartAndEnd();

                x3.should.be.above(x1);
                y3.should.be.above(y1);

                Mouse.click(x0 + 400, y0);
                Mouse.move(x0 + 500, y0 + 200);
                Mouse.release(x0 + 500, y0 + 200);

                var [x5, y5, x6, y6] = arrow.getStartAndEnd();

                x6.should.be.above(x2);
                y6.should.be.above(y2);

                Space.clear();
            });

        it('should create an arrow between parent and child balloon',
            () => {
                Space.clear();
                var b1 = Balloons.addBalloon(x0, y0);
                Space.showHandle();
                var [x, y] = Space.handle.screenXY();
                Mouse.click(x + 5, y + 5);
                Mouse.move(x + 100, y);
                Mouse.release(x + 100, y);
                expect($('.arrow')[0]).to.not.equal(null);
                var b2 = Balloons.getLast();
                expect(b1).should.not.be.equal(b2);
                expect(b1.childBalloons[0]).to.be.equal(b2);
                Space.clear();
            });

        it('should connect when arrow is released over another bubble',
            () => {
                var b1 = Balloons.addBalloon(x0, y0);
                var b2 = Balloons.addBalloon(x0 + 300, y0);
                var [x, y] = b2.screenXY();
                Mouse.move(x, y);
                Space.showHandle();
                [x, y] = Space.handle.screenXY();
                Mouse.click(x + 1, y + 1);
                var [x2, y2] = Space.toScreen(x0, y0);
                Mouse.move(x2 + 10, y2 + 10);
                Mouse.release(x2 + 10, y2 + 10);
                (b2.childArrows[0]).should.not.equal(null);
                Balloons.balloonsList.length.should.equal(2);
                Space.clear();
            });

        it('should create another bubble when arrow is released over an empty space',
            () => {
                Balloons.balloonsList.length.should.equal(0);
                var b1 = Balloons.addBalloon(x0, y0);
                Balloons.balloonsList.length.should.equal(1);
                var [x, y] = b1.screenXY();
                Mouse.move(x, y);
                Space.showHandle();
                [x, y] = Space.handle.screenXY();
                Mouse.click(x + 1, y + 1);
                Mouse.move(x + 200, y);
                Mouse.release(x + 200, y);
                Balloons.balloonsList.length.should.equal(2);
                Space.clear();
            });

        it('should create dependency between arrow, parent and child balloons',
            () => {
                var b = Balloons.addBalloon(x0, y0);
                Space.showHandle();
                var [x, y] = Space.handle.screenXY();
                Mouse.click(x + 5, y + 5);
                Mouse.move(x + 200, y);
                var arrow = b.childArrows[0];
                arrow.tailBalloon.should.equal(b);
                Mouse.release(x + 200, y);
                var b2 = Balloons.getLast();
                arrow.headBalloon.should.equal(b2);
                b.childArrows[0].should.equal(arrow);
                b.childBalloons[0].should.equal(b2);
                Space.clear();
            });

        it('should move all child balloons together with parent balloon',
            () => {
                Space.moveChildren = true;
                Mouse.doubleclick(x0, y0);
                var b1 = Balloons.getLast();
                Mouse.doubleclick(x0 + 300, y0);
                var b2 = Balloons.getLast();
                var [x1, y1] = b2.getXY();
                Mouse.move(x0 + 100, y0);
                Space.showHandle();
                Mouse.move(x0, y0);
                Space.showHandle();
                var [x, y] = Space.handle.getXY();
                [x, y] = Space.toScreen(x, y);
                Mouse.click(x + 5, y + 5);

                Mouse.move(x0 + 300, y0);
                Mouse.release(x0 + 300, y0);

                Mouse.click(x0 + 5, y0 + 5);

                (b1.isGrabbed()).should.be.equal(true);

                Mouse.move(x0 + 200, y0 + 200);
                Mouse.release(x0 + 200, y0 + 200);
                var [x2, y2] = b2.getXY();

                x2.should.be.above(x1);
                y2.should.be.above(y1);

                Space.clear();
            });

        it('should not allow for different behavior when there are loops in hierarchy',
            () => {
                var b1 = Balloons.addBalloon(x0, y0),
                    b2 = Balloons.addBalloon(x0 + 300, y0);
                b1.childBalloons.push(b2);
                b1.move(x0, y0);
                var [x1, y1] = b2.getXY();
                b1.move(x0 + 50, y0 + 50);
                var [x2, y2] = b2.getXY();
                b1.move(x0, y0);
                b1.childBalloons.push(b2);
                var [x3, y3] = b2.getXY();
                b1.move(x0 + 50, y0 + 50);
                var [x4, y4] = b2.getXY();
                Math.abs((x2 - x1) - (x4 - x3)).should.be.below(1);
                Math.abs((y2 - y1) - (y4 - y3)).should.be.below(1);
                Space.clear();
            });

        it('should move all arrows when autoText is enabled',
            () => {
                Space.autoText = true;
                var [x1, y1] = Space.toInternal(x0, y0),
                    [x2, y2] = Space.toInternal(x0 + 200, y0),
                    [x3, y3] = Space.toInternal(x0 + 400, y0);
                var b1 = Balloons.addBalloon(x1, y1),
                    b2 = Balloons.addBalloon(x2, y2),
                    b3 = Balloons.addBalloon(x3, y3);
                Mouse.move(x0, y0);
                Space.showHandle();
                var [x4, y4] = Space.handle.screenXY();
                Mouse.click(x4 + 5, y4 + 5);
                Mouse.move(x0 + 200, y0);
                Mouse.release(x0 + 200, y0);
                Mouse.move(x0 + 400, y0);
                Space.showHandle();
                [x4, y4] = Space.handle.screenXY();
                Mouse.click(x4 + 5, y4 + 5);
                Mouse.move(x0 + 200, y0);
                Mouse.release(x0 + 200, y0);
                var a0 = b1.childArrows[0],
                    a1 = b3.childArrows[0];

                var ay0 = a0.y1,
                    ay1 = a1.y1;

                Mouse.click(x0 + 200, y0);
                Mouse.move(x0 + 200, y0 + 200);
                Mouse.release(x0 + 200, y0 + 200);

                var ay2 = a0.y1,
                    ay3 = a1.y1;

                ay2.should.be.above(ay0);
                ay3.should.be.above(ay1);

                Space.autoText = false;
                Space.clear();
            });
    });

describe('Non-ViewBox movement',
    () => {
        it('should create balloons in clicked place',
            () => {
                Space.useViewBox = false;
                Balloons.size().should.be.equal(0);
                Mouse.doubleclick(x0, y0);
                Balloons.size().should.be.equal(1);
                var b = Balloons.getLast();
                var [x2, y2] = [b.x, b.y];
                Math.abs(x0 - x2).should.be.below(5);
                Math.abs(y0 - y2).should.be.below(5);
                Space.useViewBox = true;
                Space.clear();
            });

        it('should allow to move balloon',
            () => {
                Space.useViewBox = false;
                Mouse.doubleclick(x0, y0);
                var b = Balloons.getLast();
                b.isGrabbed().should.be.equal(false);
                Mouse.click(x0, y0);
                b.isGrabbed().should.be.equal(true);
                var [x1, y1] = b.getXY();
                Mouse.move(x0 + 100, y0 + 100);
                var [x2, y2] = b.getXY();
                Math.abs(x2 - x1 - 100).should.be.below(10);
                Math.abs(y2 - y1 - 100).should.be.below(10);
                Space.useViewBox = true;
                Space.clear();
            });

        it('should allow to move space',
            () => {
                Space.useViewBox = false;
                Space.isTesting = true;
                Mouse.doubleclick(x0, y0);
                var b = Balloons.getLast();
                var [x1, y1] = b.getXY();
                Mouse.click(x0 + 200, y0 + 200);
                b.isGrabbed().should.be.equal(false);
                Space.draggingSpace.should.be.equal(true);
                Mouse.move(x0 + 300, y0 + 300);
                var [x2, y2] = b.getXY();
                Math.abs(x2 - x1 - 100).should.be.below(10);
                Math.abs(y2 - y1 - 100).should.be.below(10);
                Space.useViewBox = true;
                Space.clear();
            });

        //it('should not drastically move created balloon after moving space to different place',
        //    () => {
        //        Space.useViewBox = false;
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

        it('should not drastically move created balloon after moving space to different place',
            () => {
                Space.useViewBox = false;
                Space.isTesting = true;
                Space.point.x.should.equal(0);
                Space.draggingSpace.should.equal(false);
                Mouse.click(x0, y0);
                Space.draggingSpace.should.equal(true);
                var dx = 25;
                Mouse.move(x0 + dx, y0);
                Mouse.release(x0 + dx, y0);
                Math.abs(Space.point.x + dx).should.be.below(10);
                var b = Balloons.addBalloon(x0, y0);
                var [x1, y1] = b.getXY();
                Math.abs(x1 - x0 + 100).should.be.below(10);
                Math.abs(y1 - y0 + 100).should.be.below(10);
                Balloons.refresh();
                var [x2, y2] = b.getXY();
                Math.abs(x1 - x2).should.be.below(10);
                Math.abs(y1 - y2).should.be.below(10);
                Space.useViewBox = true;
                Space.clear();
            });

        it('should not drastically move moved balloon after moving space',
            () => {
                Space.useViewBox = false;
                Space.isTesting = true;
                Space.point.x.should.equal(0);
                Space.draggingSpace.should.equal(false);
                Mouse.click(x0, y0);
                Space.draggingSpace.should.equal(true);
                var dx = 25;
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
                Math.abs(x1 - x2).should.be.below(10);
                Math.abs(y1 - y2).should.be.below(10);
                Space.useViewBox = true;
                Space.clear();
            });

        it('should not move path after grabbing space',
            () => {
                Space.useViewBox = false;
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
    });

describe('Non-ViewBox zooming',
    () => {
        it('should allow to zoom-in and out balloons',
            () => {
                Space.useViewBox = false;
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

        it('should create balloons in same place after zoom', () => {
            Space.useViewBox = false;
            var b1 = Balloons.addBalloon(500, 500);
            Space.zoom(1000);
            Space.refresh();
            var b2 = Balloons.addBalloon(500, 500);
            Space.refresh();

            var [x1, y1] = b1.getXY();
            var [x2, y2] = b2.getXY();

            Math.abs(x1 - x2).should.be.below(10);
            Math.abs(y1 - y2).should.be.below(10);

            Space.useViewBox = true;
            Space.clear();
        });

        it('should create new balloons in new size after zoom');
        //() => {
        //Space.useViewBox = false;
        //var b1 = Balloons.addBalloon(500, 500);
        //Space.zoom(1000);
        //var b2 = Balloons.addBalloon(500, 500);
        //Space.refresh();
        //var [x1, y1] = b1.getXY();
        //var [x2, y2] = b2.getXY();
        //Math.abs(x1-x2).should.be.below(50);
        //Math.abs(y1-y2).should.be.below(50);
        ////Mouse.doubleclick(x0, y0);
        ////var b1 = Balloons.getLast();
        //////Space.zoom(1000);
        ////var alpha = Space.point.getAlpha();
        ////Space.point.w += alpha * 100;
        ////Space.point.h += 100;
        ////var [w1, h1] = b1.getAttrWH();
        ////var [x2, y2] = [300, 400];
        ////var [x3, y3] = Space.toInternal(x2, y2);
        ////Mouse.doubleclick(x3, y3);
        ////var b2 = Balloons.getLast();
        ////var [x, y] = b2.getXY();
        ////var [w, h] = b2.getAttrWH();
        ////Math.abs(x + w / 2 - x3).should.be.below(50);
        ////Math.abs(y + h / 2 - y3).should.be.below(50);
        //Space.useViewBox = true;
        //Space.clear();
        //});
        it('should move arrows in place of balloons after zoom');
    });

describe('Selecting bubbles',
    () => {
        it('should create a selection field when clicked on empty space');

        it('should highlight selected bubbles');

        it('should move selected bubbles together');

        it('should delete selected bubbles together');
    });

describe('Undo/Redo behavior',
    () => {
        it('should undo last operation on Ctrl+Z or Right Click->Undo');

        it('should redo last undone operation on Ctrl+Shift+Z or Ctrl+Y or Right Click->Redo');

        it('should not affect normal Undo/Redo during TextBox edits');
    });

describe('Grouping bubbles',
    () => {
        it('should allow grab-and-drop bubble into another bubble');

        it('should expand host bubble to contain guest bubble');

        it('should allow stack host-guest relations');

        it('should move all guest bubbles when host bubble is moved');
    });

describe('Save/Load behavior',
    () => {
        it('should automatically save session in local storage');

        it('should automatically load last session'); //i'm not sure if we should allow for many parallel sessions

        it('should allow for save a serialized session in a file');

        it('should allow for load a serialized session from a file');
    });

describe('Export to file behavior',
    () => {
        it('should allow for export balloon diagram to .svg file');

        it('should allow for export balloon diagram to .png file');
    });

after(() => {
    $('svg')[0].remove();
});

mocha.run();