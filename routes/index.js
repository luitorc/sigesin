var lt = require('../helper/luitor_helper.js');

exports.directorio_becario = function(req, res){
	res.render('modules/directorio_becario');
}
exports.info_user = function(req, res){
	var q = req.query; 

	res.render('info_user',{
		nro: q.nro?q.nro:0 
		,type: q.type?q.type:0 
	});
}
exports.mini_chat = function(req, res){
	var obj = lt.getAjax(req,res);
	console.log("ingreso");
	console.log(req.session.usuario);
	res.render('mini_chat',{
		init: res.locals.init
		,usuario: req.session.usuario
		,params: obj
		,model: {
			user: lt.model('user')
			,chat: lt.model('chat')
		}
		,lib: {
			Deasync: require('deasync') 
		}
	});
}
exports.diffusion = function(req, res){
	var obj = lt.getAjax(req,res);
	res.render('modules/diffusion',{
		init: res.locals.init
		,params: obj
	});
}
exports.sindibe = function(req, res){
	var obj = lt.getAjax(req,res);
	res.render('modules/sindibe',{
		init: res.locals.init
		,params: obj
	});
}
exports.sidesun = function(req, res){
	var obj = lt.getAjax(req,res);
	res.render('modules/sidesun',{
			init: res.locals.init
			,params: obj
		});
	/*
	if( req.session.usuario.area == "Especialista en Becas" || req.session.usuario.area == "Practicante de informatica"  )
		res.render('modules/sidesun',{
			init: res.locals.init
			,params: obj
		});
	else{
		res.send('<div align="center" style="height:600px;background-color:white;">Modulo restringido</div>');
	}*/
}
exports.index = function(req, res){
	var account = false;
	if( req.session.usuario ){
		account = true;
		console.log("Session activa");
	}
	var usuario = false;
	if( req.session.usuario ){
		usuario = req.session.usuario;
	}
	res.render('index',{
		init: res.locals.init
		,account: account
		,cuenta: usuario
	});
}

exports.login = function(req, res){
	res.render('login',{
		init: res.locals.init
	});
}
exports.user_panel = function(req, res){
	if( !req.session.usuario )
		res.redirect('/login');

	res.render('user_panel',{
		init: res.locals.init
		,usuario: req.session.usuario
	});
}
exports.register = function(req, res){
	res.render('register',{
		init: res.locals.init
	});
}

exports.solicitar_servicios = function(req, res){
	res.render('layout/modules/solicitar_servicios',{
		init: res.locals.init
	});
}
exports.sigedo = function(req, res){
	res.render('layout/modules/sigedo',{
		init: res.locals.init
	});
}
exports.attention = function(req, res){
	var obj = lt.getAjax(req,res);
	// console.log(req.session.usuario);
	res.render('modules/attention',{
		init: res.locals.init
		,user: req.session.usuario
		,params: obj
	});
}
exports.attention_list = function(req, res){

	var query = req.query;
	res.render('attention_list',{
		init: res.locals.init
		,option: query.option
	});
}

exports.register_attention = function(req, res){
	var obj = lt.getAjax(req,res);
	req.session.rdr = obj.rdr;

	res.render('register_attention',{
		init: res.locals.init
		,rdr: obj.rdr
		,params: obj
		,user: req.session.usuario
	});
}
















exports.receipt = function(req, res){
	var obj = lt.getAjax(req,res);
	if(!obj.idv)
		obj.idv = 0;
	res.render('receipt',{
		idv: obj.idv
		,cl: obj.cl
	});
}
exports.sales = function(req, res){
	var venta_model = lt.model('venta');
	var obj = lt.getAjax(req,res);
	venta_model.view({},function(obj){
		console.log(obj);
		res.render('sales',{
			idv:obj.idv
			,objv: obj
		});
	});
	
}



exports.index2 = function(req, res){
	var obj = lt.getAjax(req,res);
	var sess = req.session;
	if (!sess.listProduct) {
    	sess.listProduct = [];
	}
		var gestionProduct = lt.controller('gestionProduct');
		var producto_model = lt.model('producto');
		switch(req.query.option){
			case 'viewp':
				gestionProduct.view({},function(obj1){
					res.render('index', { 
						sub_title: "Lista de productos"
						,option: req.query.option
						,number: obj.number
						,products: obj1
						// ,listCart: sess.views
						,listCart: req.session.listProduct
						,idp:req.query.idp
					});
				});
				break;
			case 'regisp':
				var sub_title;
				if( req.query.idp ){ //Exist id_producto? par actualizar
					sub_title = "Actualizacion de producto";
					producto_model.getDataXproduct({id_producto:req.query.idp},function(obj1){
						console.log(obj1);
						res.render('index', { 
							sub_title: sub_title
							,option: req.query.option
							,dt: obj1[0]
						});
					});
				}else{
					sub_title = "Registro de nuevo producto";
					res.render('index', { 
						sub_title: sub_title
						,option: req.query.option
						,dt: {
							id_producto: ""
							,nombrep: ""
							,stock: ""
							,precio: ""
							,id_unidad_medida: ""
						}
					});
				}

				break;
			default:
					sub_title = "Registro de nuevo producto";
					res.render('index', { 
						sub_title: sub_title
						,option: "other"
					});
				break;
		}
}
exports.saludo = function(req, res){
	var obj = lt.getAjax(req,res);

	res.send('hello world: -> '+obj.dt);
}
 