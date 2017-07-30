	// var lt_repit;
		function lt_floatwin(obj){

			var config = obj.config;

			var row = $("<div class='lt_content'>");
			//default
			if(!config.width || config.width == "" || config.width == 'auto' )
				config.width = "";
			if(!config.height || config.height == "" || config.height == 'auto' )
				config.height = "";
			if(!config.bgcolor || config.bgcolor == "" || config.bgcolor == 'auto' )
				config.bgcolor = "white";
			if(!config.color || config.color == "" || config.color == 'auto' )
				config.color = "black";
			if(!config.test || config.test == "" || config.test == 'auto' )
				config.test = "none";
			if(!config.title || config.title == "" || config.title == 'auto' )
				config.title = "";
			if(!config.colorclick || config.colorclick == "" || config.colorclick == 'auto' )
				config.colorclick = "#AAFC6E";
			//********
			var styleStr = "";
			//modifig base_content css
			
			if( config.style ){
				styleStr = "position:absolute;z-index:50;"
				styleStr+=config.style;
				$("#"+obj.id).attr('style',styleStr);
			}else{
				var show = "none"; // false
				if( config.test == true )
					show = ""; // true
				$("#"+obj.id).css({
					"position":"absolute"
					,"display": show
					,"width": config.width
					,"height": config.height
					,"background-color": config.bgcolor
					,"box-shadow":"3px 3px 14px #888"
					,"z-index":"1070"
					,"line-height": "1.4"
					,"color": config.color
				});	
			}
			//modifig content css
			row.html(obj.html).css({
				"padding":"10px"
			});
			// row.appendTo("#"+obj.id);
			$("#"+obj.id).html( row );

			var objclick = $("#"+obj.id).attr('setclick');

			$(objclick).click(function(e){


				e.stopPropagation();
				
				if( $(this).find(".lt_content").length )
					return;
				
				$("."+obj.id).remove();


				var p = $( this );
				var y = p.position().top;
				var x = p.position().left;
				// $("#"+obj.id).appendTo(this);
				$( this ).append("<div class="+obj.id+">"
					+"<div style='background-color:#F1F1F1;' align='left'><span onclick=\"event.stopPropagation();$('."+obj.id+"').remove();$('.viewselect_hover').remove();\" style='color:red;cursor:pointer;'>X</span> &nbsp;&nbsp;&nbsp;<span class='title'>"+config.title+"</span></div>"
					+$("#"+obj.id).html() +"</div>");
				$(objclick).css({"background-color":""});
				$( this ).css({"background-color":config.colorclick});

				// $("#"+obj.id).css({"top":y+"px","left":(x+35)+"px"});
				$("."+obj.id).css({"margin-left":"20px","padding":"0 5px"});

				$("."+obj.id).css({
					"position":"absolute"
					// ,"display":"none"
					,"width": config.width
					,"height": config.height
					,"background-color": config.bgcolor
					,"box-shadow":"3px 3px 14px #888"
					,"z-index":"1070"
					,"line-height": "1.4"
					,"color": config.color
				});	
				// $('.floatbase').click(function(){
				// 	console.log("es el mismo");
				// });
				lt_floatwindow_click(this);
			});
			$("#"+obj.id).click(function(e){
				e.stopPropagation();
			});

			$(objclick).hover(function() {
				
			  // $( this ).prepend( "<div style='font-size:20px;z-index:100;text-align:center;border-color:10px;text-shadow:0px 0px 5px white;color:blue;cursor:pointer;margin-top:-6px;position:absolute' class='viewselect_hover'>+</div>" );
			  $( this ).css({"background":config.colorclick});
			}, function() {
			  // $( this ).find( "div:last" ).remove();
			  // $( this ).find( ".viewselect_hover" ).remove();
			  $( this ).css({"background":""});
			});
			$(window).click(function(){
				
				// $("#"+obj.id).hide();
				// alert(obj.id);
				$("."+obj.id).remove();
				$(objclick).css({"background-color":""});
			});
		}