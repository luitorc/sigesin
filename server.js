
process.env.TZ = "America/New_York";
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
var lt = require('./helper/luitor_helper.js');

var PORT = 3000;
var colors = require('colors');
var open = require('open');
var bodyParser = require('body-parser');

var csv = require("fast-csv");

var express  = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var app = express();
var path = require('path');
var cons= require('consolidate');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var route = require('./routes');
var engine = require('ejs-mate');
app.engine('html', engine);
app.set('view engine', 'html');

app.use(express.static(path.join(__dirname, 'public')));
//Para session
app.use(cookieParser());
// app.set('trust proxy', 1);
app.set('trust proxy', 1) // trust first proxy
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: false }}))
// var params = {};

app.use(function(req,res,next){
    res.locals.io = io;
    res.locals.csv = csv;
    res.locals.init = {
        head: '<link href="css/font-awesome.min.css" rel="stylesheet" type="text/css"><link href="css/default.css" rel="stylesheet" type="text/css">'
        // ,foot: '<script src="http://code.jquery.com/jquery-1.9.1.min.js"></script><script type="text/javascript" src="js/luitorc.js"></script><script type="text/javascript" src="js/bootstrap.js"></script><script type="text/javascript" src="js/tether.min.js"></script>'
        ,foot: '<script type="text/javascript" src="js/jquery-1.9.1.js"></script><script type="text/javascript" src="js/luitorc.js"></script><script type="text/javascript" src="js/bootstrap.js"></script><script type="text/javascript" src="js/tether.min.js"></script>'
        // ,foot: '<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script><script type="text/javascript" src="js/luitorc.js"></script><script type="text/javascript" src="js/bootstrap.js"></script><script type="text/javascript" src="js/tether.min.js"></script>'
        ,jquery: '<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>'
        // ,foot: '<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script><script type="text/javascript" src="js/luitorc.js"></script><script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script><script type="text/javascript" src="js/tether.min.js"></script>'
    };
    next();
});
// app.use(function(req,res,next){
//     // res.locals.listProduct = 0;
//     res.locals.user = {0};
//     req.session.user = {};
//     next();
// });
//use - for post
// app.use(bodyParser.json({limit: '1mb'})); // support json encoded bodies
app.use(bodyParser.json({limit: '10mb'})); // support json encoded bodies
// app.use(bodyParser.json({limit: '28byte'})); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true ,limit: '10mb'})); // support encoded bodies
// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    // res.setHeader('Access-Control-Allow-Origin', 'http://192.168.1.101');
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.get('/info_user', route.info_user);
//routers
app.get('/', route.index);
app.get('/send_msn123', function(){
    console.log("entro");
});
app.get('/login', route.login);
    //acceso
    app.get('/access', lt.controller('user').access ); // Muestra todos los usuarios que falta atender

app.get('/user_panel', route.user_panel);
app.get('/register', route.register);
app.get('/attention_list', route.attention_list);
app.get('/register_attention', route.register_attention);
    app.get('/register_req', lt.controller('attention').register_req ); // Muestra todos los usuarios que falta atender
app.get('/mini_chat', route.mini_chat);

//MODULES
app.get('/solicitar_servicios', route.solicitar_servicios);
app.get('/sigedo', route.sigedo);
app.get('/attention', route.attention);
    app.get('/get_allAttention_req', lt.controller('attention').get_allAttention_req );
app.get('/diffusion', route.diffusion);
app.get('/sindibe', route.sindibe);
    app.post('/getAllPhoneNumbers', lt.controller('sindibe').getAllPhoneNumbers);
    app.post('/sindibe_deletepromedio', lt.model('sindibe').deletepromedio);
    //mobile
    app.get('/getAllPhoneNumbers', lt.controller('sindibe').getAllPhoneNumbers);
app.get('/sidesun', route.sidesun);

app.get('/directorio_becario', route.directorio_becario);


//CONTROLLER - POST
app.post('/sidesun_search', lt.controller('sidesun').search ); // Muestra todos los usuarios que falta atender

app.post('/getAll', lt.controller('attention').getAll ); // Muestra todos los usuarios que falta atender
app.post('/get_attention', lt.controller('attention').get_attention ); // Muestra todos los usuarios que falta atender
app.post('/next_at', lt.controller('attention').next_at ); // Muestra todos los usuarios que falta atender
app.post('/attention_finish', lt.controller('attention').attention_finish ); // Muestra todos los usuarios que falta atender
app.post('/checkAttention', lt.controller('attention').checkAttention ); // Muestra todos los usuarios que falta atender
//attention
app.post('/checkShipments', lt.controller('attention').checkShipments ); // Muestra todos los usuarios que falta atender
app.post('/saveShipping', lt.controller('attention').saveShipping ); // Muestra todos los usuarios que falta atender
app.post('/viewShipments', lt.model('attention').viewShipments ); // Muestra todos los usuarios que falta atender
app.post('/graphic', lt.model('attention').graphic ); // Muestra todos los usuarios que falta atender
//chat
app.post('/viewed', lt.controller('chat').viewed ); // Muestra todos los usuarios que falta atender
app.post('/send_msn', lt.controller('chat').send_msn ); // Muestra todos los usuarios que falta atender
app.post('/get_viewed', lt.model('chat').get_viewed ); // Muestra todos los usuarios que falta atender
app.post('/msn_waiting', lt.controller('chat').msn_waiting ); // Muestra todos los usuarios que falta atender
app.post('/chat_list', lt.controller('chat').chat_list ); // Muestra todos los usuarios que falta atender
// app.post('/get_attention_before', lt.controller('attention').get_attention_before ); // Muestra todos los usuarios que falta atender


