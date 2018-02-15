Mouse = {
    runEvent: function (name, x, y) {
        $('body')[0].dispatchEvent(
            new MouseEvent(name,
                {
                    view: window,
                    clientX: x,
                    clientY: y
                })
        );
    },

    doubleclick: function (x, y) {
        this.runEvent('dblclick', x, y);
    },

    click: function (x, y) {
        this.runEvent('mousedown', x, y);
    },

    move: function (x, y) {
        this.runEvent('mousemove', x, y);
    },

    release: function (x, y) {
        this.runEvent('mouseup', x, y);
    }
}

var x0 = 200, y0 = 200;
let expect = chai.expect;

describe('Creating new bubble',
    () => {
        it('should understand double click as a command to create a new bubble',
            () => {

                Mouse.doubleclick(x0, y0);

                var [x, y, w, h] = Balloons.getLastBalloon().rect();

                x = x + w / 2;
                y = y + h / 2;

                var p = cursorPoint(x0, y0);
                x0 = p.x;
                y0 = p.y;

                x.should.equal(x0);
                y.should.equal(y0);

                Balloons.removeLast();
            });

        it('should create and remove the text together with bubble',
            () => {
                Mouse.doubleclick(x0, y0);
                var b = Balloons.getLastBalloon();
                var f = b.fO;
                b.fO.should.not.equal(null);
                Balloons.removeLast();
                (b.fO == null).should.equal(true);
            });


        it('should move the text together with bubble',
            () => {

                var dx = 500, dy = 0;

                Mouse.doubleclick(x0, y0);

                var b = Balloons.getLastBalloon();
                var x1 = b.fO.getAttribute('x'),
                    y1 = b.fO.getAttribute('y');

                Mouse.click(x0, y0);
                Mouse.move(x0 + dx, y0 + dy);

                var x2 = b.fO.getAttribute('x'),
                    y2 = b.fO.getAttribute('y');

                x1 = parseFloat(x1);
                y1 = parseFloat(y1);
                x2 = parseFloat(x2);
                y2 = parseFloat(y2);

                (x2 - x1).should.equal(dx);
                (y2 - y1).should.equal(dy);
            });

    });

describe('Moving a bubble',
    () => {
        it('should be grabbed on click-and-hold', () => {
            var x0 = 500, y0 = 200;

            Mouse.doubleclick(x0, y0);
            Mouse.click(x0, y0);

            Balloons.getLastBalloon().isGrabbed().should.equal(true);
            Balloons.removeLast();
        });

        it('should move with cursor when grabbed', () => {
            var [x0, y0] = [500, 200],
                [dx, dy] = [200, 300];

            Mouse.doubleclick(x0, y0);
            Mouse.click(x0, y0);
            Mouse.move(dx, dy);

            var [x, y, w, h] = Balloons.getLastBalloon().rect();

            var cPoint = cursorPoint(dx - w / 4, dy - h / 4); //why by 4? wtf
            var x1 = cPoint.x,
                y1 = cPoint.y;

            x1 = Math.floor(x1);
            y1 = Math.floor(y1);
            x = Math.floor(x);
            y = Math.floor(y);

            x1.should.equal(x);
            y1.should.equal(y);

            Balloons.removeLast();
        });

        it('should get on top when grabbed', () => {
            var b1 = Balloons.addBalloon(100, 200);
            var b2 = Balloons.addBalloon(300, 200);

            var x0 = b2.div.attr('x');

            Mouse.click(100, 200);
            Mouse.move(300, 200);
            Mouse.release(300, 200);
            Mouse.click(300, 200);
            Mouse.move(500, 200);
            Mouse.release(500, 200);

            var x1 = b2.div.attr('x');

            x0.should.equal(x1);

            Balloons.removeLast();
            Balloons.removeLast();
        });

        it('should no longer be grabbed when released', ()=>{
            var b1 = Balloons.addBalloon(100, 200);
            Mouse.click(100, 200);
            Mouse.move(200, 200);
            var x0 = b1.div.attr('x');
            Mouse.release(200, 200);
            Mouse.move(400, 200);
            var x1 = b1.div.attr('x');
            x0.should.equal(x1);
            b1.isGrabbed().should.equal(false);
        });
        
    });

describe('Changing a text',
    () => {
        it('should open a text box on double click');

        it('should contain current text in a text box');

        it('should resize a balloon when resizing a textbox');

        it('should automatically close a textbox when clicked on an empty space');
    });

describe('Connecting bubbles',
    () => {
        it('should show small handle when cursor is on bubble\'s edge');

        it('should allow to grab a handle and expand it into arrow');

        it('should connect when arrow is released over another bubble');

        it('should create another bubble when arrow is released over an empty space');
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
        it('should undo last operation on Ctrl+Z or rclick->Undo');

        it('should redo last undone operation on Ctrl+Shift+Z or Ctrl+Y or rclick->Redo');

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
})

mocha.run();