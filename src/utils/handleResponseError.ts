import { ResponseToolkit, Request } from '@hapi/hapi';
import Joi, { ValidationError } from 'joi';

export const handleResponseError = (request: Request, h: ResponseToolkit, err?: ValidationError | Error) => {
	console.log(err)
	if (err && err instanceof Joi.ValidationError) {
		const message = err.details.map(e => e.message).join(', ');
		return h.response({
			statusCode: 400,
			error: 'Bad Request',
			message: `Invalid request payload input: ${message}`
		}).code(400);
	}
	
	return h.continue;
};
