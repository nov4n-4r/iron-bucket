declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: 'development' | 'production' | 'test';
            PORT: number;
            PWD: string;
            MONGODB_URI: string
        }
    }
}

import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import { Types } from "mongoose";

export interface Permission extends Record<string, any> {
    user : {
        view : boolean
        create? : boolean,
        update? : boolean,
        delete? : boolean
    },
    file : {
        view : boolean,
        download : boolean,
        upload? : boolean,
        delete? : boolean,
        update? : boolean
    }
}

export interface GenerateTokenBody {
    username : string,
    password : string,
    title : string,
    description? : string,
    access : Permission
}

export interface IUser extends Record<string, any> {
    username : string,
    password : string
    access : Permission,
    owner? : boolean,
    isDeleted : boolean
}

export interface IUserJWTParsed extends
    JwtPayload,
    Pick<IUser, "username">,
    Pick<IUser, "access">,
    Pick<IUser, "owner">,
    Record<string, any> {
        _id : Types.ObjectId
    }

export interface SerializedUserExpressRequest extends Request {
    user : IUserJWTParsed
}
  
// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.