import { Request, ResponseToolkit } from '@hapi/hapi';
import User from '../models/user';
import Wallet from '../models/wallet';
import Boom from '@hapi/boom';
import { MongoError } from 'mongodb';

export const createUser = async (request: Request, h: ResponseToolkit) => {
	const { name, email } = request.payload as any;
	
	try {
		const user = new User({ name, email });
		await user.save();
		
		const wallet = new Wallet({ userId: user._id, balance: 0 });
		await wallet.save();
		
		return h.response(user).code(201);
	} catch (err) {
		if (err instanceof MongoError && err.code === 11000) {
			throw Boom.badRequest('Email already exists');
		}
		
		throw err;
	}
};

export const getAllUsers = async (_: Request, h: ResponseToolkit) => {
	const users = await User.find({}, {  email: 1, name: 1, _id: 1}).lean();
	return h.response(users).code(200);
};
