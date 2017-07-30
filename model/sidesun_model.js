var lt = require('../helper/luitor_helper.js');

db = lt.connection("pg");
db.on('error', function (err, client) { console.error('idle client error', err.message, err.stack) });
var thisAux = this;


exports.getAllCareer = function(req, res, next){
	var obj = lt.getAjax(req, res);
	// console.log(obj.query);
	// lt.return("result.rows", res, next);
	db.connect(function(err, client, done) {
		if(err) return console.error('error fetching client from pool', err);
		client.query(`SELECT * FROM sidesun.carrera as carr ORDER BY carr.name_car`
			, function(err, result) {
			done();
			// console.log("get institution names");
			if(err) return console.error('error running query', err);
			// if( result.rows > 0 )
				lt.return(result.rows, res, next);
			// else
			// 	lt.return("No hubo resultados que mostrar", res, next);				
		});

	});
}
exports.getAllInstitutionName = function(req, res, next){
	var obj = lt.getAjax(req, res);
	// console.log(obj.query);
	// lt.return("result.rows", res, next);
	db.connect(function(err, client, done) {
		if(err) return console.error('error fetching client from pool', err);
		client.query(`SELECT * FROM sidesun.institucion ORDER BY name_ins`
			, function(err, result) {
			done();
			// console.log("get institution names");
			if(err) return console.error('error running query', err);
			// if( result.rows > 0 )
				lt.return(result.rows, res, next);
			// else
			// 	lt.return("No hubo resultados que mostrar", res, next);				
		});

	});
}
exports.insertPromedio = function(req, res, next){
	var obj = lt.getAjax(req, res);
	// console.log(obj.query);
	// lt.return("result.rows", res, next);
	db.connect(function(err, client, done) {
		if(err) return console.error('error fetching client from pool', err);
		client.query(`INSERT INTO sidesun.promedio (anio_semestral,ciclo,promedio,id_becario,id_carrera,id_institucion)
			VALUES('${obj.anio_semestral}','${obj.ciclo}','${obj.promedio}','${obj.id_becario}','${obj.id_carrera}','${obj.id_institucion}')`
			, function(err, result) {
			done();

			if(err) return console.error('error running query', err);
			if( result.rowCount > 0 ){
				console.log("GUARDADO");				
			}else{
				
				console.log("ERROR AL GUARDAR");				
			}
				lt.return({
					success: result.rowCount
					,promedio: obj.promedio
				}, res, next);
		});

	});
}

