Balloon.prototype.openContent = function () {
    closeCurrentTextarea();
    var b = this;
    var fO = this.fO;
    var div = this.div;

    fO.innerHTML = `<div id="tarea" contentEditable="true" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false">${this.fO.innerHTML}</div>`;
    currentTextareaBalloon = this;

    var text = $('#tarea');
    text.focus();
    text.select();

    fO.oninput = function () {
        var s = $('#tarea').html();
        console.log(s);
    }

    //text.oninput = function () {
    //    console.log('bbb');
    //    var [x, y, w, h] = b.rect();
    //    fO.setAttribute('x', x);
    //    var s = $('#tarea').html();
    //    console.log(s);
    //text.cols = text.value.length;
    //console.log(text.clientWidth + " " + fO.getAttribute('width'));

    //if (text.clientWidth < 200) {
    ////div.attr('width', 200);
    //}
    //else {
    //div.attr('width', text.clientWidth);
    //fO.setAttribute('width', text.clientWidth * 1.2);

    //<div contentEditable="true" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"></div>
    //}
    //var w = text.parentElement.getAttribute('width');
    //w = parseFloat(w);
    //text.parentElement.setAttribute('width', w + 15);
    //};
}

$('body').dblclick(function (event) {
    const x = event.clientX;
    const y = event.clientY;
    const element = document.elementFromPoint(x, y);
    const tag = element.tagName.toLowerCase();

    if (tag === 'svg') {
        Balloons.addBalloon(x, y);
    } else {
        const b = Balloons.findFromElement(element);
        if (b != null) {
            b.openContent();
            $('#tarea').onclick = function () {
            };
        }
    }
});

var currentTextareaBalloon = null;

function closeCurrentTextarea() {
    if (currentTextareaBalloon === null) return;
    if (currentTextareaBalloon.fO === null) return;

    var s = $('#tarea').html();
    currentTextareaBalloon.fO.innerHTML = s;

    currentTextareaBalloon = null;
}