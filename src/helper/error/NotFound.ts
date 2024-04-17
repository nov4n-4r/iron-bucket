import HttpError from "./HttpError";

class NotFound extends HttpError {

    constructor(message : string){
        super(message)
        this.name = "NotFound"
        this.statusCode = 404
    }

}

export default NotFound