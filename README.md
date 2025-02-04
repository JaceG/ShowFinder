# ShowFinder - Local Concert Search Tool

A web application that helps users discover local music events and concerts in their area.

## Project Overview

ShowFinder is a full-stack application that allows users to search for local music events by city. The application uses the Eventbrite API to fetch event data and provides a clean, user-friendly interface for browsing concerts.

## Tech Stack

- **Frontend**: React.js with Material-UI
- **Backend**: Node.js with Express
- **APIs**: Eventbrite API (with plans to add Bandsintown and YouTube Data API)

## Project Structure 

ShowFinder/
├── backend/ # Node.js & Express backend
│ ├── controllers/ # API call handlers
│ ├── routes/ # Backend routes
│ ├── config/ # Environment variables
│ └── server.js # Express app entry point
└── frontend/ # React frontend
├── src/
│ ├── components/ # UI components
│ ├── pages/ # Main pages
│ └── api/ # API integration
└── public/ # Static files

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Eventbrite API key

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/ShowFinder.git
cd ShowFinder
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Create a `.env` file in the backend directory with your API keys:
```
PORT=5000
EVENTBRITE_API_KEY=your_api_key_here
NODE_ENV=development
```

### Running the Application

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Start the frontend development server:
```bash
cd frontend
npm start
```

The application will be available at `http://localhost:3000`

## Features

- Search for concerts by city
- View event details including venue and ticket information
- Clean and responsive user interface
- Real-time event data from Eventbrite

## Future Enhancements

- Integration with Bandsintown API for additional event data
- YouTube video integration for artist previews
- Weather information for outdoor events
- User accounts and saved events

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Acknowledgments

- Create React App for the frontend boilerplate
- Express.js for the backend framework
- Material-UI for the component library

