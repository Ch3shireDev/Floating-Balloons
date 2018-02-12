let expect = chai.expect;

describe('Creating new bubble',
    () => {
        it('should understand double click as a command to create a new bubble',
            () => {
                var x0 = 450, y0 = 350;

                var event = new MouseEvent('dblclick',
                    {
                        view: window,
                        clientX: x0,
                        clientY: y0
                    });
                $('body')[0].dispatchEvent(event);

                var b = $(`.${balloonClass}`);

                var w = b.width();
                var h = b.height();

                var x = b.position().left + w / 2;
                var y = b.position().top + h / 2;

                x.should.equal(x0);
                y.should.equal(y0);

                b.remove();
            });
    });

describe('Moving a bubble',
    () => {
        it('should be grabbed on click-and-hold', () => {
            var x0 = 500, y0 = 200;
            CreateBalloonOnCoords(x0,y0);
            var event = new MouseEvent('dblclick',
                {
                    view: window,
                    clientX: x0,
                    clientY: y0
                });
            $('body')[0].dispatchEvent(event);
        });

        it('should be highlighted when grabbed');

        it('should move with cursor when grabbed');

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