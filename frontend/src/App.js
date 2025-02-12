import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EventsPage from './components/EventsPage';
import Navigation from './components/Navigation';
import Login from './components/Login';
import SignUp from './components/SignUp';
import SavedEvents from './components/SavedEvents';

function App() {
	return (
		<Router>
			<Navigation />
			<Routes>
				<Route path='/login' element={<Login />} />
				<Route path='/signup' element={<SignUp />} />
				<Route path='/saved-events' element={<SavedEvents />} />
				<Route path='/' element={<EventsPage />} />
			</Routes>
		</Router>
	);
}

export default App;
