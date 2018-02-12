var balloonTag = 'div';
var balloonClass = 'bubble';

function CreateBalloon(event) {
    const div = $(`<${balloonTag}></${balloonTag}>`);
    div.addClass(balloonClass);
    const x = event.clientX;
    const y = event.clientY;
    const w = div.width();
    const h = div.height();
    div.css({ left: x - w / 2, top: y - h / 2 });
    $('body').append(div);
    return div;
}

function CreateBalloonOnCoords(x, y) {
    var event = new MouseEvent({ clientX: x, clientY: y });
    return CreateBalloon(event);
}

function OpenBalloonContent(balloon) {
    const str = balloon.innerHTML;
    balloon.innerHTML = `<textarea id="textArea1" cols="10" rows="2">${str}</textarea>`;
    $('body').click(function (event) {
        balloon.innerHTML = $('#textArea1').val();
        $('body').off('click');
    });
}

$('body').dblclick(function (event) {
    var x = event.clientX, y = event.clientY;
    var element = document.elementFromPoint(x, y);
    var tag = element.tagName.toLowerCase();
    var c = element.className;
    if (tag == 'body') CreateBalloon(event);
    else if (tag == balloonTag && c == balloonClass) {
        OpenBalloonContent(element);
    }
});

$('body').contextmenu(() =>{
    return false;
});

$('div').click(function () {
});

var mouseDown = false;
var xy = {};

document.body.onmousedown = (evt) => {
    mouseDown = true;
    xy = { x: evt.clientX, y: evt.clientY };
}
document.body.onmouseup = ()=> {
    mouseDown = false;
}

var isDragging = false;
document.body.onmousemove = (evt) => {

    if (mouseDown) {
        var dx = xy.x - evt.clientX,
            dy = xy.y - evt.clientY;
        if (dx * dx + dy * dy > 1000) {
            isDragging = true;
            DragSelectedObject();
        }
    }
}

function DragSelectedObject() {
    alert('drag');
}