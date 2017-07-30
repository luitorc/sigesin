var lt = require('../helper/luitor_helper.js');
var attention_model = lt.model('attention');


exports.checkShipments = function(req, res, next){
	// var sess = req.session;
	// var obj = lt.getAjax(req,res);
	// console.log(obj);

	attention_model.checkShipments(req,function(obj1){
		// console.log(obj1);
		res.send(obj1[0]);
	});
	
}
exports.saveShipping = function(req, res, next){
	attention_model.saveShipping(req,function(obj1){

		res.send(obj1);
	});
	
}

exports.checkAttention = function(req, res, next){
	// var sess = req.session;
	// var obj = lt.getAjax(req,res);
	// console.log(obj);

	attention_model.checkAttention(req,function(obj1){
		// console.log(obj1);
		res.send(obj1[0]);
	});
	
}
exports.get_allAttention_req = function(req, res, next){
	// var sess = req.session;
	var obj = lt.getAjax(req, res);
	attention_model.get_allAttention_req({},function(obj1){
		var dh = "<style> table td,th { padding:16px 10px; } table tr:hover{background-color:yellow;} </style>"
			+"<img src='ico/back.png' width='80' style='margin-left:;cursor:pointer;position:absolute;' title='Volver' onclick='window.history.back()' ><br><br>"
			+"<div style='font-size:26px;padding:10px;text-align:center;'>Registros de Atenciones</div>"
			+"<table border=1 bgcolor=white cellspacing=0 style='border-color:#E3E3E3;' width='100%'>"
				+"<tr>"
					+"<th>Nro</th>"
					+"<th>DNI</th>"
					+"<th>Nombre y Apellidos</th>"
					+"<th>Edad</th>"
					+"<th>Motivo</th>"
					+"<th>Fecha</th>"
					+"<th>Hora</th>"
				+"</tr>";
		for( i in obj1 ){
			dh+="<tr title='Telefono: "+obj1[i].telefono+", Lugar: "+obj1[i].lugar+"'>"
				+"<td>"+(parseInt(i)+1)+"</td>"
				+"<td>"+obj1[i].dni+"</td>"
				+"<td>"+obj1[i].nombres+"</td>"
				+"<td>"+obj1[i].edad+"</td>"
				+"<td>"+obj1[i].motivo_name+"</td>"
				+"<td>"+obj1[i].fecha+"</td>"
				+"<td>"+obj1[i].hora+"</td>"
			+"</tr>"
		}
		dh+="</table>";
		// console.log(obj1);
		res.send(dh);
	});
	
}
exports.register_req = function(req, res, next){
	// var sess = req.session;
	// var obj = lt.getAjax(req,res);
	// console.log(obj);

	attention_model.register_req(req,function(obj1){
		// res.send(obj1);
		if( obj1.success == true ){
			res.locals.io.emit('attention', true);
			res.locals.io.emit('attention_sound', true);
			// res.send("<h2>Registrado con exito!</h2><br><a href='/register_attention'><button style='padding:10px;'>Volver a registrar</button></a>");
			// res.redirect('/attention_list');
			res.redirect('/'+req.session.rdr);			
		}
		else if( obj1.success == "true_muted" ){
			res.redirect('/'+req.session.rdr);
		}
	});
	
}
exports.getAll = function(req, res, next){
	// var sess = req.session;
	var obj = lt.getAjax(req, res);
	attention_model.getAllUser({},function(obj1){
		res.send(obj1);
	});
	
}
exports.get_attention = function(req, res, next){
	// var obj = lt.getAjax(req, res);
	attention_model.get_attention(req,function(obj1){
		res.send(obj1);
	});
}
exports.get_attention_public = function(req, res, next){
	// var obj = lt.getAjax(req, res);
	attention_model.get_attention_public(req,function(obj1){
		res.send(obj1);
	});
}
exports.next_at = function(req, res, next){
	
	attention_model.next_at(req, function(obj1){
		// res.send(obj1);
		res.locals.io.emit('attention', true);
		res.locals.io.emit('attention_sound2', true);
		// console.log("entro");
		res.send(obj1);
		// next();
	});
}
exports.attention_finish = function(req, res, next){
	
	attention_model.attention_finish(req, function(obj1){
		// res.send(obj1);
		

		if( obj1.success && obj1.reenvio ){
			res.locals.io.emit('attention', true);
			res.locals.io.emit('attention_sound', true);
			// console.log("reenviado con exito");
			obj1.msn = "Se reenvio con exito";
		}else{
			res.locals.io.emit('attention', true);
			obj1.msn = "Se registro atención con exito";
		}
		res.send(obj1);
	});
}