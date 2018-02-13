var s = Snap("#body");

//lets draw 2 rects at position 100,100 and then reposition them

var svg = document.querySelector('svg');
var pt = svg.createSVGPoint();

function cursorPoint(x, y) {
    pt.x = x; pt.y = y;
    return pt.matrixTransform(svg.getScreenCTM().inverse());
}

$("#abc").click(function () {
    var x = r.attr('x');
    x = parseFloat(x);
    x += 100;
    r.attr('x', ""+x);
})

var numBalloons = 0;

function Balloon(x, y) {
    
    this.x = x;
    this.y = y;

    this.W = 100;
    this.H = 100;

    this.div = CreateBalloon(x, y);
    this.id = this.div.attr('id');

    this.Move = function (x, y) {
        const w = this.W;
        const h = this.H;

        x = x - w / 2;
        y = y - h / 2;

        pt = cursorPoint(x, y);

        x = pt.x;
        y = pt.y;

        this.div.attr('x', x);
        this.div.attr('y', y);

    }

}

var AllBalloons = [];

var BalloonsList = {
    findFromId: function(id) {
        for (var i = 0; i < AllBalloons.length; i++) {
            if (AllBalloons[i].id == id) {
                return AllBalloons[i];
            }
        }
        return null;
    },

    findFromDiv: function(div) {
        return this.findFromId(div.attr('id'));
    },

    insert: function(balloon) {
        AllBalloons.push(balloon);
    }
};

BalloonsList.insert(new Balloon(300, 400));


function CreateBalloon(x, y) {
    
    pt = cursorPoint(x, y);
    x = pt.x-100;
    y = pt.y-100;

    var div = s.rect(x, y, 200, 200, 200, 200);
    div.attr({
        id: 'balloon' + numBalloons,
        stroke: '#123456',
        'strokeWidth': 20,
        fill: 'red',
        'opacity': 0.8
    });
    
    numBalloons++;

    return div;

//    console.log(numBalloons);

//    const w = div.width();
//    const h = div.height();
//    div.css({ left: x - w / 2, top: y - h / 2 });
//    $('body').append(div);
//    return div;
}

//function OpenBalloonContent(balloon) {
//    const str = balloon.innerHTML;
//    balloon.innerHTML = `<textarea id="textArea1" cols="10" rows="2">${str}</textarea>`;
//    $('body').click(function () {
//        balloon.innerHTML = $('#textArea1').val();
//        $('body').off('click');
//    });
//}

$('#body').dblclick(function (event) {
    var x = event.clientX, y = event.clientY;
    var element = document.elementFromPoint(x, y);
    var tag = element.tagName.toLowerCase();

    console.log(tag);

    if (tag == 'svg') {
        AllBalloons.push(new Balloon(x, y));
    }
    else if (tag == 'rect') {
        OpenBalloonContent(element);
    }
});

$('#body').contextmenu(() => {
    return false;
});

var mouseDown = false;
var xy = {};

var currElement = null;

document.body.onmousedown = (evt) => {
    
    mouseDown = true;
    var x = evt.clientX, y = evt.clientY;
    xy = { x: x, y: y };

    var element = document.elementFromPoint(x, y);

    var id = element.id;
    console.log(element.outerHTML);
    currElement = BalloonsList.findFromId(id);
    
}

document.body.onmouseup = () => {
    mouseDown = false;
}

var isDragging = false;
document.body.onmousemove = (evt) => {
    if (mouseDown) {
        var x = evt.clientX,
            y = evt.clientY;
        var dx = x - xy.x,
            dy = y - xy.y;
        if (dx * dx + dy * dy > 1000) {
            isDragging = true;
            DragSelectedObject(x,y);
        }
    }
}

function DragSelectedObject(x, y) {
    if (currElement != null) {
        currElement.Move(x, y);
    }
}

