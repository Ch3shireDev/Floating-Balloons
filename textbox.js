Balloon.prototype.openContent = function () {
    closeCurrentTextarea();
    var b = this;
    var fO = this.fO;
    var div = this.div;

    var s = this.fO.textContent;

    fO.innerHTML = `<div id="tarea" contentEditable="true" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false">${s}</div>`;
    currentTextareaBalloon = this;

    //this small code moves cursor to end
    var range = document.createRange();
    range.selectNodeContents(fO.childNodes[0]);
    range.collapse(false);
    var selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);

    var text = $('#tarea');
    text.focus();
    text.select();

    fO.oninput = function () {
        var w = text.width()+10;
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
    if (currentTextareaBalloon.fO != null) {
        var s = $('#tarea').text();
        currentTextareaBalloon.fO.innerHTML = `<div>${s}</div>`;
        currentTextareaBalloon = null;
    }
    currentTextareaBalloon = null;
}