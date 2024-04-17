import * as yup from "yup"
import moment from "moment";

yup.addMethod(yup.string, 'dateString', function (errorMessage?: string) {
    return this.test({
        name: "dateString",
        message: errorMessage ?? 'Invalid date format, date must be YYYYMMDD',
        test: function (value) {
            try{

                // use required() if want to make this field is required
                if(!value) return true

                const targetValue = moment(value, "YYYYMMDD")

                return targetValue.toDate().toString() != "Invalid Date"

            } catch(err) {

                return false
            
            }
        }
    });
});
