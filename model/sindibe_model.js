var lt = require('../helper/luitor_helper.js');

db = lt.connection("pg");
db.on('error', function (err, client) { console.error('idle client error', err.message, err.stack) });

exports.deletepromedio = function(req, res, next){
	var id_promedio = req.body.id_promedio
	db.connect(function(err, client, done) {
		if(err) return console.error('error fetching client from pool', err);
		
		// client.query(`SELECT DISTINCT telefono FROM attention WHERE telefono != '' AND length(telefono) = 9`, function(err, result) {
		client.query(`DELETE FROM sidesun.promedio WHERE id_promedio = ${id_promedio}`, function(err, result) {
			//call `done()` to release the client back to the pool 
			done();

			if(err) return console.error('error running query', err);
			
			// console.log(result.rows);
			lt.return(result, res, next);
		});

	});
}
exports.getAllPhoneNumbers = function(req, res, next){
	var obj = lt.getAjax(req,res);
	db.connect(function(err, client, done) {
		if(err) return console.error('error fetching client from pool', err);
		
		// client.query(`SELECT DISTINCT telefono FROM attention WHERE telefono != '' AND length(telefono) = 9`, function(err, result) {
		client.query(`SELECT id_attention, dni, nombres, telefono, fecha FROM attention WHERE telefono != '' AND length(telefono) = 9 AND last1='t'`, function(err, result) {
			//call `done()` to release the client back to the pool 
			done();

			if(err) return console.error('error running query', err);
			
			// console.log(result.rows);
			lt.return(result.rows, res, next);
		});

	});
}
exports.client_search = function(req, res, next){
	var obj = lt.getAjax(req,res);
	db.connect(function(err, client, done) {
		if(err) return console.error('error fetching client from pool', err);
		
		// client.query(`SELECT DISTINCT telefono FROM attention WHERE telefono != '' AND length(telefono) = 9`, function(err, result) {
		client.query(`SELECT id_attention, dni, nombres, telefono, fecha FROM attention WHERE telefono != '' AND length(telefono) = 9 AND last1='t' AND (nombres ILIKE '%${obj.word}%' OR dni ILIKE '%${obj.word}%')`, function(err, result) {
			//call `done()` to release the client back to the pool 
			done();

			if(err) return console.error('error running query', err);
			
			// console.log(result.rows);
			lt.return(result.rows, res, next);
		});

	});
}