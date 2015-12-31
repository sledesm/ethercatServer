/**
 * To paste into chrome snippet. Defines some slaves and makes some requests
 */

simpleCardSlave={
    "id": {
        "vendor": "0x361300",
        "product": "0xcacb"
    },
    "syncs": [
        {
            "syncManager": 2,
            "direction": "output",
            "pdos": [
                {
                    "index": "0x1601",
                    "entries": [
                        {
                            "index": "0x7010",
                            "subindex": 0,
                            "name": "Position0",
                            "type": "int32"
                        },
                        {
                            "index": "0x7011",
                            "subindex": 0,
                            "name": "Position1",
                            "type": "int32"
                        },
                        {
                            "index": "0x7012",
                            "subindex": 0,
                            "name": "Position2",
                            "type": "int32"
                        },
                        {
                            "index": "0x7013",
                            "subindex": 0,
                            "name": "Position3",
                            "type": "int32"
                        },
                        {
                            "index": "0x7014",
                            "subindex": 0,
                            "name": "ControlWord",
                            "type": "uint32"
                        }
                    ]
                }
            ],
            "watchdog": "disable"
        },
        {
            "syncManager": 3,
            "direction": "input",
            "pdos": [
                {
                    "index": "0x1a00",
                    "entries": [
                        {
                            "index": "0x6001",
                            "subindex": 0,
                            "name": "Encoder0",
                            "type": "int32"
                        },
                        {
                            "index": "0x6002",
                            "subindex": 0,
                            "name": "Encoder1",
                            "type": "int32"
                        },
                        {
                            "index": "0x6003",
                            "subindex": 0,
                            "name": "Encoder2",
                            "type": "int32"
                        },
                        {
                            "index": "0x6004",
                            "subindex": 0,
                            "name": "Encoder3",
                            "type": "int32"
                        },
                        {
                            "index": "0x6005",
                            "subindex": 0,
                            "name": "statusWord",
                            "type": "uint32"
                        }
                    ]
                }
            ],
            "watchdog": "disable"
        }
    ]
}
rtaSlave={
    "id": {
        "vendor": "0x17f",
        "product": "0x14"
    },
    "syncs": [
        {
            "syncManager": 2,
            "direction": "output",
            "pdos": [
                {
                    "index": "0x1601",
                    "entries": [
                        {
                            "index": "0x6040",
                            "subindex": 0,
                            "name": "controlWord",
                            "type": "uint16"
                        },
                        {
                            "index": "0x607a",
                            "subindex": 0,
                            "name": "targetPosition",
                            "type": "int32"
                        }
                    ]
                }
            ],
            "watchdog": "disable"
        },
        {
            "syncManager": 3,
            "direction": "input",
            "pdos": [
                {
                    "index": "0x1a01",
                    "entries": [
                        {
                            "index": "0x6041",
                            "subindex": 0,
                            "name": "statusWord",
                            "type": "uint16"
                        },
                        {
                            "index": "0x6064",
                            "subindex": 0,
                            "name": "actualPosition",
                            "type": "int32"
                        }
                    ]
                }
            ],
            "watchdog": "disable"
        }
    ]
}
var rtaConfig=[
    {
        "id":"configValue1",
        "type":"sdo",
        "params":{
            "index":"0x6060",
            "subindex":0,
            "type":"uint8",
            "value":8
        }
    },
    {
        "id":"configValue2",
        "type":"sdo",
        "params":{
            "index":"0x3206",
            "subindex":0,
            "type":"uint8",
            "value":1
        }
    },
    {
        "id":"configValue3",
        "type":"sdo",
        "params":{
            "index":"0x6081",
            "subindex":0,
            "type":"uint32",
            "value":400
        }
    }
]

var slaves=[
    {
        id: "rta0",
        position: {
            alias: 0,
            index: 0
        },
        definition: rtaSlave,
        config:rtaConfig
    },
    {
        id:"rta1",
        position:{
            alias:0,
            index:1
        },
        definition:rtaSlave,
        config:rtaConfig
    },
    {
        id:"simpleCard0",
        position:{
            alias:0,
            index:2
        },
        definition:simpleCardSlave
    }
]

window.ajaxRequest=function(){
    var activexmodes=["Msxml2.XMLHTTP", "Microsoft.XMLHTTP"] //activeX versions to check for in IE
    if (window.ActiveXObject){ //Test for support for ActiveXObject in IE first (as XMLHttpRequest in IE7 is broken)
        for (var i=0; i<activexmodes.length; i++){
            try{
                return new ActiveXObject(activexmodes[i])
            }
            catch(e){
                //suppress error
            }
        }
    }
    else if (window.XMLHttpRequest) // if Mozilla, Safari etc
        return new XMLHttpRequest()
    else
        return false
}

window.request = function(fnc, params, callback) {
    var url = "http://localhost:3005/" + fnc;
    var mypostrequest = new ajaxRequest()
    mypostrequest.onreadystatechange = function() {
        if (mypostrequest.readyState == 4) {
            callback(JSON.parse(mypostrequest.responseText));
        }
    }
    mypostrequest.open("POST", url, true)
    mypostrequest.send(JSON.stringify(params));

}


request('configure',{slaves:slaves},function(res){
    if (res.result=="error"){
        console.error(res);
        return;
    }
    request('start',{},function(res){
        if (res.result=="error"){
            console.error(res);
            return;
        }
        request('activate',{},function(res){
            if (res.result=="error"){
                console.log(res);
            }
        })
    })
    console.log(res);
})

