import HttpError from "./HttpError";

class Forbidden extends HttpError {

    constructor(message : string){
        super(message)
        this.name = "Forbidden"
        this.statusCode = 403
    }

}

export default Forbidden