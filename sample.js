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

function request(fnc,params,callback){
    $.ajax({url:'http://localhost:3005/'+fnc,data:JSON.stringify(params)}).
        success(function(what){
            callback(what);
        }).
        error(function(err){
            callback({result:"error",error:''+err});
        })
}

request('config',{slaves:slaves},function(res){
    console.log(res);
    request('getPins',{},function(res){
        console.log(res);
    })
})

