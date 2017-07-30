var thisx = this;

//Config::::::
thisx.pais = "PERU";

thisx.changeDiff = 0;
	switch(thisx.pais){
		case 'PERU':
			thisx.changeDiff = 1;
			break;
		case 'CHILE':
			thisx.changeDiff = -1;
			break;
	}
//Finish-Config::::::

exports.return = function(req, res, next){
	if(next){
		res.send(req);
		next();
	}else{
		res(req);
	}
}
exports.return_json = function(req, res,next){
	if(next){
		res.send(req);
		next();
	}else{
		res(req);
	}
}
exports.getFechaStr = function(date){
	date.setHours(date.getHours() - thisx.changeDiff);
	date = date.getFullYear()
							+"-"+("0" + (parseInt(date.getMonth()) + 1)  ).slice(-2)
							+"-"+("0" + date.getDate()).slice(-2);
	return date;
}
exports.getTimeStr = function(date){
	
	date.setHours(date.getHours() - thisx.changeDiff);
	var Time = ("0" + (parseInt(date.getHours()) + 1)  ).slice(-2)
				+":"+("0" + (parseInt(date.getMinutes()) + 1)  ).slice(-2)
				+":"+("0" + date.getSeconds()).slice(-2);
	return Time;
}
exports.model = function(modelName){
	return require('../model/'+modelName+'_model.js');
}

exports.controller = function (controllerName){
    return require('../controller/'+controllerName+'.js');
}
exports.getAjax = function(req, res){
	var obj = {};
	// if( Object.size(req.body) > Object.size(req.query) ){
	// 	obj = req.body;
	// }else{
	// 	obj = req.query;
	// }
	// if(Object.size(obj) < Object.size(req) )
	// 	obj = req;
	obj = thisx.collect(req.body, req.query, req);
	return obj;
}
exports.collect = function() {
  var ret = {};
  var len = arguments.length;
  for (var i=0; i<len; i++) {
    for (p in arguments[i]) {
      if (arguments[i].hasOwnProperty(p)) {
        ret[p] = arguments[i][p];
      }
    }
  }
  return ret;
}
exports.connection = function(type) {
	switch(type){
		case 'pg':
			var pg = require('pg');
			var config = {
				user: 'postgres', //env var: PGUSER 
				database: 'sigesin', //env var: PGDATABASE 
				password: '*******', //env var: PGPASSWORD 
				host: '127.0.0.1', // Server hosting the postgres database 
				port: 5433, //env var: PGPORT 
				max: 50, // max number of clients in the pool 
				idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed 
			};
			var pool = new pg.Pool(config);
			return pool;
			break;
		case 'mysql':
			
			break;
	}
	
}
exports.getDateTime = function() {

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
Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};
