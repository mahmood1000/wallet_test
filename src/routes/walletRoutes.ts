import { Server } from '@hapi/hapi';
import * as WalletController from '../controllers/walletController';
import Joi from 'joi';
import { handleResponseError } from "../utils/handleResponseError";

const WalletRoutes = (server: Server) => {
	server.route({
		method: 'POST',
		path: '/fund',
		handler: WalletController.fundWallet,
		options: {
			validate: {
				payload: Joi.object({
					userId: Joi.string().required(),
					amount: Joi.number().min(1).required()
				}),
			},
			tags: ['api'],
			description: 'Funds a wallet',
			notes: 'Funds a wallet using Paystack',
		},
	});
	
	server.route({
		method: 'POST',
		path: '/transfer',
		handler: WalletController.transferFunds,
		options: {
			validate: {
				payload: Joi.object({
					senderId: Joi.string().required(),
					receiverId: Joi.string().required(),
					amount: Joi.number().min(1).required()
				}),
			},
			tags: ['api'],
			description: 'Transfer funds between wallets',
			notes: 'Transfer funds between two wallets',
		},
	});
	
	server.route({
		method: "GET",
		path: "/verify-fund",
		options: {
			handler: WalletController.verifyFundWallet,
			tags: ["api"],
			description: "Verify wallet funding",
			notes: "Verify transaction status with Paystack using transaction reference",
			response: {
				failAction:handleResponseError
			},
			validate: {
				query: Joi.object({
					trxref: Joi.string().required(),
					reference: Joi.string().required()
				})
			}
		}
	});
	server.route({
		method: "GET",
		path: "/wallet/{userId}/balance",
		options: {
			handler: WalletController.getBalance,
			description: 'Get Wallet Balance',
			notes: 'Returns the balance of a specific wallet',
			tags: ['api'],
			validate: {
				params: Joi.object({
					userId: Joi.string().required()
				})
			}
		}
	})
};

export default WalletRoutes;
