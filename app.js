/**
 * Created by santi on 12/28/15.
 */
var http=require('http');
var url=require('url');

var port=3005;

if (process.argv[2]){
    port=process.argv[2];
}

var server=http.createServer(function(request,response){
    response.writeHead(200,{'Content-type':'text/json'});

    var requestUrl=decodeURI(request.url);
    var parsedUrl=url.parse(requestUrl);
    console.log(parsedUrl);
    var res={result:"ok",data:{}};
    var path=parsedUrl.pathname.split("/");
    var params={};
    if (parsedUrl.query){
        try{
            console.log("parsing:",parsedUrl.query);
            params=JSON.parse(parsedUrl.query);
        }catch(e){

        }
    }
    console.log("params",params);
    switch(path[1]){
        case "getApi":
            break;
        default:
            res={result:"ok",data:{msg:"Please specify function",params:params}};
            break;
    }
    var resStr=JSON.stringify(res);
    response.write(resStr);
    response.end();
}).listen(port);
console.log("ethercat server listening on port: ",port);