//MODEL
app.post('/attention_before', lt.model('attention').attention_before );
app.post('/user_list', lt.model('user').user_list );
app.post('/user_allData', lt.model('user').user_allData );
app.post('/min_msnXuser', lt.model('chat').min_msnXuser );
app.post('/cantmsn_forme', lt.model('chat').cantmsn_forme );
app.post('/getAllPhoneNumbers', lt.model('sindibe').getAllPhoneNumbers );
app.post('/client_search', lt.model('sindibe').client_search );
app.post('/get_allAttention_req', lt.model('attention').get_allAttention_req );
app.post('/getnotasXcurso', lt.model('sidesun').getnotasXcurso );
app.post('/getCantnotasXcurso', lt.model('sidesun').getCantnotasXcurso );
app.post('/saveCursoXaverage', lt.model('sidesun').saveCursoXaverage );
app.post('/setpagXbecario', lt.model('sidesun').setpagXbecario );
app.post('/setboletaXbecario', lt.model('sidesun').setboletaXbecario );
app.post('/update_promedio', lt.model('sidesun').update_promedio );
app.post('/insertPromedio', lt.model('sidesun').insertPromedio );
app.post('/getAllInstitutionName', lt.model('sidesun').getAllInstitutionName );
app.post('/getAllCareer', lt.model('sidesun').getAllCareer );

/*USER*/
app.get('/session_exit', function(req, res){
    req.session.destroy();
    res.redirect('/');
});
io.on('connection',function(socket){
	console.log("Conectado: "+socket.id);
    /*chat*/
    // socket.on('chat_zumbido_req', function (dt){
    //     io.emit('chat_zumbido_res', dt);
    // });
    socket.on('conexSMS_req', function (dt){
        console.log(dt);
        io.emit('conexSMS_res', dt);
    });
    socket.on('chat_msn_req', function (dt){
        console.log(dt);
        io.emit('chat_msn_res', dt);
    });
    socket.on('chat_ping_req', function (id_user){
        io.emit('chat_ping_res', id_user);
    });

    socket.on('reload_req', function (dt){
    	io.emit('reload_res', dt);
    });
    socket.on("notify_req",function(dt){
        io.emit('notify_res', dt)
    });
    socket.on("notify_vibrador_req",function(dt){
        io.emit('notify_vibrador_res', dt)
    });
    socket.on("req_sendsms",function(dt){
        //max 20 caracteres
        dt.text = "[becas regionales]: "+dt.text;
        io.emit('res_sendsms', dt)
        console.log(dt);
    });
    socket.on("req_sendsms_rst",function(dt){
        //max 20 caracteres
        // dt.text = "[becas regionales]: "+dt.text;
        io.emit('res_sendsms_rst', dt);
        // console.log(dt);
    });


    socket.on('disconnect',function(){
    	console.log("Salio de seccion");
    });
});

var timeIni = 0;
//Delay Estimado

http.listen(PORT,function(){
    //colours console.log https://www.npmjs.com/package/colors
    console.log('server listening on port '+PORT);
    
    // console.log("\n////////////////////****************//////////////////////");
    // console.log("\nBienvenidos a Sisvenga  ".yellow+"S.A.".white);
    // console.log("\nSistema url:".gray+" http://localhost:".white+"%s".white, PORT);
    // console.log("\n\n\nCreated by: \n- Carlos Javier Condori Ticona \n- Luis Huertas Laura \n-cell: 935422777");
    console.log("\n////////////////////****************//////////////////////");


    console.log("¿Desea Abrir el Sistema? ( 1 = Si )");
    rl.on('line', (input) => {
        
      if( input == "1" ){
            console.log("\nReceived: Si");
            console.log('Se esta procediendo a direccionar al sistema');
            process.stdout.write("Cargando: ");
            var timeDelay = 20000;
            cargando(timeDelay);
            open("http://localhost:"+PORT,"chrome",function(){
                // console.log("termino");
                timeIni = timeDelay - 4000;
            });        
        }
    });
});



function cargando(timeDelay){
    setTimeout(function(){
        timeIni+=1000;
        if( timeIni < timeDelay){
            process.stdout.write(" * ");
            cargando(timeDelay);
        }else{
            timeIni = 0;
            console.log("");
            console.log("\n¿Desea Abrir nuevamente el Sistema? ( 1 = Si )");
        }
    },1000);
}