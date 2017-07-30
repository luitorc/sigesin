// SELECT id_attention, dni, nombres, telefono, fecha FROM attention WHERE last1='t' ORDER BY id_attention DESC
var lt = require('../helper/luitor_helper.js');
var sindibe_model = lt.model('sindibe');


exports.getAllPhoneNumbers = function(req, res, next){
	// var sess = req.session;
	var obj = lt.getAjax(req,res);
	// console.log(obj);

	sindibe_model.getAllPhoneNumbers(req,function(obj1){
		console.log(obj1);
		if( 'rmt' in obj ){
			res.send(JSON.stringify(obj1));return;
		}
		res.send(obj1);
	});
	
}