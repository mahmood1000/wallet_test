import { Request, ResponseToolkit } from '@hapi/hapi';
import Wallet from '../models/wallet';
import User from '../models/user';
import Transaction from '../models/transaction';
import { initializeTransaction, verifyTransaction } from '../utils/paystack';

export const fundWallet = async (request: Request, h: ResponseToolkit) => {
	const { userId, amount } = request.payload as any;
	
	const wallet = await Wallet.findOne({ userId });
	if (!wallet) {
		return h.response({ error: 'Wallet not found' }).code(400);
	}
	
	const user = await User.findOne({ _id: userId });
	
	if(!user) {
		return h.response({ error: 'Wallet not found' }).code(400);
	}
	
	const transaction = await Transaction.create({
		from: userId,
		to: userId,
		amount,
		status: 'initialized',
		type: 'paystack',
	});
	const host = request.headers['x-forwarded-host'] || request.info.host;
	const verificationUrl = `${request.headers['x-forwarded-proto'] || request.server.info.protocol}://${host}/verify-fund`;
	const res = await initializeTransaction(amount * 100, transaction.id, user.email, verificationUrl);
	return h.response({...transaction.toJSON(), paymentLink: res.data.authorization_url}).code(200);
};


export const transferFunds = async (request: Request, h: ResponseToolkit) => {
	const { senderId, receiverId, amount } = request.payload as any;
	
	const senderWallet = await Wallet.findOne({ userId: senderId });
	const receiverWallet = await Wallet.findOne({ userId: receiverId });
	if (!senderWallet) return h.response({ error: 'Unable to verify senders account' }).code(400);
	if (!receiverWallet) return h.response({ error: 'Unable to verify recipient account' }).code(400);
	
	if (senderWallet.balance < amount) {
		return h.response({ error: 'Insufficient funds' }).code(400);
	}
	
	const transaction = await Transaction.create({
		from: senderId,
		to: receiverId,
		amount,
		status: 'initialized',
		type: 'transfer',
	});
	
	senderWallet.balance -= amount;
	receiverWallet.balance += amount;
	await senderWallet.save();
	await receiverWallet.save();
	
	transaction.status = 'successful';
	await transaction.save();
	
	return h.response(transaction.toJSON()).code(200);
};



export const verifyFundWallet = async (request: Request, h: ResponseToolkit) => {
	try {
		const { reference } = request.query as any;
		
		const payStackResponse = await verifyTransaction(reference);
		
		if(payStackResponse?.data?.status !== 'success') return h.response({ error: 'Transaction verification failed' }).code(400);
		const transaction = await Transaction.findOne({ _id: payStackResponse.data.reference });
		
		if(!transaction) return h.response({ error: 'unable to validate transaction' }).code(400);
		if ( transaction.status !== 'initialized' || transaction.type !== 'paystack') {
			return h.response({ error: 'Invalid transaction' }).code(400);
		}
		transaction.status = 'successful';
		await transaction.save();
		
		const wallet = await Wallet.findOne({ userId: transaction.to });
		if(!wallet) return h.response({ error: 'unable to validate wallet' }).code(400);
		
		wallet.balance += payStackResponse.data.amount / 100;
		await wallet.save();
		
		return h.response(wallet.toJSON()).code(200);
	}
	catch (e) {
		return h.response({ error: 'Transaction verification failed' }).code(400);
	}
};


export const getBalance = async (request: Request, h: ResponseToolkit) => {
	try {
		const userId = request.params.userId;
		const wallet = await Wallet.findOne({ userId: userId });
		
		if (!wallet) {
			return h.response({ error: "Wallet not found" }).code(404);
		}
		
		return h.response({ balance: wallet.balance }).code(200);
	} catch (error) {
		return h.response({ error: "Something went wrong" }).code(500);
	}
};
