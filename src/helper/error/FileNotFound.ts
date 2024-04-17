import HttpError from "./HttpError";

class FileNotFound extends HttpError {

    constructor(message : string){
        super(message)
        this.name = "FileNotFound"
        this.statusCode = 404
    }

}

export default FileNotFound