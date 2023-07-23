import axios from 'axios';
import config from "../config/config";

const { PAY_STACK_SECRET_KEYS } = config;
const PAYSTACK_API_URL = 'https://api.paystack.co/transaction';

export const initializeTransaction = async (amount: number, reference: string, email:string, callBackURl: string) => {
	const response = await axios.post(
		`${PAYSTACK_API_URL}/initialize`,
		{ amount, reference, email, callback_url: callBackURl },
		{ headers: { Authorization: `Bearer ${PAY_STACK_SECRET_KEYS}` } }
	);
	return response.data
};

export const verifyTransaction = async (reference: string) => {
	const response = await axios.get(
		`${PAYSTACK_API_URL}/verify/${reference}`,
		{ headers: { Authorization: `Bearer ${PAY_STACK_SECRET_KEYS}` } }
	);
	
	return response.data;
};
