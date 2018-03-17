$(document).scrollTop(0); //tests fail when scrolled down

var [x0, y0] = [200, 150];
let expect = chai.expect;

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
                var [x, y] = Space.toScreenPoint(x0, y0);
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
                var [x, y] = Space.toScreenPoint(x0, y0);
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
                var [x, y] = Space.toScreenPoint(x0, y0);
                Mouse.doubleclick(x, y);
                (currentTextareaBalloon.fO.childNodes[0].innerHTML).should.equal('abc');
                Space.clear();
            });

        it('should contain text from textarea in a textbox',
            () => {
                var b = Balloons.addBalloon(x0, y0);
                var [x, y] = Space.toScreenPoint(x0, y0);
                Mouse.doubleclick(x, y);
                currentTextareaBalloon.fO.childNodes[0].innerHTML = 'abc';
                Mouse.click(x + 200, y);
                b.fO.childNodes[0].innerHTML.should.equal('abc');
                Space.clear();
            });

        it('should resize a balloon when resizing a textbox',
            () => {
                var b = Balloons.addBalloon(x0, y0);
                var w1 = b.w();
                var [x, y] = Space.toScreenPoint(x0, y0);
                Mouse.doubleclick(x, y);
                currentTextareaBalloon.fO.childNodes[0].innerHTML = Array(20).join('abc');
                var event = new Event('input');
                currentTextareaBalloon.fO.dispatchEvent(event);
                var w2 = b.w();
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
                var [x, y] = Space.toCursorPoint(x0 + dx, y0);
                Mouse.move(x, y);
                Space.showHandle();
                var handle = Space.handle;
                var [x1,] = handle.getXY();
                [x, y] = Space.toCursorPoint(x0 - dx, y0);
                Mouse.move(x, y);
                Space.showHandle();
                var [x2,] = handle.getXY();
                (x1 > x2).should.equal(true);
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
                Mouse.doubleclick(100, 400);
                Mouse.doubleclick(500, 400);
                Mouse.move(300, 400);
                Space.showHandle();
                var [x1, y1] = Space.handle.getXY();
                Mouse.move(200, 400);
                Space.showHandle();
                var [x2, y2] = Space.handle.getXY();
                x1.should.be.above(x2);
            });
    });

describe('Space behavior',
    () => {
        it('should allow to grab and move around the canvas',
            () => {
                Space.clear();
                Space.isTesting = true;
                Balloons.addBalloon(x0, y0);
                var [x1, y1, ,] = Space.viewBox();
                Mouse.click(x0 + 200, y0 + 200);
                Mouse.move(x0 + 300, y0 + 300);
                Space.draggingBalloon.should.equal(false);
                Space.draggingSpace.should.equal(true);
                var [x2, y2, ,] = Space.viewBox();
                x1.should.not.equal(x2);
                y1.should.not.equal(y2);
            });

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
                //Space.clear();
            });

        //it('should allow to create balloons in same cursor place after zoom',
        //    () => {
        //        Space.clear();
        //        Space.zoom(10);
        //        Mouse.doubleclick(x0, y0);
        //        var [x1, y1] = Space.toScreenPoint(x0, y0);
        //        var b = Balloons.getLast();
        //        var [x2, y2, w, h] = b.rect();
        //        [x2, y2] = Space.toScreenPoint(x2 + w / 2, y2 + h / 2);
        //        x1.should.equal(x2);
        //        y1.should.equal(y2);
        //        Space.clear();
        //    });

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
                [x, y] = Space.toScreenPoint(x, y);
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
                var [x2, y2] = Space.toScreenPoint(x0, y0);
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
                [x, y] = Space.toScreenPoint(x, y);
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
            });
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