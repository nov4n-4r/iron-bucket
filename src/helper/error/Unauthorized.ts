import HttpError from "./HttpError";

class Unauthenticated extends HttpError {

    constructor(message : string){
        super(message)
        this.name = "Unauthenticated"
        this.statusCode = 401
    }

}

export default Unauthenticated