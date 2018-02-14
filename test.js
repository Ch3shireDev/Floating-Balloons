Mouse = {
    RunEvent: function (name, x, y) {
        $('body')[0].dispatchEvent(
            new MouseEvent(name,
                {
                    view: window,
                    clientX: x,
                    clientY: y
                })
        );
    },

    DoubleClick: function (x, y) {
        this.RunEvent('dblclick', x, y);
    },

    Click: function (x, y) {
        this.RunEvent('mousedown', x, y);
    },

    Move: function (x, y) {
        this.RunEvent('mousemove', x, y);
    }
}

function GetXYWH(div) {
    var w = parseFloat(div.attr('width')),
        h = parseFloat(div.attr('height'));

    var x = parseFloat(div.attr('x')),
        y = parseFloat(div.attr('y'));

    return [x, y, w, h];
}

let expect = chai.expect;

describe('Creating new bubble',
    () => {
        it('should understand double click as a command to create a new bubble',
            () => {
                var x0 = 200, y0 = 200;

                Mouse.DoubleClick(x0, y0);

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
    });

describe('Moving a bubble',
    () => {
        it('should be grabbed on click-and-hold', () => {
            var x0 = 500, y0 = 200;

            Mouse.DoubleClick(x0, y0);
            Mouse.Click(x0, y0);

            var b = Balloons.getLastBalloon();

            b.isGrabbed().should.equal(true);
        });

        it('should be highlighted when grabbed');

        it('should move with cursor when grabbed', () => {
            var [x0, y0] = [500, 200],
                [dx, dy] = [200, 300];

            Mouse.DoubleClick(x0, y0);
            Mouse.Click(x0, y0);
            Mouse.Move(dx, dy);

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

        it('should get on top when grabbed');

        it('should set a new place when released');
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
        it('should undo last operation on Ctrl+Z or rClick->Undo');

        it('should redo last undone operation on Ctrl+Shift+Z or Ctrl+Y or rClick->Redo');

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