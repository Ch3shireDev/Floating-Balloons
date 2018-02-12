var balloonTag = 'div';
var balloonClass = 'bubble';
var numBalloons = 0;

function Balloon(x, y) {

    const balloonTag = 'div';
    const balloonClass = 'bubble';    

    this.x = x;
    this.y = y;
    this.div = CreateBalloon(x, y);
    this.id = this.div.attr('id');

    this.Move = function (x, y) {
        const w = this.div.width();
        const h = this.div.height();
        this.div.css({ left: x - w / 2, top: y - h / 2 });
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
    //const div = $(`<svg width= "100" height= "100"> <circle cx="50" cy="50" r="40" stroke="green" stroke- width="4" fill="yellow"/></svg>`);
    const div = $(`<${balloonTag}></${balloonTag}>`);
    div.addClass(balloonClass);
    div.attr('id', 'balloon' + numBalloons);
    div.attr('draggable', 'true');
    numBalloons++;

    console.log(numBalloons);

    const w = div.width();
    const h = div.height();
    div.css({ left: x - w / 2, top: y - h / 2 });
    $('body').append(div);
    return div;
}

function OpenBalloonContent(balloon) {
    const str = balloon.innerHTML;
    balloon.innerHTML = `<textarea id="textArea1" cols="10" rows="2">${str}</textarea>`;
    $('body').click(function () {
        balloon.innerHTML = $('#textArea1').val();
        $('body').off('click');
    });
}

$('body').dblclick(function (event) {
    var x = event.clientX, y = event.clientY;
    var element = document.elementFromPoint(x, y);
    var tag = element.tagName.toLowerCase();
    var c = element.className;
    if (tag == 'body') {
        AllBalloons.push(new Balloon(x, y));
    }
    else if (tag == balloonTag && c == balloonClass) {
        OpenBalloonContent(element);
    }
});

$('body').contextmenu(() => {
    return false;
});

$('div').click(function () {
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

    console.log("selected element: " + currElement+" "+id);
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
            console.log("drag");
            isDragging = true;
            DragSelectedObject(x,y);
        }
    }
}

function DragSelectedObject(x, y) {
    if (currElement != null) {
        console.log(currElement.id+" "+currElement);
        currElement.Move(x, y);
    }
}