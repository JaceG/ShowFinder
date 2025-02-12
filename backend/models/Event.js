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
		imageUrl: String,
		ticketUrl: String,
		eventData: {
			type: Object,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('Event', eventSchema);
