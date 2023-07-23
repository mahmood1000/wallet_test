import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const options = {
	keepAlive: true,
	serverSelectionTimeoutMS: 30000, // Defaults to 30000 (30 seconds)
	useNewUrlParser: true,
	autoIndex: true,
	useUnifiedTopology: true,
};

function db(DB_URL: string) {
	mongoose
		.connect(DB_URL, options)
		.then(async () => {
			console.info(`\x1b[32mSuccessfully connected to ${DB_URL}\x1b[0m`);
		})
		.catch((err: any) => {
			console.error(`There was a db connection error`, err);
			process.exit(0);
		});
	mongoose.connection.once("disconnected", () => {
		console.error(`Successfully disconnected from ${DB_URL}`);
	});
	process.on("SIGINT", () => {
		mongoose.connection.close().then(() => {
			console.error("dBase connection closed due to app termination");
			process.exit(0);
		});
	});
}

export default db;
