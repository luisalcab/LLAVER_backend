//This functions care that the json has the correct format
function voidJson(idealJson, json){
    if (JSON.stringify(json) === '{}')
        return -1;

    for(var i=0; i < idealJson.length; i++)
        if(json[idealJson[i]] === undefined)
            return -2;

    for(var i=0; i < idealJson.length; i++){
        if(json[idealJson[i]] !== 0){
            if(json[idealJson[i]] === "")
                return -3;
        }
    }

    return 0;
}

function undefinedJson(idealJson, json){
    for(var i=0; i < idealJson.length; i++)
    if(json[idealJson[i]] === undefined)
        return -2;
}

function isOfOneType(type, json){
    for (const key in json)
        if (typeof(json[key]) == type)
            return -4
            
    return 0;
}

module.exports = {
    voidJson,
    undefinedJson,
    isOfOneType
}