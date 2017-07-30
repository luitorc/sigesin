var lt = require('../helper/luitor_helper.js');

db = lt.connection("pg");
db.on('error', function (err, client) { console.error('idle client error', err.message, err.stack) });
var thisAux = this;

exports.msn_waiting = function(req, res, next){
	var obj = lt.getAjax(req, res);
	db.connect(function(err, client, done) {
		if(err) return console.error('error fetching client from pool', err);
		// INSERT INTO msn (text1,src)VALUES('Hola como estas','img1.jpg')
		// INSERT INTO usuario_msn(date1, time1,user_emit, user_recept, id_msn)VALUES('09-02-2017','09:04',6,1,1)
		// client.query(`SELECT count(*) FROM usuario_msn WHERE user_recept = ${obj.id_usuario} AND viewed = 'f'`
		client.query(`SELECT count(*) FROM usuario_msn WHERE user_recept = ${obj.id_usuario} AND user_emit != '${obj.user_emit}' AND viewed = 'f'`
			, function(err, result) {

			done();

			if(err) return console.error('error running query', err);
			lt.return(result.rows, res, next);

		});

	});
}
exports.send_msn = function(req, res, next){
var obj = lt.getAjax(req, res);
// console.log(req.body);
	db.connect(function(err, client, done) {
		if(err) return console.error('error fetching client from pool', err);
		// INSERT INTO msn (text1,src)VALUES('Hola como estas','img1.jpg')
		// INSERT INTO usuario_msn(date1, time1,user_emit, user_recept, id_msn)VALUES('09-02-2017','09:04',6,1,1)
		client.query(`INSERT INTO msn (text1, src)
			VALUES('${obj.text1}','${obj.src}') RETURNING id_msn`
			, function(err, result) {

			done();

			if(err) return console.error('error running query', err);
			var id_msn = result.rows[0].id_msn;
			 var fh = lt.getDateTime();
			// lt.return(result.rows, res, next);
			client.query(`INSERT INTO usuario_msn(date1, time1,user_emit, user_recept, id_msn)
				VALUES('${fh.date}', '${fh.time}',${obj.user_emit},${obj.user_recept},${id_msn}) RETURNING id_usuario_msn`
				, function(err, result) {
				done();

				if(err) return console.error('error running query', err);

				lt.return(result.rows, res, next);
			});

		});

	});
}
exports.min_msnXuser = function(req, res, next){
var obj = lt.getAjax(req, res);
	db.connect(function(err, client, done) {
		if(err) return console.error('error fetching client from pool', err);
		// INSERT INTO msn (text1,src)VALUES('Hola como estas','img1.jpg')
		// INSERT INTO usuario_msn(date1, time1,user_emit, user_recept, id_msn)VALUES('09-02-2017','09:04',6,1,1)
		client.query(`SELECT * FROM usuario_msn AS umsn
			INNER JOIN msn ON umsn.id_msn = msn.id_msn
			WHERE umsn.user_recept = ${obj.user_recept} AND umsn.user_emit = ${obj.user_emit}
			OR umsn.user_recept = ${obj.user_emit} AND umsn.user_emit = ${obj.user_recept}
			 ORDER BY umsn.id_usuario_msn ASC`
			, function(err, result) {

			done();

			if(err) return console.error('error running query', err);
			lt.return(result.rows, res, next);
		});

	});
}
exports.get_viewed = function(req, res, next){
var obj = lt.getAjax(req, res);
	db.connect(function(err, client, done) {
		if(err) return console.error('error fetching client from pool', err);
		// INSERT INTO msn (text1,src)VALUES('Hola como estas','img1.jpg')
		// INSERT INTO usuario_msn(date1, time1,user_emit, user_recept, id_msn)VALUES('09-02-2017','09:04',6,1,1)
		client.query(`SELECT date_viewed, time_viewed, viewed FROM usuario_msn 
			WHERE user_recept='${obj.id_user}' AND user_emit='${obj.id_usuario}' ORDER BY id_usuario_msn DESC LIMIT 1`
			, function(err, result) {

			done();

			if(err) return console.error('error running query', err);
			lt.return(result.rows, res, next);
		});

	});
}
exports.cantmsn_forme = function(req, res, next){
var obj = lt.getAjax(req, res);
	db.connect(function(err, client, done) {
		if(err) return console.error('error fetching client from pool', err);
		// INSERT INTO msn (text1,src)VALUES('Hola como estas','img1.jpg')
		// INSERT INTO usuario_msn(date1, time1,user_emit, user_recept, id_msn)VALUES('09-02-2017','09:04',6,1,1)
		client.query(`SELECT user_emit,count(*) FROM usuario_msn 
			WHERE user_recept='${obj.id_usuario}' AND viewed='f' GROUP BY user_emit`
			, function(err, result) {

			done();

			if(err) return console.error('error running query', err);
			lt.return(result.rows, res, next);
		});

	});
}
exports.viewed = function(req, res, next){
var obj = lt.getAjax(req, res);
	db.connect(function(err, client, done) {
		if(err) return console.error('error fetching client from pool', err);

		client.query(`SELECT date_viewed, time_viewed, viewed FROM usuario_msn 
			WHERE user_recept='${obj.id_usuario}' AND user_emit='${obj.id_user}' ORDER BY id_usuario_msn DESC LIMIT 1`
			, function(err, result) {

			done();

			if(err) return console.error('error running query', err);
			if( result.rows.length > 0 ){
				if( result.rows[0].viewed == false ){

					var fh = lt.getDateTime();
					client.query(`UPDATE usuario_msn SET viewed='t', date_viewed='${fh.date}',time_viewed='${fh.time}' WHERE user_emit='${obj.id_user}' AND user_recept='${obj.id_usuario}'`
						, function(err, result) {

						done();

						if(err) return console.error('error running query', err);
						lt.return(result.rows, res, next);
					});
				}else{
					lt.return([], res, next);
				}
			}else{
				lt.return([], res, next);
			}
		});

	});
}