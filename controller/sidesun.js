var lt = require('../helper/luitor_helper.js');
var sidesun_model = lt.model('sidesun');

exports.search = function(req, res, next){
	var obj = lt.getAjax(req,res);
	var q_sql,q_sqlg;
	if( obj.active_only == "true" ){
		q_sqlg =` (bec.state='A' OR bec.state='AE') AND `;
	}else{
		q_sqlg = ``;
	}
	switch(obj.action){
		case 'notas_x_ciclo':
			q_sql = `SELECT pro.id_promedio,pro.boleta,pro.pag,ins.name_ins,bec.name_bec,bec.modalidad,bec.id_becario,pro.ciclo, pro.promedio, pro.anio_semestral
				FROM sidesun.institucion AS ins
				INNER JOIN sidesun.carrera AS car ON ins.id_institucion = car.id_institucion
				INNER JOIN sidesun.becario AS bec ON car.id_carrera = bec.id_carrera
				INNER JOIN sidesun.persona AS per ON bec.id_persona = per.id_persona
				INNER JOIN sidesun.promedio AS pro ON bec.id_becario = pro.id_becario
				WHERE ins.name_ins = '${obj.data.name_ins}' AND ins.sede = '${obj.data.sede}' AND bec.anio_convocatory = '${obj.data.anio_convocatory}' AND car.name_car = '${obj.data.name_car}'`;
			
			// console.log(q_sql);
			break;
		case 'select_ciclos':
			q_sql = `SELECT bec.id_carrera,car.id_institucion,bec.exp, bec.name_bec,bec.modalidad,ins.sede, bec.id_becario, ins.name_ins,bec.anio_convocatory,car.name_car,per.lastname_per||' '||per.name_per as nombresc,bec.state
					FROM sidesun.institucion AS ins
					INNER JOIN sidesun.carrera AS car ON ins.id_institucion = car.id_institucion
					INNER JOIN sidesun.becario AS bec ON car.id_carrera = bec.id_carrera
					INNER JOIN sidesun.persona AS per ON bec.id_persona = per.id_persona
					WHERE ${q_sqlg} ins.name_ins = '${obj.data.name_ins}' AND ins.sede = '${obj.data.sede}' AND bec.anio_convocatory = '${obj.data.anio_convocatory}' AND car.name_car = '${obj.data.name_car}' AND bec.modalidad ='${obj.data.modalidad}'`;
			console.log("SQL<<<<<<<<<<<<<<<<<<<<<<<<<");
			console.log(q_sql);
			break;
		case 'search_becario':
			var q_comp = "";
			try{
				if( obj.data.state ){
					q_comp = `bec.state ='${obj.data.state}' ORDER BY per.lastname_per ASC`
					// console.log("existe");
				}
			}catch(ex){
				// console.log("no existes");
				q_comp = `(TRANSLATE(per.name_per||' '||per.lastname_per,'ÁÉÍÓÚáéíóú','AEIOUaeiou') ILIKE '%${obj.word}%'OR split_part(per.name_per,' ',1)||' '||split_part(per.lastname_per,' ',1) ILIKE '%${obj.word}%' OR TRANSLATE(per.lastname_per||' '||per.name_per,'ÁÉÍÓÚáéíóú','AEIOUaeiou') ILIKE '%${obj.word}%' OR per.dni ILIKE '%${obj.word}%' OR TRANSLATE(ins.name_ins,'ÁÉÍÓÚáéíóú','AEIOUaeiou') ILIKE '%${obj.word}%' OR modalidad ILIKE '%${obj.word}%' )`;
			}
			q_sql = `SELECT bec.id_becario,per.id_persona,per.dni,per.name_per, per.lastname_per, bec.anio_convocatory,
					bec.modalidad,ins.name_ins,ins.sede, car.name_car,bec.state,bec.exp FROM sidesun.persona as per
					INNER JOIN sidesun.becario as bec ON per.id_persona = bec.id_persona
					INNER JOIN sidesun.institucion AS ins ON bec.id_institucion = ins.id_institucion
					INNER JOIN sidesun.carrera AS car ON bec.id_carrera = car.id_carrera
					WHERE ${q_sqlg} ${q_comp} `;
			// console.log(q_sql);
			
			break;
		case 'select_carrera':
			q_sql = `SELECT bec.name_bec,bec.modalidad,bec.id_becario, ins.name_ins,ins.sede, per.lastname_per||', '||per.name_per AS nombresc,bec.state, 
					bec.anio_convocatory, car.name_car, COUNT(pro.ciclo) AS cant_ciclo, 
					round( CAST((SUM(pro.promedio)/COUNT(pro.ciclo)) as numeric), 2) AS pro_global FROM sidesun.institucion AS ins
					INNER JOIN sidesun.becario AS bec ON ins.id_institucion = bec.id_institucion
					INNER JOIN sidesun.persona AS per ON bec.id_persona = per.id_persona
					INNER JOIN sidesun.carrera AS car ON bec.id_carrera = car.id_carrera
					INNER JOIN sidesun.promedio AS pro ON bec.id_becario = pro.id_becario
					WHERE ${q_sqlg} ins.name_ins = '${obj.data.name_ins}' AND bec.anio_convocatory = '${obj.data.anio_convocatory}' AND car.name_car = '${obj.data.name_car}'
					GROUP BY bec.id_becario,ins.name_ins, ins.sede, bec.anio_convocatory, per.name_per, per.lastname_per, bec.state, car.name_car
					ORDER BY nombresc ASC`;
			console.log(q_sql);
			break;
		case 'select_institution':
			q_sql = `SELECT bec.id_becario,bec.modalidad,ins.name_ins,ins.sede, per.lastname_per||', '||per.name_per AS nombresc,bec.state, 
					bec.anio_convocatory, car.name_car, COUNT(pro.ciclo) AS cant_ciclo, 
					round( CAST((SUM(pro.promedio)/COUNT(pro.ciclo)) as numeric), 2) AS pro_global FROM sidesun.institucion AS ins
					INNER JOIN sidesun.becario AS bec ON ins.id_institucion = bec.id_institucion
					INNER JOIN sidesun.persona AS per ON bec.id_persona = per.id_persona
					INNER JOIN sidesun.carrera AS car ON bec.id_carrera = car.id_carrera
					INNER JOIN sidesun.promedio AS pro ON bec.id_becario = pro.id_becario
					WHERE ${q_sqlg} ins.name_ins = '${obj.data.name_ins}' 
					GROUP BY bec.id_becario,ins.name_ins, ins.sede, bec.anio_convocatory, per.name_per, per.lastname_per, bec.state, car.name_car
					ORDER BY nombresc ASC`;
			break;
		case 'select_convocaroty':
			q_sql = `SELECT bec.id_becario,bec.modalidad,ins.name_ins,ins.sede, per.lastname_per||', '||per.name_per AS nombresc,bec.state, 
					bec.anio_convocatory, car.name_car, COUNT(pro.ciclo) AS cant_ciclo, 
					round( CAST((SUM(pro.promedio)/COUNT(pro.ciclo)) as numeric), 2) AS pro_global FROM sidesun.institucion AS ins
					INNER JOIN sidesun.becario AS bec ON ins.id_institucion = bec.id_institucion
					INNER JOIN sidesun.persona AS per ON bec.id_persona = per.id_persona
					INNER JOIN sidesun.carrera AS car ON bec.id_carrera = car.id_carrera
					LEFT JOIN sidesun.promedio AS pro ON bec.id_becario = pro.id_becario
					WHERE ${q_sqlg} bec.anio_convocatory = '${obj.data.anio_convocatory}' AND ins.name_ins='${obj.data.name_ins}'
					GROUP BY bec.id_becario,ins.name_ins, ins.sede, bec.anio_convocatory, per.name_per, per.lastname_per, bec.state, car.name_car
					ORDER BY nombresc ASC`;
			break;
		case 'select_institution_x_sede':
			var sql_inject = ``;
			if( obj.data.name_car ){
				sql_inject = ` AND car.name_car = '${obj.data.name_car}'`;
			}
			q_sql = `SELECT bec.modalidad,bec.id_becario,ins.name_ins,ins.sede,bec.exp, per.lastname_per||', '||per.name_per AS nombresc,bec.state, 
					bec.anio_convocatory, car.name_car, COUNT(pro.ciclo) AS cant_ciclo, 
					round( CAST((SUM(pro.promedio)/COUNT(pro.ciclo)) as numeric), 2) AS pro_global FROM sidesun.institucion AS ins
					INNER JOIN sidesun.becario AS bec ON ins.id_institucion = bec.id_institucion
					INNER JOIN sidesun.persona AS per ON bec.id_persona = per.id_persona
					INNER JOIN sidesun.carrera AS car ON bec.id_carrera = car.id_carrera
					INNER JOIN sidesun.promedio AS pro ON bec.id_becario = pro.id_becario
					WHERE ${q_sqlg} ins.name_ins = '${obj.data.name_ins}' AND ins.sede = '${obj.data.sede}' `+sql_inject+`
					GROUP BY bec.id_becario,ins.name_ins, ins.sede, bec.anio_convocatory, per.name_per, per.lastname_per, bec.state, car.name_car
					ORDER BY nombresc ASC`;
					// console.log(q_sql);
			break;
		case 'get_notas_x_carrera':
			q_sql = `SELECT bec.id_becario,ins.name_ins,bec.anio_convocatory,car.name_car,per.name_per,pro.ciclo, pro.promedio FROM sidesun.institucion AS ins
					INNER JOIN sidesun.carrera AS car ON ins.id_institucion = car.id_institucion
					INNER JOIN sidesun.becario AS bec ON car.id_carrera = bec.id_carrera
					INNER JOIN sidesun.persona AS per ON bec.id_persona = per.id_persona
					INNER JOIN sidesun.promedio AS pro ON bec.id_becario = pro.id_becario
					WHERE ${q_sqlg} ins.name_ins = '${obj.data.name_ins}' AND ins.sede = '${obj.data.sede}' AND bec.anio_convocatory = '${obj.data.anio_convocatory}'`;
			break;
		
	}
	sidesun_model.search({ q_sql: q_sql },function(obj1){
		// res.locals.io.emit
		// console.log(obj1);
		// var dir_name = "dafault";
		// switch(obj.action){
		// 	case 'search_becario':

		// 		dir_name = "search_register.csv";
		// 		break;
		// 	case 'select_institution':
		// 		dir_name = "register"+obj.data.name_ins+".csv";
		// 		break;
		// 	case 'select_carrera':
		// 		dir_name = "registro_"+obj.data.name_ins+"-"+obj.data.sede+"-"+obj.data.anio_convocatory+".csv";
		// 		break;
		// }
		// res.locals.csv
		// .writeToPath("doc/", dir_name, {
		// 	headers: true
		// }).on("finish", function(){
		// 	console.log("done!");
		// });
		// console.log("termino!!!");
		lt.return(obj1,res,next);
	});
}