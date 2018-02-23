Balloon.prototype.openContent = function () {
    closeCurrentTextarea();
    var b = this;
    var fO = this.fO;
    var div = this.div;

    var s = this.fO.textContent;

    fO.innerHTML = `<div id="tarea" contentEditable="true" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false">${s}</div>`;
    currentTextareaBalloon = this;

    var text = $('#tarea');
    text.focus();
    text.select();

    fO.oninput = function () {
        var w = text.width();
        if (w < 200) {
            div.setAttribute('width', 200);
        } else {
            div.attr('width', w);
            fO.setAttribute('width', w);
        }

    }
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

    var s = $('#tarea').text();
    currentTextareaBalloon.fO.innerHTML = `<div>${s}</div>`;

    currentTextareaBalloon = null;
}