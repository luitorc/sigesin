var lt = require('../helper/luitor_helper.js');

db = lt.connection("pg");
db.on('error', function (err, client) { console.error('idle client error', err.message, err.stack) });


exports.graphic = function(req, res, next){
	var obj = lt.getAjax(req,res);
	db.connect(function(err, client, done) {
		var sql;
		if(err) return console.error('error fetching client from pool', err);

		if( obj.categoria == 'VISITA' ){
			//vista de por año
			sql = `SELECT to_char(fecha, 'YYYY-MM') as fecha1, COUNT(*) as cant FROM attention WHERE to_char(fecha, 'YYYY-MM') LIKE '%${obj.anio}%' GROUP BY to_char(fecha, 'YYYY-MM') ORDER BY fecha1`;
		}
		if( obj.categoria == 'EDAD' ){
			//edad por mes
			sql = `SELECT edad, COUNT(*) as cant FROM attention WHERE to_char(fecha, 'YYYY-MM') = '${obj.anio}-${obj.mes}' AND ingreso = true GROUP BY edad ORDER BY edad `;
		}
		if( obj.categoria == 'LUGAR' ){
			//Lugar por mes 
			sql = `SELECT upper(lugar) as lugar1, COUNT(*) as cant FROM attention WHERE to_char(fecha, 'YYYY-MM') = '${obj.anio}-${obj.mes}' AND ingreso = true GROUP BY upper(lugar) `;
		}
		if( obj.categoria == 'IDENTIDAD' ){
			//IDENTIDAD
			sql = `SELECT upper(identidad) as identidad, COUNT(*) as cant FROM attention WHERE to_char(fecha, 'YYYY-MM') = '${obj.anio}-${obj.mes}' AND ingreso = true GROUP BY upper(identidad) `;
		}
		if( obj.categoria == 'BECA DE INTERES' ){
			//BECA DE INTERES POR MES
			sql = `SELECT upper(aspira_beca) as aspira_beca, COUNT(*) as cant FROM attention WHERE to_char(fecha, 'YYYY-MM') = '${obj.anio}-${obj.mes}' AND ingreso = true GROUP BY upper(aspira_beca) `;
		}
		if( obj.categoria == 'GENERO' ){
			//BECA DE INTERES POR MES
			sql = `SELECT sexo, COUNT(*) as cant FROM attention WHERE to_char(fecha, 'YYYY-MM') = '${obj.anio}-${obj.mes}' AND ingreso = true  GROUP BY sexo`;
		}
		console.log(sql);
		client.query(sql, function(err, result) {
			//call `done()` to release the client back to the pool 
			done();

			if(err) return console.error('error running query', err);
			
			lt.return(result.rows, res, next);
			console.log(result.rows);
		});

	});
}
exports.attention_before = function(req, res, next){
	var obj = lt.getAjax(req,res);
	db.connect(function(err, client, done) {
		if(err) return console.error('error fetching client from pool', err);
		
		client.query(`SELECT * FROM attention WHERE dni='${obj.dni}' AND id_usuario NOTNULL ORDER BY id_attention DESC LIMIT 2`, function(err, result) {
			//call `done()` to release the client back to the pool 
			done();

			if(err) return console.error('error running query', err);
			
			lt.return(result.rows, res, next);
			console.log(result.rows);
		});

	});
}
exports.viewShipments = function(req, res, next){
	var obj = lt.getAjax(req,res);
	db.connect(function(err, client, done) {
		if(err) return console.error('error fetching client from pool', err);
		
		client.query(`SELECT * FROM shipments ORDER BY id_shipments DESC`, function(err, result) {
			//call `done()` to release the client back to the pool 
			done();

			if(err) return console.error('error running query', err);
			
			lt.return(result.rows, res, next);
		});

	});
}
exports.checkShipments = function(req, res, next){
	var obj = lt.getAjax(req,res);
	db.connect(function(err, client, done) {
		if(err) return console.error('error fetching client from pool', err);
		
		client.query(`SELECT * FROM shipments WHERE dni='${obj.dni}' ORDER BY id_shipments DESC LIMIT 1`, function(err, result) {
			//call `done()` to release the client back to the pool 
			done();

			if(err) return console.error('error running query', err);
			
			// console.log(result.rows[0].login);
			// console.log(result.rowCount); // Cantidad de registros
			// var obj = result.rows;
			// console.log(result);
			lt.return(result.rows, res, next);
			// console.log(obj.dni);
			// lt.return(result.rowCount);
		});

	});
}
exports.saveShipping = function(req, res, next){
	var obj = lt.getAjax(req,res);
	db.connect(function(err, client, done) {
		fh = getDateTime();

		if(err) return console.error('error fetching client from pool', err);
		
		client.query(`INSERT INTO shipments (dni, nombres, phone_ref, name_inst, code, time1, date1, affair, place, addressed) 
			VALUES('${obj.dni}','${obj.nombres}','${obj.phone_ref}','${obj.name_inst}','${obj.code}','${fh.time}','${fh.date}','${obj.affair}','${obj.place}','${obj.addressed}')`
			, function(err, result) {
			//call `done()` to release the client back to the pool 
			done();

			if(err) return console.error('error running query', err);
			
			if( result.rowCount ){
				// req.session.usuario = 0;
				lt.return({ success: true }, res, next);
			}
			else
				lt.return({ success: false }, res, next);
		});

	});
}
exports.checkAttention = function(req, res, next){
	var obj = lt.getAjax(req,res);
	db.connect(function(err, client, done) {
		if(err) return console.error('error fetching client from pool', err);
		var search_criteria = "";
		if( obj.id_attention != undefined )
			search_criteria = `id_attention='${obj.id_attention}'`;
		else
			search_criteria = `dni='${obj.dni}'`;
		// console.log(">>"+search_criteria);
		// console.log(search_criteria);
		client.query(`SELECT * FROM attention WHERE ${search_criteria} ORDER BY id_attention DESC LIMIT 1`, function(err, result) {
			//call `done()` to release the client back to the pool 
			done();

			if(err) return console.error('error running query', err);
			
			// console.log(result.rows[0].login);
			// console.log(result.rowCount); // Cantidad de registros
			// var obj = result.rows;
			// console.log(result);
			lt.return(result.rows, res, next);
			// console.log(obj.dni);
			// lt.return(result.rowCount);
		});

	});
}
exports.get_allAttention_req = function(req, res, next){
	var obj = lt.getAjax(req,res);
	var concat = "";
	if( obj.action == 'search' )
		concat+=`AND nombres ILIKE '%${obj.word}%' OR dni LIKE '%${obj.word}%'`;

	db.connect(function(err, client, done) {
		if(err) return console.error('error fetching client from pool', err);
		
		client.query(`SELECT id_attention, nombres, edad, telefono, motivo_name, dni, to_char(fecha, 'DD/MM/YYYY') as fecha, hora, lugar 
			FROM attention WHERE ingreso='t' `+concat+` ORDER BY id_attention DESC`, function(err, result) {
			//call `done()` to release the client back to the pool 
			done();

			if(err) return console.error('error running query', err);
			
			// console.log(result.rows[0].login);
			// console.log(result.rowCount); // Cantidad de registros
			// var obj = result.rows;
			// console.log(result);
			lt.return(result.rows, res, next);
			// console.log(result.rowCount);
			// lt.return(result.rowCount);
		});

	});
}

