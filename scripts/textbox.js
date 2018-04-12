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

    Balloon.prototype.onInput = function (balloon) {
        var w1 = balloon.W();
        var w = getTextLength(text);
        var width = w.x;
        var height = w.y;
        balloon.W0 = width;
        balloon.H0 = height;
        balloon.div.attr('width', width);
        balloon.div.attr('height', height);
        balloon.fO.setAttribute('width', width);
        balloon.fO.setAttribute('height', height);
        balloon.moveInternal(balloon.x, balloon.y);
        balloon.drop();
    }

    var b = this;
    fO.oninput = () => { Balloon.prototype.onInput(b); };
}

function getTextLength(text) {
    var str = $('#tarea').html();
    str = str.replace(/<br>$/, '');
    str = str.replace(/\n$/, '');
    str = str.replace(/<br>/g, '\n');
    console.log(str);
    var x = text[0].textContent;
    var y = 100 + 100 * str.split('\n').length;;
    var n = 50 * x.length + 200;
    return { x: n, y: y };
}

var currentTextareaBalloon = null;

function closeCurrentTextarea() {
    if (currentTextareaBalloon === null) return;
    currentTextareaBalloon.drop();
    if (currentTextareaBalloon.fO != null) {
        var s = $('#tarea')[0].innerHTML;
        currentTextareaBalloon.fO.innerHTML = `<div class="inner-text">${s}</div>`;
        currentTextareaBalloon = null;
    }
    currentTextareaBalloon = null;
}