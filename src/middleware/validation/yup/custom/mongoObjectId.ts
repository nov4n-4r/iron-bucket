import * as yup from "yup"
import { Types } from "mongoose";

yup.addMethod(yup.string, 'mongoObjectId', function (message = "Invalid Id") {
    return this.test('valid-objectId', message, function (value) {
        
        if (!value) return true; // Allow empty values (or use .required() if you want to make it required)

        return Types.ObjectId.isValid(value)
    
    });
});
