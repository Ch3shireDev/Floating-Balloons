$(document).scrollTop(0); //tests fail when scrolled down
var [x0, y0] = [300, 250];
let expect = chai.expect;
Space.autoText = false;

describe('Changing a text',
    () => {
        it('should open a textarea on double click',
            () => {
                Balloons.addBalloon(x0, y0);
                (Space.currentTextareaBalloon === null).should.be.equal(true);
                var b = Balloons.getLast();
                Mouse.doubleclick(x0, y0);
                (Space.currentTextareaBalloon === null).should.not.be.equal(true);
                Space.clear();
            });

        it('should close a textarea on click outside the bubble',
            () => {
                Balloons.addBalloon(x0, y0);
                (Space.currentTextareaBalloon === null).should.be.equal(true);
                var b = Balloons.getLast();
                Mouse.doubleclick(x0, y0);
                (Space.currentTextareaBalloon === null).should.not.be.equal(true);
                Mouse.click(x0 + 300, y0 + 300);
                (Space.currentTextareaBalloon === null).should.be.equal(true);
                Space.clear();
            });

        it('should contain current text in a textarea',
            () => {
                Balloons.addBalloon(x0, y0);
                Mouse.doubleclick(x0, y0);
                var b = Balloons.getLast();
                $('#tarea').text('abc\nabc');
                Mouse.click(x0 + 300, y0 + 300);
                ($($('.inner-text')[0]).text()).should.be.equal('abc\nabc');
                Space.clear();
            });

        it('should contain text from textarea in a textbox',
            () => {
                Balloons.addBalloon(x0, y0);
                ($($('.inner-text')[0]).text('abc\nabc'));
                Mouse.doubleclick(x0, y0);
                ($('#tarea').text()).should.be.equal('abc\nabc');
                Space.clear();
            });

        it('should resize a balloon when resizing a textbox',
            () => {
                Balloons.addBalloon(x0, y0);
                var b = Balloons.getLast();
                var [w0, h0] = b.getAttrWH();
                $('#tarea').text('abc');
                b.onInput(b);
                var [w1, h1] = b.getAttrWH();
                w1.should.be.above(w0);
                Space.clear();
            });

        it('should not move a balloon after adding a text',
            () => {
                Space.isTesting = true;
                Balloons.addBalloon(x0, y0);
                var b = Balloons.getLast();
                Mouse.doubleclick(x0, y0);
                $('#tarea').text('abcabcabcabc');
                b.onInput();
                Mouse.click(x0, y0 + 500);
                (Space.currentTextareaBalloon === null).should.be.equal(true);
                var [x1, y1] = b.getXY();
                Mouse.click(x0, y0);
                b.isGrabbed().should.be.equal(true);
                Mouse.move(x0, y0);
                var [x2, y2] = b.getXY();
                Math.abs(x2 - x1).should.be.below(5);
                Math.abs(y2 - y1).should.be.below(5);
                Space.clear();
            });

        it('should not affect width of balloon on multiline text',
            () => {
                Balloons.addBalloon(x0, y0);
                Mouse.doubleclick(x0, y0);
                var b = Balloons.getLast();
                $('#tarea').html('abc');
                b.onInput();
                var w1 = b.W();
                $('#tarea').html('abc\nabc');
                b.onInput();
                var w2 = b.W();
                w1.should.be.equal(w2);
                Space.clear();
            });

        it('should make multiline text balloon bigger height',
            () => {
                Balloons.addBalloon(x0, y0);
                Mouse.doubleclick(x0, y0);
                var b = Balloons.getLast();
                $('#tarea').html('abc');
                b.onInput();
                var h1 = b.H();
                $('#tarea').html('abc<br>abc<br>abc<br>abc<br>abc<br>abc<br>abc<br>abc');
                b.onInput();
                var h2 = b.H();
                h2.should.be.above(h1);
                Space.clear();
            });

        it('should not remove text formatting after opening textarea',
            () => {
                Balloons.addBalloon(x0, y0);
                var b = Balloons.getLast();
                Mouse.doubleclick(x0, y0);
                var str = 'abc<br>abc';
                $('#tarea').html(str);
                b.onInput();
                Space.closeCurrentTextarea();
                var str2 = '' + $($('.inner-text')[0]).html();
                str2.should.be.equal(str);
                Mouse.doubleclick(x0, y0);
                var str3 = '' + $('#tarea').html();
                str3.should.be.equal(str);
                Space.clear();
            });

        it('should resize balloon proportionally to length of text',
            () => {
                Balloons.addBalloon(x0, y0);
                var b = Balloons.getLast();
                var w0 = b.W();
                Mouse.doubleclick(x0, y0);
                $('#tarea').html('abcabc');
                b.onInput();
                var w1 = b.W();
                w1.should.be.above(w0);
                $('#tarea').html('abcabcabcabc');
                b.onInput();
                var w2 = b.W();
                w2.should.be.above(w1);
                Space.clear();
            });

        it('should not drastically resize balloon on zoom',
            () => {
                Space.zoom(500);
                Balloons.addBalloon(x0, y0);
                var b = Balloons.getLast();
                Mouse.doubleclick(x0, y0);
                $('#tarea').html('abcabcabcabc');
                b.onInput();
                var [w1, h1] = b.wh();
                b.refresh();
                var [w2, h2] = b.wh();
                Math.abs(w1 - w2).should.be.below(1);
                Math.abs(h1 - h2).should.be.below(1);
                Space.clear();
            });
    });

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

