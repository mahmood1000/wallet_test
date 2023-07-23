import mongoose, { Document, Schema } from 'mongoose';

interface IUser extends Document {
	name: string;
	email: string;
}

const UserSchema: Schema = new Schema({
	name: {
		type: String,
		required: true,
		trim: true,
	},
	email: {
		type: String,
		required: true,
		trim: true,
		unique: true,
	},
});

export default mongoose.model<IUser>('User', UserSchema);
