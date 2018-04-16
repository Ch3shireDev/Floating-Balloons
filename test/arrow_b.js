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