const jwt = require('jsonwebtoken');
const config = require('../config/config');
const AppError = require('../utils/AppError');

const auth = async (req, res, next) => {
	try {
		// Get token from header
		const token = req.header('Authorization')?.replace('Bearer ', '');

		if (!token) {
			throw new AppError('Authentication required', 401);
		}

		// Verify token
		const decoded = jwt.verify(token, config.jwtSecret);

		// Add user to request
		req.user = decoded;
		next();
	} catch (error) {
		next(new AppError('Authentication required', 401));
	}
};

module.exports = auth;
