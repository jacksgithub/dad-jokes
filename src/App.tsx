// import logo from './logo.svg';
import './App.css';
import Jokes from './components/Jokes';

const options = {
	jokesNum: 10,
	apiURL: 'https://icanhazdadjoke.com/',
};

function App() {
	return (
		<div className="App">
			<Jokes jokesNum={options.jokesNum} apiURL={options.apiURL} />
		</div>
	);
}

export default App;
