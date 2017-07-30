var lt = require('../helper/luitor_helper.js');

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./db/sistema_miniventas.db');

exports.viewXreceipt = function(req, res, next){
	var obj = lt.getAjax(req,res);

	db.all(`SELECT * FROM venta AS ven`
			+` INNER JOIN producto_venta AS pve ON ven.id_venta = pve.id_venta`
			+` INNER JOIN unidad_medida AS ume ON pve.unidad_medida_v = ume.id_unidad_medida`
			+` WHERE ven.id_venta = '${obj.id_venta}'`
			+` ORDER BY pve.id_venta DESC`,
	function(err, obj1){
		if(err){
            console.log(err);
        }else{
            // console.log(obj1);
            lt.return(obj1, res, next);
        }
	});
}
exports.save = function(req, res, next){
	var obj = lt.getAjax(req,res);

	db.run(`INSERT INTO venta (total, fecha, hora, nombre_cl, direccion_cl, telf_cl, dni_cl, ruc_cl, nro_boleta, nro_factura, id_usuario_vendedor, nro_recibo)`
		+`VALUES('${obj.total}','${obj.fecha}','${obj.hora}','${obj.nombre_cl}','${obj.direccion_cl}','${obj.telf_cl}'`
			+`,'${obj.dni_cl}','${obj.ruc_cl}','${obj.nro_boleta}','${obj.nro_factura}','${obj.id_usuario_vendedor}','${obj.nro_recibo}')`
	,function(err){
		if(err){
            console.log(err);
        }else{
        	var id_venta = this.lastID;
            // console.log("Guardo venta  ID: "+this.lastID);
            saveProductoVenta(obj.listProduct, this.lastID, function(aa){

            	lt.return({id_venta: id_venta}, res, next);
            });

        }
	});
	// console.log(obj.listProduct);
	function saveProductoVenta(lpr, id_venta, callback1){ //saleDetails
		var cont = 0;
		for( i in lpr ){
			db.run(`INSERT INTO producto_venta (id_producto, id_venta, cant_v, unidad_medida_v, precio_v, subtotal_v, tipo_moneda_v, nombrep_v)`
			+`VALUES('${lpr[i].id_producto}','${id_venta}','${lpr[i].cantList}','${lpr[i].unidad_medida_v}','${lpr[i].precio_v}','${lpr[i].subtotal_v}'`
				+`,'${lpr[i].tipo_moneda_v}','${lpr[i].nombrep_v}')`
			,function(err){
				cont++;
				if(err){
		            console.log(err);
		        }else{
		            console.log("- producto_venta regis ID: "+this.lastID);
		            
		            // console.log(parseInt(i));
		            if( cont == lpr.length )
		            	callback1('aa');
		        }
			});
			//Reducimos stock
            db.run(`UPDATE producto SET stock=stock-'${lpr[i].cantList}' WHERE id_producto = '${lpr[i].id_producto}'`
            	,function(err){
            		if(err){
			            console.log(err);
			        }else{
		            	console.log("Se redujo stock");
			        }
            });
		}
	}
}
exports.view = function(req, res, next){

	db.all(`SELECT * FROM venta ORDER BY id_venta DESC`,function(err, obj){
		if(err){
            console.log(err);
        }else{
            // console.log(obj);
            lt.return(obj, res, next);
        }
	});
}


