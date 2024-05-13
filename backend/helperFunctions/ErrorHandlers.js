function helperRequestErrorGenerator(errorNumber, customMessage = undefined) {
    let errorMessage = typeof customMessage == "string"? customMessage: "An error occurred. Please try again later or contact an administrator"
    switch(errorNumber){
        case 400:
            return {errorType: "Client Error",errorMessage}
        case 401:
            return {errorType: "Unauthorized",errorMessage}
        case 403:
            return {errorType: "Forbidden",errorMessage}
        case 500:
            return {errorType: "Server Error", errorMessage}
        default:
            return {errorType: "Generic Error", errorMessage}
    }
}

export default { 
    helperRequestErrorGenerator
 }