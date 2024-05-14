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

function helperRequestSuccessMessageGenerator(successNumber, customMessage = undefined) {
    let successMessage = typeof customMessage == "string"? customMessage: "Request Successfully Processed"
    switch(successNumber){
        case 200:
            return {successType: "OK", successMessage}
        case 201:
            return {successType: "Created", successMessage}
        case 202:
            return {successType: "Accepted", successMessage}
        default:
            return {successType: "Generic Error", successMessage}
    }
}

export default { 
    helperRequestErrorGenerator, 
    helperRequestSuccessMessageGenerator
 }