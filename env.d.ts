declare global {
    namespace NodeJS {
        interface ProcessEnv {
            MONGODB_URI: string
            TMP_FOLDER: string
            LOG_FOLDER: string
            ACCESS_TOKEN_SECRET: string
            REFRESH_TOKEN_SECRET: string
            BCRYPT_ROUND: string
        }
    }
}

export {}