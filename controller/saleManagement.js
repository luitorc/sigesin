var lt = require('../helper/luitor_helper.js');
var producto_model = lt.model('producto');
var venta_model = lt.model('venta');

exports.receiptView = function(req, res, next){
	var obj = lt.getAjax(req,res);

	venta_model.viewXreceipt({ id_venta: obj.id_venta },function(obj1){

		lt.return(obj1,res,next);
	});
}

exports.sellCart = function(req,res,next){
	var obj = lt.getAjax(req,res);
	// console.log(req.session.venta.total);
	venta_model.save({
		total: req.session.venta.total
		,fecha: lt.getFechaStr(new Date())
		,hora: lt.getTimeStr(new Date())
		,nombre_cl: obj.nombre_cl
		,direccion_cl: obj.direccion_cl
		,telf_cl: obj.telf_cl
		,dni_cl: obj.dni_cl
		,ruc_cl: obj.ruc_cl
		,nro_boleta: obj.nro_boleta
		,nro_factura: obj.nro_factura
		,id_usuario_vendedor: 1
		,nro_recibo: '12011293'
		,listProduct: req.session.listProduct
	},function(obj1){
		console.log("VENTA ID: "+obj1.id_venta);
		req.session.listProduct = []; //	Para recetear carrito
		req.session.arrayCheck = []; //	Para recetear carrito
		lt.return({
			msn:"Se realizo la venta a '"+obj.nombre_cl +"'"
			,id_venta: obj1.id_venta
		}, res,next); 
	});

	// console.log( lt.getFechaStr(new Date()) );
	// console.log( lt.getTimeStr(new Date()) );
	// var nombre = `luis Manuel`;
	// var lastName = `Torres Carpio`;

	// var sql = `INSERT INTO (name,lastName)VALUES('${nombre}','${lastName}')`;
}
exports.getSales = function(req, res, next){
	venta_model.view({}, function(obj){
		console.log("ya esta");
		lt.return(obj,res,next);
	}, next);
}
