
function response(infoMessage, statusCode, internCode){
    return {
        messageInfo: infoMessage,
        statusCode: statusCode,
        statusInternCode: internCode
    }
}

function responseData(dataResponse, statusCode, internCode){
    return {
        data: dataResponse,
        statusCode: statusCode,
        statusInternCode: internCode
    }
}

module.exports = {
    response,
    responseData
}
