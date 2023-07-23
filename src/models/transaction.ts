import mongoose, { Document, Schema } from 'mongoose';


enum ITransactionType {
	paystack = "paystack",
	transfer = "transfer"
}

export enum IStatus {
	initialized = 'initialized',
	failed = 'failed',
	successful = 'successful'
}

interface ITransaction extends Document {
	from: string;
	to: string;
	amount: number;
	status: string;
	type: string; // "paystack" for paystack transactions, "transfer" for wallet-to-wallet transfers
}

const transactionSchema: Schema = new Schema({
	from: { type: String, required: true },
	to: { type: String, required: true },
	amount: { type: Number, required: true },
	status: { type: String, required: true, enum:IStatus, default: IStatus.initialized},
	type: { type: String, required: true, enum: ITransactionType },
});

export default mongoose.model<ITransaction>('Transaction', transactionSchema);
