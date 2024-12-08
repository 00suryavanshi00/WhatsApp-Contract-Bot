import mongoose from 'mongoose'


export interface MessageInterface extends mongoose.Document{
    phoneNumber: string;
    content: string;
    extractedData: {
        keywords: string[],
        contractId? : string;
    };
    type: 'incoming' | 'outgoing'
    createdAt: Date;
}


const MessageSchema = new mongoose.Schema<MessageInterface>({

    phoneNumber: {type: String, required: true},
    content: {type: String, required: true},
    extractedData: {
        keywords: [String],
        contractId : String
    },
    type: String,
    createdAt: {type: Date, default: Date.now},
})


// export default mongoose.models.Message || mongoose.model<MessageInterface>('Message', MessageSchema)

export default mongoose.model<MessageInterface>('Message', MessageSchema)