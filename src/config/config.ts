import dotenv from "dotenv";
import Joi from "joi";

dotenv.config();
export const isDev = process.env.NODE_ENV !== "production";

const envSchema = Joi.object({
	PORT: Joi.string().required(),
	MONGO_URL: Joi.string().uri().required(),
	PAY_STACK_SECRET_KEYS: Joi.string().required(),
	PAY_STACK_PUBLIC_KEYS: Joi.string().required()
}).unknown(); // To allow for extra properties on the object that are not being validated

const { error, value } = envSchema.validate(process.env);

if (error) {
	console.error("ENV Error, the following ENV variables are not set:");
	console.table(error.details);
	throw new Error("Fix Env and rebuild");
}

export default value// Use `value` here, not `process.env`!
