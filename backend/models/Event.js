const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
	{
		eventId: {
			type: String,
			required: true,
			unique: true,
		},
		name: {
			type: String,
			required: true,
		},
		date: {
			type: Date,
			required: true,
		},
		venue: {
			type: String,
			required: true,
		},
		city: {
			type: String,
			required: true,
		},
		ticketUrl: String,
		imageUrl: String,
		genre: String,
		price: {
			min: Number,
			max: Number,
			currency: String,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('Event', eventSchema);
