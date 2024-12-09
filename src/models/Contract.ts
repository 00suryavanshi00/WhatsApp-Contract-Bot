import mongoose from "mongoose";

export interface ContractInterface extends mongoose.Document{
    clientName: string;
    amount: number;
    status: 'draft' | 'in_progress' | 'completed' | 'cancelled';
    phoneNumber: string;
    createdAt: Date;
}

const ContractSchema = new mongoose.Schema<ContractInterface>({

    clientName: {type: String, required: true},
    amount: {type: Number, required: true},
    status: {
        type: String,
        enum:['draft' , 'in_progress' , 'completed' , 'cancelled'],
        default: 'draft'
    },
    phoneNumber: {type: String, required: true},
    createdAt: {type: Date, default: Date.now},
})


export default mongoose.model<ContractInterface>('Contract', ContractSchema)

