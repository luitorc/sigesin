// Generated by CoffeeScript 1.10.0
(function() {
  var btn, extraer, rsta;

  btn = this;

  btn.sumar = function() {
    var num, r;
    num = extraer();
    r = num[0] + num[1];
    return rsta(r);
  };

  btn.restar = function() {
    var num, r;
    num = extraer();
    r = num[0] - num[1];
    return rsta(r);
  };

  btn.multiplicar = function() {
    var num, r;
    num = extraer();
    r = num[0] * num[1];
    return rsta(r);
  };

  extraer = function() {
    return [$("#a").val(), $("#b").val()];
  };

  rsta = function(r) {
    return $("#rsta").html(r);
  };

}).call(this);