var baloonTag = "div";
var baloonClass = "bubble";

function CreateBaloon(event) {
    var div = $("<"+baloonTag+"></"+baloonTag+">")
    div.addClass(baloonClass);
    var x = event.clientX;
    var y = event.clientY;
    var w = div.width();
    var h = div.height();
    div.css({ left: x - w / 2, top: y - h / 2 });
    $("body").append(div);
}

function ChangeBaloonContent(baloon) {
    var str = baloon.innerHTML;
    //baloon.innerHTML = '<input type="text" placeholder="Type your text...">'+str+'</input>';
}

$("body").dblclick(function (event) {
    var x = event.clientX, y = event.clientY;
    var element = document.elementFromPoint(x, y);
    var tag = element.tagName.toLowerCase();
    var c = element.className;
    if (tag == "body") CreateBaloon(event);
    else if (tag == baloonTag && c == baloonClass) {
        ChangeBaloonContent(element);
    }
});

$("body").on("contextmenu", function () {
    return false;
}); 

//direction = 1;
//ticker = createjs.Ticker;
//boxElement = document.getElementById('circle');
//ticker.addEventListener("tick", handleTick);
//var vx = 0, vy = 0;
//var i = 0;
//ticker.interval = 1;

//Vmax = 0.5;
//K = 0.01;

//function handleTick(event) {
//    if (boxElement) {
//        dt = ticker.interval;
//        var x = boxElement.offsetLeft;
//        var y = boxElement.offsetTop;
//        if (i > 10) {
//            v = (Math.random() - 0.5) * 2 * Vmax * dt;
//            theta = Math.random() * 360;
//            vx += v * Math.cos(theta);
//            vy += v * Math.sin(theta);
//            i = 0;
//        }
//        i++;
//        v = Math.sqrt(vx * vx + vy * vy);
//        tt = Math.atan2(vy, vx);
//        v -= v * dt * K;
//        vx = Math.cos(tt) * v;
//        vy = Math.sin(tt) * v;
//        if (x > document.body.offsetWidth || x < 0) {
//            vx = -vx;
//        }
//        if (y < 0 || y > document.body.offsetHeight) {
//            vy = -vy;
//        }

//        x += vx * dt;
//        y += vy * dt;
//        x += 'px';
//        y += 'px';
//        boxElement.style.left = x;
//        boxElement.style.top = y;
//        //boxElement.style.translate3d(x, y, 0);

//    }
//}
