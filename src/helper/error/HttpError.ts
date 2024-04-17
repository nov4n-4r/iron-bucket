class HttpError extends Error {

    statusCode : number = 500;

    constructor(message : string){
        super(message)
        this.name = "HttpError"
    }

}

export default HttpError