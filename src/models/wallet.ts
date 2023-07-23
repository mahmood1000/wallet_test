import { Schema, model, Document } from 'mongoose';

export interface IWallet extends Document {
	userId: string;
	balance: number;
}

const WalletSchema: Schema = new Schema({
	userId: { type: String, required: true },
	balance: { type: Number, default: 0 },
});

export default model<IWallet>('Wallet', WalletSchema);
