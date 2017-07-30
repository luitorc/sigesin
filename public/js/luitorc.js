//Libreria luitor
//auto: Luis Torres Carpio
//luitorc@gmail.com
//2016 enero 06

var luitor = function(){

	// this.base_url = "http://localhost:1800/postgresql/centroproduccionunam/";
	this.get_url = function(){
		// alert("entro");
		var params = {};
	    if (location.search) {
	        var parts = location.search.substring(1).split('&');
	    
	        for (var i = 0; i < parts.length; i++) {
	            var nv = parts[i].split('=');
	            if (!nv[0]) continue;
	            params[nv[0]] = nv[1] || true;
	        }
	        return params;
	    }else{
	    	return false;
	    }

	}
	this.fileTob64 = function(idFile, callback1) {
	  	var input = document.getElementById(idFile);
	    var fReader = new FileReader();
	    fReader.readAsDataURL(input.files[0]);
	    fReader.onloadend = function(event){
	      var fileBase64 = event.target.result.split(',');	
	      var info = fileBase64[0];	
	      var data64 = fileBase64[1];	

	      callback1(info, data64);
	    }
	}
	this.post = function(nameController, obj ,callback1){
		var thisAux = this;
		nameController = nameController.split('@');
		obj.btn = nameController[1];

		var jqXHR = $.ajax({
			async: false,
			type: 'POST',
			url: thisAux.base_url+'controller/'+nameController[0]+'Controller.php',
			data: "datos="+JSON.stringify(obj)
		});
		callback1( $.parseJSON(jqXHR.responseText) );
	}
	this.popup = function(url, title, w, h) {
	    // Fixes dual-screen position                         Most browsers      Firefox
	    var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
	    var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;

	    var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
	    var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

	    var left = ((width / 2) - (w / 2)) + dualScreenLeft;
	    var top = ((height / 2) - (h / 2)) + dualScreenTop;
	    var newWindow = window.open(url, title, 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);

	    // Puts focus on the newWindow
	    if (window.focus) {
	        newWindow.focus();
	    }
	    return newWindow;
	}
	this.getFechaStr = function(date){
		date = date.getFullYear()
								+"-"+("0" + (parseInt(date.getMonth()) + 1)  ).slice(-2)
								+"-"+("0" + date.getDate()).slice(-2);
		return date;
	}
	this.sumarFechaMin = function( date, hora, min){
		var fecha = new Date(date+" "+hora+" GMT-0500");
		var newFecha = fecha.setMinutes(min);
		return newFecha;
	}
	this.addTime = function( time, timeAdd ){
		var timeAdd = timeAdd.split(':');
		if( timeAdd[2] == "" )
			timeAdd[2] = '00';
		var fecha = new Date("2016-04-22 "+time+" GMT-0500");
		// alert(timeAdd[1]);
		fecha.setHours( fecha.getHours() + parseInt( timeAdd[0]) );
		fecha.setMinutes( fecha.getMinutes() + parseInt( timeAdd[1]) );
		fecha.setSeconds( fecha.getSeconds() + parseInt( timeAdd[2]) );
		hor = fecha.getHours();
		min = fecha.getMinutes();
		sec = fecha.getSeconds();
		if(fecha.getHours() < 10)
			hor = "0"+fecha.getHours();
		if(fecha.getMinutes() < 10)
			min = "0"+fecha.getMinutes();
		if(fecha.getSeconds() < 10)
			sec = "0"+fecha.getSeconds();

		var time = hor+":"+min+":"+sec;
		return time;
	}
	
	this.cargando = "<img src='../public/img/cargando.gif'>";

};
window.$l = new luitor();