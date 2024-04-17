import HttpError from "./HttpError";

class BadRequest extends HttpError {

    constructor(message : string){
        super(message)
        this.name = "BadRequest"
        this.statusCode = 400
    }

}

export default BadRequest