exports.search = function(req, res, next){
	var obj = lt.getAjax(req, res);
	// console.log(obj.query);
	// lt.return("result.rows", res, next);
	db.connect(function(err, client, done) {
		if(err) return console.error('error fetching client from pool', err);
		client.query(req.q_sql
			, function(err, result) {
			done();

			if(err) return console.error('error running query', err);
			// if( result.rows > 0 )
				lt.return(result.rows, res, next);
			// else
			// 	lt.return("No hubo resultados que mostrar", res, next);				
		});

	});
}
exports.getnotasXcurso = function(req, res, next){
	var obj = lt.getAjax(req, res);
	// console.log(obj.query);
	// lt.return("result.rows", res, next);
	db.connect(function(err, client, done) {
		if(err) return console.error('error fetching client from pool', err);
		client.query(`SELECT * FROM sidesun.curso WHERE ciclo > 0 AND ciclo <= ${obj.ciclo}`
			, function(err, result) {
			done();

			if(err) return console.error('error running query', err);
			// if( result.rows > 0 )
				lt.return(result.rows, res, next);
			// else
			// 	lt.return("No hubo resultados que mostrar", res, next);				
		});

	});
}
exports.getCantnotasXcurso = function(req, res, next){
	var obj = lt.getAjax(req, res);
	// console.log(obj.query);
	// lt.return("result.rows", res, next);
	db.connect(function(err, client, done) {
		if(err) return console.error('error fetching client from pool', err);
		client.query(`SELECT id_promedio,id_becario,count(id_promedio) as cantidad FROM sidesun.curso WHERE ciclo > 0 AND ciclo <= ${obj.ciclo} GROUP BY  ciclo, id_becario,id_promedio`
			, function(err, result) {
			done();

			if(err) return console.error('error running query', err);
			// if( result.rows > 0 )
				lt.return(result.rows, res, next);
			// else
			// 	lt.return("No hubo resultados que mostrar", res, next);				
		});

	});
}
exports.saveCursoXaverage = function(req, res, next){
	var obj = lt.getAjax(req, res);
	// console.log(obj.query);
	// lt.return("result.rows", res, next);
	db.connect(function(err, client, done) {
		if(err) return console.error('error fetching client from pool', err);
		client.query(`INSERT INTO sidesun.curso (nombrecu,credito,nota,ciclo,id_becario,id_promedio)
			VALUES('${obj.curso}','${obj.credito}','${obj.nota}',${obj.ciclo},${obj.id_becario},'${obj.id_promedio}')`
			, function(err, result) {
			done();

			if(err) return console.error('error running query', err);
			if( result.rowCount > 0 ){
				console.log("GUARDADO");				
			}else{
				
				console.log("ERROR AL GUARDAR");				
			}
				lt.return({
					success: result.rowCount
					,id_promedio: obj.id_promedio
					,ciclo: obj.ciclo
					,nota: obj.nota
					,credito: obj.credito
					,curso: obj.curso
				}, res, next);
		});

	});
}
exports.setpagXbecario = function(req, res, next){
	var obj = lt.getAjax(req, res);
	// console.log(obj.query);
	// lt.return("result.rows", res, next);
	db.connect(function(err, client, done) {
		if(err) return console.error('error fetching client from pool', err);
		client.query(`UPDATE sidesun.promedio SET pag='${obj.pag}' WHERE id_promedio='${obj.id_promedio}'`
			, function(err, result) {
			done();

			if(err) return console.error('error running query', err);
			if( result.rowCount > 0 ){
				console.log("Pagina actualizada");				
			}else{
				
				console.log("ERROR AL GUARDAR");				
			}
				lt.return({
					success: result.rowCount
					,id_promedio: obj.id_promedio 
					,pag: obj.pag 
				}, res, next);
		});

	});
}
exports.setboletaXbecario = function(req, res, next){
	var obj = lt.getAjax(req, res);
	// console.log(obj.query);
	// lt.return("result.rows", res, next);
	db.connect(function(err, client, done) {
		if(err) return console.error('error fetching client from pool', err);
		client.query(`UPDATE sidesun.promedio SET boleta='${obj.boleta}' WHERE id_promedio='${obj.id_promedio}'`
			, function(err, result) {
			done();

			if(err) return console.error('error running query', err);
			if( result.rowCount > 0 ){
				console.log("Pagina actualizada");				
			}else{
				
				console.log("ERROR AL GUARDAR");				
			}
				lt.return({
					success: result.rowCount
					,id_promedio: obj.id_promedio 
					,boleta: obj.boleta 
				}, res, next);
		});

	});
}
exports.update_promedio = function(req, res, next){
	var obj = lt.getAjax(req, res);
	// console.log(obj.query);
	// lt.return("result.rows", res, next);
	db.connect(function(err, client, done) {
		if(err) return console.error('error fetching client from pool', err);
		client.query(`UPDATE sidesun.promedio SET promedio='${obj.promedio}' WHERE id_promedio='${obj.id_promedio}'`
			, function(err, result) {
			done();

			if(err) return console.error('error running query', err);
			if( result.rowCount > 0 ){
				console.log("Pagina actualizada");		
			}else{
				
				console.log("ERROR AL GUARDAR");			
			}
				lt.return({
					success: result.rowCount
				}, res, next);
		});

	});
}