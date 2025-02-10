# ShowFinder - Local Concert Search Tool

![License](https://img.shields.io/badge/License-MIT-blue.svg)

A web application that helps users discover local music events and concerts in their area.

## Project Overview

ShowFinder is a full-stack application that allows users to search for local music events by city. The application integrates multiple APIs to provide comprehensive event information, including music previews, weather forecasts, and venue details.

## Tech Stack

- **Frontend**: 
  - React.js 18.2
  - Material-UI v5.15
  - React Router v6.22
- **Backend**: 
  - Node.js v14+
  - Express v4.18
  - MongoDB v8.9
- **APIs**: 
  - Ticketmaster API
  - Spotify API
  - OpenWeather API
  - Google Maps & YouTube API

## Project Structure 

```
ShowFinder/
├── backend/                # Node.js & Express backend
│   ├── controllers/        # API call handlers
│   ├── routes/            # Backend routes
│   ├── models/            # Database models
│   ├── middleware/        # Auth & request middleware
│   ├── config/           # Environment & API configuration
│   └── server.js         # Express app entry point
└── frontend/             # React frontend
    ├── src/
    │   ├── components/   # UI components
    │   ├── context/      # Theme & auth context
    │   ├── api/          # API integration
    │   └── utils/        # Helper functions
    └── public/           # Static files
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn
- API keys for:
  - Ticketmaster
  - Spotify
  - Google (Maps & YouTube)
  - OpenWeather

### Configuration

Create a `.env` file in the backend directory:

```env
PORT=3333
NODE_ENV=development
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret

# API Keys
PORT=3000
REACT_APP_GOOGLE_API_KEY=your_google_key
TICKETMASTER_API_KEY=your_ticketmaster_key
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
GOOGLE_API_KEY=your_google_key
OPENWEATHER_API_KEY=your_openweather_key
```

The backend server will run on `http://localhost:3333` and the frontend development server on `http://localhost:3000`.

### Required API Keys:

- **Ticketmaster API**: Get your key at [Ticketmaster Developer Portal](https://developer.ticketmaster.com/)
- **Spotify API**: Get your client ID and secret at [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/)
- **Google Maps & YouTube**: Get your API key at [Google Cloud Console](https://console.cloud.google.com/)
  - Enable both Maps JavaScript API and YouTube Data API v3
- **OpenWeather API**: Get your key at [OpenWeather](https://openweathermap.org/api)


### Installation

1. Clone and install dependencies:
```bash
git clone https://github.com/JaceG/ShowFinder.git
cd ShowFinder
npm run install-all
```

2. Start the development servers:
```bash
npm start
```

This will run:
- Backend server on `http://localhost:3333`
- Frontend development server on `http://localhost:3000`

## Features

- **Event Search & Discovery**
  - Search events by city
  - Filter by genre and sort by date
  - Real-time event data from Ticketmaster
  - Comprehensive venue and ticket information

- **Music Integration**
  - Spotify artist previews and top tracks
  - YouTube performance videos
  - Related artists suggestions

- **Enhanced Event Information**
  - Interactive venue maps via Google Maps
  - Weather forecasts for event dates
  - Detailed venue information

- **User Features**
  - User authentication
  - Save favorite events
  - Personalized event recommendations

## Future Enhancements

- Mobile app version
- Event recommendations based on user preferences
- Social features for sharing events
- Ticket price tracking and alerts
- Integration with more event providers

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Acknowledgments

- Ticketmaster API for event data
- Spotify API for music integration
- Google Maps Platform for mapping features
- OpenWeather API for weather forecasts
- Material-UI for the component library

## Questions

For any questions, please contact us on GitHub at [JaceG](https://github.com/JaceG), [ElBoyTM](https://github.com/ElBoyTM), [Apgash](https://github.com/Apgash), or [nate236](https://github.com/nate236).

## Credits

Credits: This project was created as part of a coding bootcamp group project. - Sources and References: Portions of the code and guidance were provided with assistance from ChatGPT, Tutors, and Instructors.

## Preview

![Main Page](/assets/homepage.png)

![Login Page](/assets/loginpage.png)

![Register Page](/assets/regpage.png)