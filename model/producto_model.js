var lt = require('../helper/luitor_helper.js');

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./db/sistema_miniventas.db');

exports.update = function(req, res, next){
	var obj = lt.getAjax(req,res);
	// console.log(obj.id_unidad_medida);
    db.run("UPDATE producto"
    	+" SET nombrep='"+obj.nombrep
    	+"',stock='"+obj.stock
    	+"',precio='"+obj.precio
    	+"',id_unidad_medida='"+obj.id_unidad_medida
    	+"' WHERE id_producto='"+obj.id_producto+"'");
	console.log("entro a update");
	lt.return({msn:"Se Actualizo con exito"},res,next);
}

exports.save = function(req, res, next){
	var obj = lt.getAjax(req,res);
	console.log(obj.id_unidad_medida);
    db.run("INSERT INTO producto (nombrep,stock,precio,id_unidad_medida,id_usuario,activo)"
	+"VALUES('"+obj.nombrep+"','"+obj.stock+"','"+obj.precio+"','"+obj.id_unidad_medida+"',1,1)");
	console.log("entro a save");
	lt.return({msn:"Se guardo con exito"},res,next);
	
	
}
exports.getData = function(req, res, next){
	// db.serialize(function() {
	db.all("SELECT * FROM producto AS pro "
			+"INNER JOIN unidad_medida AS ume ON pro.id_unidad_medida = ume.id_unidad_medida ORDER BY id_producto DESC", function(err, obj) {
	  lt.return(obj,res,next);
	});
	// }).close();
}
exports.getDataXproduct = function(req, res, next){
	var obj = lt.getAjax(req,res);
	db.all("SELECT * FROM producto AS pro "
			+"INNER JOIN unidad_medida AS ume ON pro.id_unidad_medida = ume.id_unidad_medida WHERE id_producto="+obj.id_producto, function(err, obj) {
	// console.log(obj);
	  lt.return(obj,res,next);
	});
}
