var lt = require('../helper/luitor_helper.js');
var user_model = lt.model('user');

exports.access = function(req, res, next){
	var obj = lt.getAjax(req, res);
	// console.log(obj.password);
	user_model.access(req,function(obj1){

		if( 'rmt' in obj ){
			res.send(JSON.stringify(obj1));return;
		}
		
		// var xd =
		if( obj1.length != 0){
			req.session.usuario = obj1[0];
			// console.log(obj1.length);
			if( req.session.usuario.usuario_name == "luis.torres" ){
				req.session.usuario.priv = "admin"; // Privilegio
			}
			else
				req.session.usuario.priv = false;

			if( typeof obj.direccion != "undefined" ){
				console.log("entro->"+obj.direccion);
				res.redirect(obj.direccion);
			}else{
				req.session.rdr = "attention";
				res.redirect('/user_panel');
				
			}
			// next();
		}else{
			if( obj.direccion == "/mini_chat?clis" ){
				res.redirect('/mini_chat');
			}else{
				res.render('login',{
					msn: "Lo sentimos, login o password Incorrectos"
				});							
			}
		}
	});
};

