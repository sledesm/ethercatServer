/**
 * Created by santi on 12/28/15.
 */
var http=require('http');
var url=require('url');
var ethercat=require('../node-ethercat/node-ethercat.js');

var port=3005;

if (process.argv[2]){
    port=process.argv[2];
}


function start(params,callback){
    ethercat.start(params,callback);
}

function activate(params,callback){
    ethercat.activate(params,callback);
}

function addSlave(params,callback){
    ethercat.addSlave(params,callback);
}

function getPins(params,callback){
    var pins=ethercat.getPins();
    callback({result:"ok",data:pins});
}

function readPin(params,callback){
    var name=params.name;
    var value=ethercat.readPin(name);
    callback({result:"ok",data:value});
}

function writePin(params,callback){
    var name=params.name;
    var value=params.value;
    ethercat.writePin(name,value);
    callback({result:"ok",data:{}});
}

function configSdo(params,callback){
    ethercat.configSdo(params,callback);
}

function getMasterState(params,callback){
    var state=ethercat.getMasterState();
    callback({result:"ok",data:state});
}

function getApi(params,callback){
    var data={};
    for (var key in api){
        var doc=api[key].doc;
        data[key]=doc;
    }
    callback({result:"ok",data:data});
}

function configure(params,callback){
    var slaves=params.slaves;
    if (!slaves || !slaves.length){
        callback({result:"error",error:"Please supply slaves"});
        return;
    }
    function addSlaves(index,callback){
        if (index>=slaves.length){
            callback({result:"ok",data:{}});
            return;
        }
        var slave=slaves[index];
        addSlave(slave,function(res){
            if (res.result=="error"){
                callback(res);
                return;
            }
            addSlaves(index+1,callback);
        })
    }

    addSlaves(0,function(res){
        callback(res);
    })
}


var api={
    configure:{
        f:configure,
        doc:{
            desc:"Configures ethercat system",
            params:{
                slaves:{
                    desc:"Array of slaves",
                    type:"array",
                    item:{
                        type:"object",
                        desc:"Please look at test.js from node-ethercat module to have a look at the structures"
                    }
                }
            }
        }
    },
    addSlave:{
        f:addSlave,
        doc:{
            desc:"Adds a slave",
            params:{
                desc:"Slave config object. Please look at test.js in node-ethercat module to find out syntax"
            }
        }
    },
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
    },
    activate:{
        f:activate,
        doc:{
            desc:"Activates the ethercat system",
            params:{
                useSemaphore:{
                    desc:"Indicates if we must use semaphore to communicate with CNC or if CNC is statically linked"
                }
            }
        }
    },
    getPins:{
        f:getPins,
        doc:{
            desc:"Gets configured pins in the system. We can retrieve offsets for shared memory from them"
        }
    },
    readPin:{
        f:readPin,
        doc:{
            desc:"Reads a pin value from process data",
            params:{
                name:"Fully qualified name. deviceId.pinName"
            },
            result:"value of the pin"
        }
    },
    writePin:{
        f:writePin,
        doc:{
            desc:"Writes a value to a pin",
            params:{
                name:"Fully qualified name. deviceId.pinName",
                value:"Value to write"
            }
        }
    },
    configSdo:{
        f:configSdo,
        doc:{
            desc:"Configures an sdo. This is normally done automatically by adding config section to slave",
            params:{
                slaveId:"id of the slave",
                index:"index of the sdo. Can be in hex string, like \"0x1A00\", or number",
                subindex:"subindex of the sdo. Format like index",
                type:"type of the data. String. Can be uint8,int8,uint16,int16,uint32,int32",
                value:"Value to write on the sdo"
            }
        }
    },
    getMasterState:{
        f:getMasterState,
        doc:{
            desc:"Retrieves master state",
            result:{
                slaves_responding:"Number of slaves responding",
                al_states:"State of the system. The lowest of all running states in the configured pdo",
                link_up:"Indicates if link is up or down"
            }
        }
    }

};

function sendResponse(response,res){
    response.writeHead(200,{'Content-type':'text/json'});
    var resStr=JSON.stringify(res);
    response.write(resStr);
    response.end();
}

function getRequestData(request,callback){
    var requestUrl=decodeURI(request.url);
    var parsedUrl=url.parse(requestUrl);
    var path=parsedUrl.pathname.split("/");
    var params={};
    if (parsedUrl.query){
        try{
            params=JSON.parse(parsedUrl.query);
        }catch(e){
            callback({result:"error",error:"Cannot parse query as JSON"});
        }
    }
    var fname=path[1];
    if (!fname){
        callback({result:"error",error:"Please specify function name"});
        return;
    }
    switch(request.method.toUpperCase()){
        case "GET":
            callback({result:"ok",data:{fname:fname,params:params}});
            break;
        case "POST":
            var body="";
            request.on('data',function(data){
                body+=data;
            })
            request.on('end',function(){
                try{
                    var postParams=JSON.parse(body);
                    for (var key in postParams){
                        params[key]=postParams[key];
                    }
                    callback({result:"ok",data:{fname:fname,params:params}})
                }catch(e){
                    callback({result:"error",error:"Error parsing post data. Not a valid JSON"});
                    return
                }
            })
            break;
    }
}

var server=http.createServer(function(request,response){
    getRequestData(request,function(res){
        if (res.result=="error"){
            response.writeHead(400,"Wrong request format");
            response.end();
            return;
        }
        var data=res.data;
        var fname=data.fname;
        var params=data.params;
        if (api[fname]){
            var f=api[fname].f;
            f(params,function(res){
                sendResponse(response,res);
            })
        }else{
            res={result:"ok",data:{msg:"Please specify function"}};
            sendResponse(response,res);
        }
    })



}).listen(port);
console.log("note: This process needs root privileges to run");
console.log("ethercat server listening on port: ",port);