exports.register_req = function(req, res, next){
	var obj = lt.getAjax(req,res);
	db.connect(function(err, client, done) {
		fh = getDateTime();
		// console.log(fh);
		if(err) return console.error('error fetching client from pool', err);
		
		// var ss = `INSERT INTO attention (nombres, dni, telefono, edad, identidad, aspira_beca, motivo, asunto, type)`
		// 	+` VALUES('${obj.nombres}','${obj.dni}','${obj.telefono}','${obj.edad}','${obj.identidad}','${obj.aspira_beca}','${obj.motivo}','${obj.asunto}','${obj.type}')`;
		// 	console.log(ss);
		client.query(`UPDATE attention SET last1='f' WHERE dni = '${obj.dni}'`
			, function(err, result) {
			//call `done()` to release the client back to the pool 
			done();

			if(err) return console.error('error running query', err);
			
			var true1 = true;
			var false1 = false;
			// if( result.rowCount ){
				// req.session.usuario = 0;
				// lt.return({ success: true }, res, next);
				if( obj.attention_phone == "true" ){
					true1 = "true_muted"; // registro correcto sin emitir ruido
					false1 = true; //archivar attención

					//campo new 
					campo_ext = `,resumen, observacion`;
					campo_ext_value = `,'${obj.resumen1}','${obj.observacion1}'`;
				}else{
					campo_ext = '';
					campo_ext_value = '';
					console.log("se guardara como telefono");
				}
				query = `INSERT INTO attention (nombres, dni, telefono, edad, identidad, aspira_beca, motivo, type, fecha, hora, lugar, motivo_name,correo,archivado ${campo_ext},attention_phone,identity_description,sexo)`
					+` VALUES('${obj.nombres}','${obj.dni}','${obj.telefono}','${obj.edad}','${obj.identidad}','${obj.aspira_beca}','${obj.motivo}','${obj.type}','${fh.date}','${fh.time}','${obj.lugar}','${obj.motivo_name}','${obj.correo}',${false1} ${campo_ext_value},'${obj.attention_phone}','${obj.identity_description}','${obj.sexo}')`;
				console.log(query);
				client.query( query
					, function(err, result) {
					//call `done()` to release the client back to the pool 
					done();

					if(err) return console.error('error running query', err);
					
					
					// console.log(result.rows[0].login);
					// console.log(result.rowCount); // Cantidad de registros
					// var obj = result.rows;
					// console.log(result);
					if( result.rowCount ){
						// req.session.usuario = 0;
						lt.return({ success: true1 }, res, next);
					}
					else
						lt.return({ success: false }, res, next);
					// console.log(result.rowCount);
					// lt.return(result.rowCount);
				});
			// }
			// else
				// lt.return({ success: false }, res, next);
			// console.log(result.rowCount);
			// lt.return(result.rowCount);
		});

		

	});
	
}
function getDateTime() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return {date:year+"/"+month+"/"+day, time:hour+":"+min+":"+sec};

}

