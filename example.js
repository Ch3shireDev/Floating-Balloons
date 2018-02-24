class Class {
}

Class.static_fun = function () { console.log("some static method"); }
Class.prototype.fun = function () { console.log("some method") }

var object = new Class();
Class.static_fun();
object.fun();