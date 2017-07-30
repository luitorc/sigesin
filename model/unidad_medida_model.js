var lt = require('../helper/luitor_helper.js');

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./db/sistema_miniventas.db');

exports.getUnidadMedida = function(req, res, next){
	db.all("SELECT * FROM unidad_medida ", function(err, obj) {
	console.log(obj);
	  lt.return(obj,res,next);
	});
}