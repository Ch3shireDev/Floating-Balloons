Balloon.prototype.openContent = function () {
    closeCurrentTextarea();
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
        var w = getTextLength(text);
        //if (w < 200) {
        //    div.setAttribute('width', 200);
        //} else {
            div.attr('width', w.x);
            fO.setAttribute('width', w.x);
            fO.setAttribute('height', w.y);
        }
    }

function getTextLength(text) {
    var x = text[0].innerHTML;
    return { x: 200, y: 200 };
}

var currentTextareaBalloon = null;

function closeCurrentTextarea() {
    if (currentTextareaBalloon === null) return;
    if (currentTextareaBalloon.fO != null) {
        var s = $('#tarea')[0].innerHTML;
        currentTextareaBalloon.fO.innerHTML = `<div>${s}</div>`;
        currentTextareaBalloon = null;
    }
    currentTextareaBalloon = null;
}