const mongoose = require('mongoose');

const savedEventSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	eventId: {
		type: String,
		required: true,
	},
	eventData: {
		type: Object,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

// Compound index to ensure a user can't save the same event twice
savedEventSchema.index({ userId: 1, eventId: 1 }, { unique: true });

const SavedEvent = mongoose.model('SavedEvent', savedEventSchema);

module.exports = SavedEvent;