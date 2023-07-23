import inert from '@hapi/inert'
import vision from "@hapi/vision";
import * as HapiSwagger from 'hapi-swagger';
import packageJson from '../package.json' assert { type: 'json' };
import Hapi, { Server } from "@hapi/hapi";
import db from "./config/database";
import config from "./config/config";
import WalletRoutes from "./routes/walletRoutes";
import UserRoutes from "./routes/userRoutes";

const {MONGO_URL, PORT} = config;

const server: Server = Hapi.server({
	port: PORT
});

const swaggerOptions: HapiSwagger.RegisterOptions = {
	info: {
		title: 'P2p wallet system',
		version: packageJson.version
	}
};





db(MONGO_URL);

const plugins: Array<Hapi.ServerRegisterPluginObject<any>> = [{
	plugin: inert
},
	{
		plugin: vision
	},
	{
		plugin: HapiSwagger,
		options: swaggerOptions
	}
];

(async ()=>{
	await server.register(plugins)
	await server.start()
	UserRoutes(server);
	WalletRoutes(server);
	
	console.log(`Server running on ${server.info.uri}`);
})()

process.on('unhandledRejection', (err) => {
	console.log(err);
	process.exit(1);
});
