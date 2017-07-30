btn = this
btn.sumar = ->
	num = extraer()
	r = num[0] + num[1]
	rsta(r)

btn.restar = ->
	num = extraer()
	r = num[0] - num[1]
	rsta(r)
btn.multiplicar = ->
	num = extraer()
	r = num[0] * num[1]
	rsta(r)


extraer = ->
	[
		$("#a").val()
		$("#b").val()
	]

rsta = (r) ->
	$("#rsta").html(r)

