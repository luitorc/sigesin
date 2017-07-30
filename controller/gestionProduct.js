var lt = require('../helper/luitor_helper.js');
var producto_model = lt.model('producto');

// var arrayCheck = [];
exports.deleteProductCart = function(req, res, next){
	var sess = req.session;
	var obj = lt.getAjax(req,res);
	// delete sess.listProduct[obj.pos];
	// Find and remove item from an array
	var index = parseInt(obj.pos);
	array = sess.listProduct;
	if(index != -1) {
		array.splice(index, 1);
		sess.arrayCheck.splice(index, 1);
	}
	
	lt.return({msn:"Eliminado pos "+obj.pos}, res, next);
}
exports.saveCheckSession = function(req, res, next){
	var sess = req.session;
	var obj = lt.getAjax(req,res);

	if(!sess.arrayCheck)
		sess.arrayCheck = [];
	
	var ok = true;
	for( i in sess.arrayCheck ){
		if( sess.arrayCheck[i] == obj.id_producto ){
			req.session.listProduct[parseInt(i)].cantList = obj.cantList;
			ok = false;
		}
	}
	if( ok ){
		var attr = {};
		attr.id_producto = obj.id_producto;
		attr.cantList = obj.cantList;
		req.session.listProduct.push(attr);
		// req.session.listProduct = myArr.unique(req.session.listProduct);

		sess.arrayCheck.push(obj.id_producto);

		lt.return({msn:"Se agrego al carrito"}, res, next);
	}else{
		lt.return({msn:"El producto se actualizo"}, res, next);
	}
	
}
exports.getCheckSession = function(req, res, next){
	var listProduct = req.session.listProduct;
	// var venta_sess = req.session.venta;
	// console.log(listProduct);
	var listProductR = [];
	var total = 0;

		producto_model.getData({},function(obj1){
			for( ii in listProduct ){
				for( i in obj1 ){
					if( listProduct[ii].id_producto == obj1[i].id_producto ){
						obj1[i].nro = parseInt(i)+1;
						obj1[i].cantList = listProduct[ii].cantList;
						obj1[i].subTotal = obj1[i].precio * parseInt(listProduct[ii].cantList);
						total = total + parseFloat(obj1[i].subTotal);
						//saco de cokkie
						listProduct[ii].unidad_medida_v = obj1[i].id_unidad_medida;
						listProduct[ii].precio_v = obj1[i].precio;
						listProduct[ii].subtotal_v = obj1[i].subTotal;
						listProduct[ii].tipo_moneda_v = "S/";
						listProduct[ii].nombrep_v = obj1[i].nombrep;

						listProductR.push(obj1[i]);
					}
				}
			}
			req.session.venta = {total: total};
			// console.log(listProductR);
			lt.return({listProductR: listProductR, total:total }, res, next);
		});
	
	
		
}
exports.view = function (req, res, next){
	// var sess = req.session;
	// sess.mensaje ="A";
	producto_model.getData({},function(obj){
		lt.return(obj, res, next);
	});
}
exports.save = function (req, res, next){

	producto_model.view({},function(obj){
		lt.return(obj, res, next);
	});
}

