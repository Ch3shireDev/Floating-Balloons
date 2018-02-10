//describe('Bubble', function () {
//    describe('Creation', function () {
//        it('bubble should appear when called', function () {

//        });
//    });
//});


let expect = chai.expect
describe('Creating new bubble', () => {
    it('Double click to make new element', () => {

        var x0 = 450, y0 = 350;

        var event = new MouseEvent('dblclick', {
            view: window,
            clientX: x0,
            clientY: y0
        });
        $('body')[0].dispatchEvent(event);

        var b = $('.bubble')

        var w = b.width();
        var h = b.height();

        var x = b.position().left + w / 2;
        var y = b.position().top + h / 2;

        x.should.equal(x0);
        y.should.equal(y0);

        b.remove();

    })
})