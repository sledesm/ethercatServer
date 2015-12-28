/**
 * Created by santi on 12/28/15.
 */
var http=require('http');
var url=require('url');
var ethercat=require('node-ethercat');

var port=3005;

if (process.argv[2]){
    port=process.argv[2];
}


function start(params,callback){
    ethercat.start();
    callback({result:"ok",data:{msg:"ethercat system started"}});
}

function getApi(params,callback){
    var data={};
    for (var key in api){
        var doc=api[key].doc;
        data[key]=doc;
    }
    callback({result:"ok",data:data});
}

var api={
    start:{
        f:start,
        doc:{
            desc:"Starts ethercat system",
            params:{
            }
        }
    },
    getApi:{
        f:getApi,
        doc:{
            desc:"Gets the application API"
        }
    }
};

function sendResponse(response,res){
    var resStr=JSON.stringify(res);
    response.write(resStr);
    response.end();
}

var server=http.createServer(function(request,response){
    response.writeHead(200,{'Content-type':'text/json'});

    var requestUrl=decodeURI(request.url);
    var parsedUrl=url.parse(requestUrl);
    var res={result:"ok",data:{}};
    var path=parsedUrl.pathname.split("/");
    var params={};
    if (parsedUrl.query){
        try{
            params=JSON.parse(parsedUrl.query);
        }catch(e){

        }
    }
    console.log("params",params);

    var fname=path[1];
    if (api[fname]){
        var f=api[fname].f;
        f(params,function(res){
            sendResponse(response,res);
        })
    }else{
        res={result:"ok",data:{msg:"Please specify function",params:params}};
        sendResponse(response,res);
    }
}).listen(port);
console.log("note: This process needs root privileges to run");
console.log("ethercat server listening on port: ",port);