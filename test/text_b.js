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

        it('should preserve right proportions of textbox and balloon after zooming out',
            () => {
                Balloons.addBalloon(x0, y0);
                var b = Balloons.getLast();
                Mouse.doubleclick(x0, y0);
                $('#tarea').html('abcabcabcabc');
                b.onInput();
                Mouse.click(x0 + 500, y0);
                Space.zoom(500);
                var [x1, y1] = [b.fO.getAttribute('width'), b.fO.getAttribute('height')];
                Mouse.doubleclick(x0, y0);
                b.onInput();
                Mouse.click(x0 + 500, y0);
                var [x2, y2] = [b.fO.getAttribute('width'), b.fO.getAttribute('height')];
                x1.should.be.equal(x2);
                y1.should.be.equal(y2);
                Space.clear();
            });
    });