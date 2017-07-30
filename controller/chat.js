var lt = require('../helper/luitor_helper.js');
var chat_model = lt.model('chat');
var user_model = lt.model('user');

exports.chat_list = function(req, res, next){
	var obj = lt.getAjax(req, res);

	user_model.user_list(req,function(obj1){
		chat_model.cantmsn_forme(req,function(obj2){
			for( i in obj1 ){
				var into = false,into_index;
				for( ii in obj2 ){
					if( obj1[i].id_usuario == obj2[ii].user_emit ){
						into = true;
						into_index = ii;
					}

				}
				if(into)
					obj1[i].cant = "<span class='cant_msn'>"+obj2[into_index].count+"</span>";
				else
					obj1[i].cant="";
			}
			res.send(obj1);
		});
	});
}
exports.msn_waiting = function(req, res, next){
	var obj = lt.getAjax(req, res);

	chat_model.msn_waiting(req,function(obj1){
		// res.locals.io.emit('chat_viewed_res', {
		// 	user_recept: obj.id_usuario
		// });
		res.send(obj1);
	});
}
exports.send_msn = function(req, res, next){
	var obj = lt.getAjax(req, res);
	chat_model.send_msn(req,function(obj1){
		res.locals.io.emit('open_chat', true);
		setTimeout(function(){
			res.locals.io.emit('chat_msn_res', {
				user_recept: obj.user_recept
				,user_emit: obj.user_emit
				,texto: obj.text1
				,usuario_name: obj.usuario_name
			});

		},2000);
		res.send(obj1);
	});
}
exports.viewed = function(req, res, next){
	var obj = lt.getAjax(req, res);

	chat_model.viewed(req,function(obj1){
		res.locals.io.emit('chat_viewed_res', {
			user_recept: obj.id_usuario
			,user_emit: obj.id_user
		});
		res.send(obj1);
	});
}
