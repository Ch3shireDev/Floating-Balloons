Mouse = {
    runEvent: function(name, x, y) {
        $('body')[0].dispatchEvent(
            new MouseEvent(name,
                {
                    view: window,
                    clientX: x,
                    clientY: y
                })
        );
    },

    doubleclick: function(x, y) {
        this.runEvent('dblclick', x, y);
    },

    click: function(x, y) {
        this.runEvent('mousedown', x, y);
    },

    move: function(x, y) {
        this.runEvent('mousemove', x, y);
    },

    release: function(x, y) {
        this.runEvent('mouseup', x, y);
    }
};

var x0 = 100, y0 = 50;
let expect = chai.expect;

describe('Creating new bubble',
    () => {
        it('should understand double click as a command to create a new bubble',
            () => {

                Mouse.doubleclick(x0, y0);

                var [x, y, w, h] = Balloons.getLast().rect();

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
                var b = Balloons.getLast();
                b.fO.should.not.equal(null);
                Balloons.removeLast();
                (b.fO == null).should.equal(true);
            });


        it('should move the text together with bubble',
            () => {

                var dx = 100, dy = 0;

                Mouse.doubleclick(x0, y0);

                var b = Balloons.getLast();
                var x1 = b.fO.getAttribute('x'),
                    y1 = b.fO.getAttribute('y');

                var [x3, y3, z3, t3] = b.rect();

                Mouse.click(x0, y0);
                Mouse.move(x0 + dx, y0 + dy);

                var x2 = b.fO.getAttribute('x'),
                    y2 = b.fO.getAttribute('y');

                var [x4, y4, z4, t4] = b.rect();

                x1 = parseFloat(x1);
                y1 = parseFloat(y1);
                x2 = parseFloat(x2);
                y2 = parseFloat(y2);

                (x2 - x1).should.equal(x4 - x3);
                (y2 - y1).should.equal(y4 - y3);
            });

    });

describe('Moving a bubble',
    () => {
        it('should be grabbed on click-and-hold',
            () => {
                var x0 = 500, y0 = 200;

                Mouse.doubleclick(x0, y0);
                Mouse.click(x0, y0);

                Balloons.getLast().isGrabbed().should.equal(true);
                Balloons.removeLast();
            });

        it('should move with cursor when grabbed',
            () => {
                var [x0, y0] = [500, 200],
                    [dx, dy] = [200, 300];

                Mouse.doubleclick(x0, y0);
                Mouse.click(x0, y0);
                Mouse.move(dx, dy);

                var [x, y, w, h] = Balloons.getLast().rect();

                var cPoint = cursorPoint(dx - w / 2, dy - h / 2);
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

        it('should get on top when grabbed',
            () => {
                var b1 = Balloons.addBalloon(100, 100);
                var b2 = Balloons.addBalloon(300, 100);

                var x0 = b2.div.attr('x');

                Mouse.click(100, 100);
                Mouse.move(200, 100);
                Mouse.release(200, 100);
                Mouse.click(200, 100);
                Mouse.move(300, 100);
                Mouse.release(300, 100);

                var x1 = b2.div.attr('x');

                x0.should.equal(x1);

                Balloons.removeLast();
                Balloons.removeLast();
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
            });

    });

describe('Changing a text',
    () => {
        it('should open a textarea on double click',
            () => {
                Balloons.addBalloon(x0, y0);
                Mouse.doubleclick(x0, y0);
                var element = document.elementFromPoint(x0, y0);
                element.should.not.equal(null);
                ($('textarea')[0]).should.not.equal(null);
                Balloons.removeLast();
            });

        it('should close a textarea on click outside the bubble',
            () => {
                Balloons.addBalloon(x0, y0);
                Mouse.doubleclick(x0, y0);
                Mouse.click(x0 + 200, y0);
                var element = document.elementFromPoint(x0, y0);
                element.should.not.equal(null);
                element.tagName.toLowerCase().should.not.equal('textarea');
                Balloons.removeLast();
            });

        it('should contain current text in a textarea',
            () => {
                var b = Balloons.addBalloon(x0, y0);
                b.fO.innerHTML = 'abc';
                Mouse.doubleclick(x0, y0);
                $('textarea').val().should.equal('abc');
                Balloons.removeLast();
            });

        it('should contain text from textarea in a textbox',
            () => {
                var b = Balloons.addBalloon(x0, y0);
                Mouse.doubleclick(x0, y0);
                $('textarea').val('abc');
                Mouse.click(x0 + 200, y0);
                b.fO.innerHTML.should.equal('abc');
                Balloons.removeLast();
            });

        it('should resize a balloon when resizing a textbox');
        
        
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