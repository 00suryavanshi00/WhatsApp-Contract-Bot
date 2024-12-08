import mongoose from "mongoose"

export default class Database{
    private static instance: Database
    private static connection: mongoose.Connection | null = null


    private constructor(){} // to prevent direct instantiation

    public static getInstance(): Database{
        if (!Database.instance){
            Database.instance = new Database();

        }
        return Database.instance
    }

    // this also lazy loads the connection since it connects only when connect is called 
    async connect(): Promise<mongoose.Connection>{
        if (!Database.connection){
            try{
                console.log('this is the uri',process.env.MONGODB_URI)
                const connect = await mongoose.connect(process.env.MONGODB_URI || '')

                Database.connection = connect.connection;
                console.log("DB successfully connected")
                return Database.connection
            }
            catch(e){
                console.log("DB connection error", e)
                throw e
            }
        }

        return Database.connection
    }

    getConnection(): mongoose.Connection | null{
        return Database.connection
    }
}
