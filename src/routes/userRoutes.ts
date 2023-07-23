import { Server } from '@hapi/hapi';
import * as UserController from '../controllers/userController';
import Joi from 'joi';
import { handleResponseError } from "../utils/handleResponseError";


const UserSchema = Joi.object({
	_id: Joi.object().required().example('60ff720b4af5f7d0f8e4d39e'),
	name: Joi.string().required().example('John Doe'),
	email: Joi.string().email().required().example('john.doe@example.com')
});

const UserRoutes = (server: Server) => {
	server.route({
		method: 'GET',
		path: '/users/{id}',
		handler: (request, h) => {
			return 'Welcome to wallet pay visit /documentation!';
		},
	})
	server.route({
		method: 'POST',
		path: '/users',
		handler: UserController.createUser,
		options: {
			validate: {
				payload: Joi.object({
					name: Joi.string().required(),
					email: Joi.string().email().required()
				}),
			},
			tags: ['api'],
			description: 'Create a new user',
			notes: 'Creates a new user and associated wallet',
		},
	});
	
	server.route({
		method: 'GET',
		path: '/users',
		handler: UserController.getAllUsers,
		options: {
			tags: ['api'],
			description: 'Get all users',
			notes: 'Returns a list of all users',
			response: {
				schema: Joi.array().items(UserSchema),
				failAction: handleResponseError,
			},
		},
	});
};

export default UserRoutes;
