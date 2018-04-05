$(document).scrollTop(0); //tests fail when scrolled down
var [x0, y0] = [300, 250];
let expect = chai.expect;
Space.autoText = false;

describe('Creating new bubble',
    () => {
        it('should understand double click as a command to create a new bubble',
            () => {
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
                checkBalloonCreation();
            });

        it('should create and remove the text together with bubble');

        it('should move the text together with bubble');
    });

describe('Movement',
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

        it('should allow to move balloon');

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
                var dx = 50;
                Mouse.move(x0 + dx, y0);
                Mouse.release(x0 + dx, y0);
                Math.abs(Space.point.x + dx / 2).should.be.below(20);
                var b = Balloons.addBalloon(x0, y0);
                var [x1, y1] = b.getXY();
                //Math.abs(x1 - x0 + 100).should.be.below(dx / 2);
                //Math.abs(y1 - y0 + 100).should.be.below(dx / 2);
                Balloons.refresh();
                var [x2, y2] = b.getXY();
                Math.abs(x1 - x2).should.be.below(20);
                Math.abs(y1 - y2).should.be.below(20);
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
                var dx = 50;
                Mouse.move(x0 + dx, y0);
                Mouse.release(x0 + dx, y0);
                Math.abs(Space.point.x + dx / 2).should.be.below(10);
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

describe('Zooming',
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
            console.log(x1, y1, x2, y2);

            Math.abs(x1 - x2).should.be.below(10);
            Math.abs(y1 - y2).should.be.below(10);

            Space.useViewBox = true;
            Space.clear();
        });

        it('should move handle properly after zooming', () => {
            Space.useViewBox = false;
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

        it('should create new balloons in new size after zoom');

        it('should move arrows in place of balloons after zoom');
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

        it('should get on top when grabbed');

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
        it('should open a textarea on double click');

        it('should close a textarea on click outside the bubble');

        it('should contain current text in a textarea');

        it('should contain text from textarea in a textbox');

        it('should resize a balloon when resizing a textbox');
    });

describe('Handle behavior',
    () => {
        it('should allow to grab and move a handle');

        it('should move handle around the bubble together with cursor');

        it('should show small handle when cursor is on bubble\'s edge');

        it('should show handle near every balloon when cursor is nearby');

        it('should move handle between balloons after zoom together with cursor');
    });

describe('Space behavior',
    () => {
        it('should allow to zoom in and out the canvas');

        it('should not modify ability to move balloons after zoom');

        it('should not move balloons far away when grabbed after zoom');
    });

describe('Arrow behavior',
    () => {
        it('should move arrow together with balloons');

        it('should create an arrow between parent and child balloon');

        it('should connect when arrow is released over another bubble');

        it('should create another bubble when arrow is released over an empty space');

        it('should create dependency between arrow, parent and child balloons');

        it('should move all child balloons together with parent balloon');

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

        it('should move all arrows when autoText is enabled');
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