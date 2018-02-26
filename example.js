var mouse = { 'x': 0, 'y': 0 };

var homex = 0;
var homey = 0;
var forcex = 0;
var forcey = 0;
var magnet = 500;

$(document).bind('mousemove', function (e) {
    mouse = { 'x': e.pageX, 'y': e.pageY };
    var x = $(e.target).closest($('.ball'));
    console.log(x);
});

setInterval(function () {
    //console.log(x);
}, 100);