
let expect = chai.expect;

describe('Array', function () {
    describe('#indexOf()', function () {
        it('should return -1 when the value is not present', function () {
            [1, 2, 3].indexOf(5).should.equal(-1);
            [1, 2, 3].indexOf(1).should.equal(0);
            
        });
    });
});

describe('fun', function () {
    it('should be 0', function () {
        (0).should.equal(0);
    });   
});