var lt = require('../helper/luitor_helper.js');

db = lt.connection("pg");
db.on('error', function (err, client) { console.error('idle client error', err.message, err.stack) });

exports.access = function(req, res, next){
var obj = lt.getAjax(req, res);
// console.log(obj.password);
	db.connect(function(err, client, done) {
		if(err) return console.error('error fetching client from pool', err);
		
		client.query(`SELECT * FROM usuario WHERE usuario_name='${obj.usuario_name}' and password = '${obj.password}'`, function(err, result) {
			//call `done()` to release the client back to the pool 
			done();

			if(err) return console.error('error running query', err);
			
			// res.send("jaja");
			// return;
			lt.return(result.rows, res, next);

		});

	});
}
exports.user_list = function(req, res, next){

	db.connect(function(err, client, done) {
		if(err) return console.error('error fetching client from pool', err);
		
		client.query(`SELECT id_usuario, usuario_name,chat_theme, area FROM usuario ORDER BY usuario_name ASC`, function(err, result) {
			//call `done()` to release the client back to the pool 
			done();

			if(err) return console.error('error running query', err);
			
			lt.return(result.rows, res, next);

		});

	});
}
exports.user_allData = function(req, res, next){
	var obj = lt.getAjax(req,res);
	// console.log(obj.id_user);
	db.connect(function(err, client, done) {
		if(err) return console.error('error fetching client from pool', err);
		
		client.query(`SELECT * FROM usuario AS usur 
					INNER JOIN dato_personal AS dper ON usur.id_usuario = dper.id_usuario
					WHERE usur.id_usuario = ${obj.id_usuario}`, function(err, result) {
			//call `done()` to release the client back to the pool 
			done();

			if(err) return console.error('error running query', err);
			
			lt.return(result.rows, res, next);

		});

	});
}
