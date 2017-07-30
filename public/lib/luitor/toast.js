
function lt_toast(obj){
	// console.log( $(this).attr("class") );
	// return;
	var row = $("<div class='lt_base'>"
				+"<div class='lt_toast_msn'>");

	row.css({
			"background-color":""
			,"position":"fixed"
			,"bottom":" 80px"
			,"width":"100%"
			,"text-align":"center"
			,"display":"none"
			,"z-index":" 1070"
		});
	row.find('.lt_toast_msn').css({
		"background-color":"rgba(48, 44, 44, 0.8)"
		,"color":"white"
		,"border-radius":"30px"
		// ,"margin":"auto"
		,"padding":"10px"
		,"display":"inline-block"
		,"font-style":" oblique"
		,"box-shadow":" 0px 0px 20px #444"

	});
	row.appendTo(obj);
}
var timeout;
function toast(msn, time){
	
	if( $('.lt_base').length < 1 ){
		alert("Porfavor inicialize lt_toast");
		return;
	}
	clearTimeout(timeout);
	$(".lt_base").stop( true, true ).fadeIn(1000);
	if( time == undefined)
		time = 3; //seconds

	time*=1000;
	$(".lt_toast_msn").html(msn);
	
	timeout = setTimeout(function(){
		$(".lt_base").stop( true, true ).fadeOut(2000);
	},time);
}