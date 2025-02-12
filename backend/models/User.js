const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		password: {
			type: String,
			required: true,
		},
		name: {
			type: String,
			required: true,
			trim: true,
		},
		savedEvents: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Event',
			},
		],
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('User', userSchema);