exports.next_at = function(req, res, next){
	var obj = lt.getAjax(req,res);
	db.connect(function(err, client, done) {
		if(err) return console.error('error fetching client from pool', err);
		
		client.query(`UPDATE attention SET usuario_name='${obj.usuario_name}' WHERE id_attention = ${obj.id_attention}`, function(err, result) {
			//call `done()` to release the client back to the pool 
			done();

			if(err) return console.error('error running query', err);
			
			// console.log(result.rows[0].login);
			// console.log(result.rowCount); // Cantidad de registros
			// var obj = result.rows;
			// console.log(result);
			if( result.rowCount )
				lt.return({ success: true }, res, next);
			else
				lt.return({ success: false }, res, next);
			// console.log(result.rowCount);
			// lt.return(result.rowCount);
		});

	});
}

exports.getAllUser = function(req, res, next){

	db.connect(function(err, client, done) {
		if(err) return console.error('error fetching client from pool', err);
		
		client.query('SELECT * FROM usuario', function(err, result) {
			//call `done()` to release the client back to the pool 
			done();

			if(err) return console.error('error running query', err);
			
			// console.log(result.rows[0].login);
			// console.log(result.rowCount); // Cantidad de registros
			// var obj = result.rows;
			// console.log(result);
			lt.return(result, res, next);
			// lt.return(result);
		});

	});
}
exports.get_attention = function(req, res, next){

	db.connect(function(err, client, done) {
		if(err) return console.error('error fetching client from pool', err);
		
		client.query(`SELECT * FROM attention WHERE archivado = 'f' ORDER BY id_attention ASC`, function(err, result) {
			//call `done()` to release the client back to the pool 
			done();

			if(err) return console.error('error running query', err);
			
			// console.log(result.rows[0].login);
			// console.log(result.rowCount); // Cantidad de registros
			// var obj = result.rows;
			// console.log(result);
			lt.return(result.rows, res, next);
			// lt.return(result);
		});

	});
}
exports.get_attention_public = function(req, res, next){

	db.connect(function(err, client, done) {
		if(err) return console.error('error fetching client from pool', err);
		
		client.query(`SELECT (nombres) FROM attention WHERE archivado = 'f' ORDER BY id_attention ASC`, function(err, result) {
			//call `done()` to release the client back to the pool 
			done();

			if(err) return console.error('error running query', err);
			
			// console.log(result.rows[0].login);
			// console.log(result.rowCount); // Cantidad de registros
			// var obj = result.rows;
			// console.log(result);
			lt.return(result.rows, res, next);
			// lt.return(result);
		});

	});
}
exports.next_at = function(req, res, next){
	var obj = lt.getAjax(req,res);
	db.connect(function(err, client, done) {
		if(err) return console.error('error fetching client from pool', err);
		
		client.query(`UPDATE attention SET select1='t',id_usuario='${obj.id_usuario}', usuario_name='${obj.usuario_name}' WHERE id_attention = ${obj.id_attention}`, function(err, result) {
			//call `done()` to release the client back to the pool 
			done();

			if(err) return console.error('error running query', err);
			
			// console.log(result.rows[0].login);
			// console.log(result.rowCount); // Cantidad de registros
			// var obj = result.rows;
			// console.log(result);
			if( result.rowCount )
				lt.return({ success: true }, res, next);
			else
				lt.return({ success: false }, res, next);
			// console.log(result.rowCount);
			// lt.return(result.rowCount);
		});

	});
}
exports.attention_finish = function(req, res, next){
	var obj = lt.getAjax(req,res);

	db.connect(function(err, client, done) {
		if(err) return console.error('error fetching client from pool', err);
			// obj.reenviar = Boolean(obj.reenviar);
			if(obj.reenviar == 'on')
				obj.reenviar = true;
			else
				obj.reenviar = false;

			console.log("entro a consulta");
			console.log("renviar es: "+obj.reenviar);
			client.query(`UPDATE attention SET archivado='t',observacion='${obj.observacion}', resumen='${obj.resumen}',ingreso='${obj.ingreso}' WHERE id_attention = ${obj.id_attention}`, function(err, result) {
				//call `done()` to release the client back to the pool 
				done();

				if(err) return console.error('error running query', err);
				
				// console.log(result.rows[0].login);
				// console.log(result.rowCount); // Cantidad de registros
				// var obj = result.rows;
				// console.log(result);
				if( result.rowCount ){
					// req.session.usuario = 0;
					if( !obj.reenviar )
					lt.return({ success: true }, res, next);
				}
				else{
					if( !obj.reenviar )
					lt.return({ success: false }, res, next);
				}
				// console.log(result.rowCount);
				// lt.return(result.rowCount);
			});

		if( obj.reenviar ){
			console.log("entro: "+obj.dni);
			client.query(`UPDATE attention SET last1='f' WHERE dni = '${obj.dni}'`
				, function(err, result) {
				//call `done()` to release the client back to the pool 
				done();

				if(err) return console.error('error running query', err);

		
				console.log("entro a reenvio");
				client.query(`INSERT INTO attention (nombres, dni, telefono, edad, identidad, aspira_beca, motivo, type, fecha, hora, lugar, motivo_name, reenvio_user,correo,identity_description,sexo)`
					+` SELECT nombres, dni, telefono, edad, identidad, aspira_beca, motivo, 2, fecha, hora, lugar, motivo_name, '${obj.reenvio_user}',correo,identity_description,sexo FROM attention WHERE id_attention = ${obj.id_attention}`, function(err, result) {
				//call `done()` to release the client back to the pool 
					done();

					if(err) return console.error('error running query', err);
					
					// console.log(result.rows[0].login);
					// console.log(result.rowCount); // Cantidad de registros
					// var obj = result.rows;
					// console.log(result);
					

					if( result.rowCount ){
						// req.session.usuario = 0;
						lt.return({ success: true, reenvio: true }, res, next);
					}
					else
						lt.return({ success: false }, res, next);
					// console.log(result.rowCount);
					// lt.return(result.rowCount);
				});
			});
		}

	});
}
