import {
	TextField,
	Button,
	Grid,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Box,
} from '@mui/material';

function SearchForm({
	city,
	setCity,
	genreFilter,
	setGenreFilter,
	sortBy,
	setSortBy,
	loading,
	handleSearch,
}) {
	return (
		<Box component='form' onSubmit={handleSearch} sx={{ mb: 4 }}>
			<Grid
				container
				spacing={2}
				alignItems='center'
				justifyContent='center'>
				<Grid item xs={12} sm={6} md={4}>
					<TextField
						fullWidth
						value={city}
						onChange={(e) => setCity(e.target.value)}
						placeholder='Enter city name'
						label='City'
						variant='outlined'
					/>
				</Grid>
				<Grid item xs={12} sm={6} md={2}>
					<FormControl fullWidth>
						<InputLabel>Genre</InputLabel>
						<Select
							value={genreFilter}
							onChange={(e) => setGenreFilter(e.target.value)}
							label='Genre'>
							<MenuItem value='all'>All Genres</MenuItem>
							<MenuItem value='rock'>Rock</MenuItem>
							<MenuItem value='pop'>Pop</MenuItem>
							<MenuItem value='jazz'>Jazz</MenuItem>
							<MenuItem value='classical'>Classical</MenuItem>
							<MenuItem value='country'>Country</MenuItem>
							<MenuItem value='folk'>Folk</MenuItem>
							<MenuItem value='alternative'>Alternative</MenuItem>
							<MenuItem value='dance/electronic'>Dance/Electronic</MenuItem>
						</Select>
					</FormControl>
				</Grid>
				<Grid item xs={12} sm={6} md={2}>
					<FormControl fullWidth>
						<InputLabel>Sort By</InputLabel>
						<Select
							value={sortBy}
							onChange={(e) => setSortBy(e.target.value)}
							label='Sort By'>
							<MenuItem value='date'>Date</MenuItem>
							<MenuItem value='name'>Name</MenuItem>
						</Select>
					</FormControl>
				</Grid>
				<Grid item xs={12} sm={6} md={2}>
					<Button
						fullWidth
						type='submit'
						variant='contained'
						disabled={loading}
						size='large'>
						{loading ? 'Searching...' : 'Search'}
					</Button>
				</Grid>
			</Grid>
		</Box>
	);
}

export default SearchForm;
