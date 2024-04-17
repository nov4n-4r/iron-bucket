import * as yup from "yup"
import moment from "moment";

yup.addMethod(yup.string, 'dateFuture', function (errorMessage?: string) {
    return this.test({
        name: "dateFuture",
        message: errorMessage ?? 'Invalid date',
        test: function (value) {
            try{
                const targetValue = moment(value, "YYYYMMDD")
                const now = moment(new Date())

                return (
                    (targetValue.toDate().getTime() - now.toDate().getTime()) > 0
                )

            } catch(err) {
                return false
            }
        }
    });
});