describe('Arrow behavior',
    () => {
        function checkArrow() {
            Space.isTesting = true;
            Mouse.doubleclick(x0, y0);
            Mouse.move(x0, y0);
            Space.showHandle();
            var [x, y] = Space.handle.getXY();
            x += 15;
            y += 15;
            var [w, h] = Space.point.getWH0();
            [x, y] = Space.svgToInternal(x, y);
            Mouse.click(x, y);
            Space.draggingHandle.should.equal(true);
            x += 500;
            y += 500;
            Mouse.move(x, y);
            var a = Space.handle.arrow;
            var [x1, y1] = [a.x1, a.y1];
            console.log(x, y, x1, y1);
            Math.abs(x - x1).should.be.below(10);
            Math.abs(y - y1).should.be.below(10);
            Space.clear();
        }

        it('should make arrow in place of moved handle',
            () => {
                Space.clear();
                checkArrow();
            });

        it('should make arrow in place of moved handle after space translation',
            () => {
                Space.point.x -= 500;
                Space.refresh();
                checkArrow();
            });

        it('should not create an arrow in large distance from handle',
            () => {
                Space.refresh();
                Space.isTesting = true;
                Mouse.doubleclick(x0, y0);
                Mouse.move(x0, y0);
                Space.showHandle();
                var [x, y] = Space.handle.getXY();
                [x, y] = Space.svgToInternal(x, y);
                Mouse.click(x + 5, y + 5);
                Space.draggingHandle.should.be.equal(true);
                var [x1, y1] = Space.handle.arrow.getHeadXY();
                Math.abs(x1 - x).should.be.below(50);
                Math.abs(y1 - y).should.be.below(50);
                Space.clear();
            });

        it('should not create an arrow in large distance after space translation',
            () => {
                Space.point.x -= 500;
                Space.refresh();
                Space.isTesting = true;
                Mouse.doubleclick(x0, y0);
                Mouse.move(x0, y0);
                Space.showHandle();
                var [x, y] = Space.handle.getXY();
                [x, y] = Space.svgToInternal(x, y);
                Mouse.click(x + 5, y + 5);
                Space.draggingHandle.should.be.equal(true);
                var [x1, y1] = Space.handle.arrow.getHeadXY();
                Math.abs(x1 - x).should.be.below(50);
                Math.abs(y1 - y).should.be.below(50);
                Space.clear();
            });

        it('should create an arrow between parent and child balloon');

        it('should connect when arrow is released over another bubble');

        it('should move arrow together with balloons');

        it('should create another bubble when arrow is released over an empty space');

        it('should create dependency between arrow, parent and child balloons');

        it('should move all child balloons together with parent balloon');

        it('should not allow for different behavior when there are loops in hierarchy');

        it('should move all arrows when autoText is enabled');
    });

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

describe('Space behavior',
    () => {
        it('should allow to zoom in and out the canvas');

        it('should not modify ability to move balloons after zoom');

        it('should not move balloons far away when grabbed after zoom');
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