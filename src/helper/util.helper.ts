import { Permission } from "../type"
import BadRequest from "./error/BadRequest"

export function isObjectEmpty(object : Object){

    return Object.keys(object).length === 0

} 

export function compareAccess(
    userObject : unknown & { access : Permission },
    access : Record<any, any | Object>
){

    // Define permission types and their corresponding error messages
    const permissionTypes = ['file', 'user'];
    const permissionErrors: Record<string, string> = {
        file: 'Invalid access, user does not have file.{action} permission',
        user: 'Invalid access, user does not have user.{action} permission'
    };

    // Iterate through each permission type (file, user)
    for (const type of permissionTypes) {
        // Iterate through each permission action (upload, download, update, delete, view, create)
        if(!access[type]) continue;
        const actions = Object.keys(access[type]) as Array<keyof typeof access['file']>;
        for (const action of actions) {
            const userHasPermission = userObject.access[type][action];
            const requestedPermission = access[type][action];

            if (requestedPermission && !userHasPermission) {
                const errorMessage = permissionErrors[type].replace('{action}', action as string);
                throw new BadRequest(errorMessage);
            }
        }
    }

}

// Function to access nested properties using dot notation
export function getValueByDotNotation(obj : Record<string, any>, key : string){
    // Split the key string into parts
    const keys = key.split('.');

    // Use reduce to traverse through the nested object
    return keys.reduce((nestedObj, nestedKey) => {
        if (nestedObj && typeof nestedObj === 'object' && nestedKey in nestedObj) {
            return nestedObj[nestedKey];
        }
        // Return undefined if any key is not found
        return undefined;
    }, obj);
}