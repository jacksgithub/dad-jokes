/*
 * React app to show/get dad jokes
 */
import { useEffect, useState } from 'react';
import IJoke from '../models/joke';
import axios from 'axios';
import Joke from './Joke';
import './Jokes.css';
import smiley1 from '../assets/smiley1.svg';

interface IJokes {
	jokesNum: number;
	apiURL: string;
}

export default function Jokes({ jokesNum, apiURL }: IJokes) {
	let existingJokes = new Set(); // IDs of jokes currently displayed

	// State
	const [jokes, setJokes] = useState<IJoke[]>(
		JSON.parse(localStorage.getItem('dadJokes') || '[]')
	);
	const [loading, setLoading] = useState(false);

	// Hooks
	useEffect(() => {
		if (jokes.length === 0 && loading === false) getJokes();
		existingJokes = new Set(jokes.map((j) => j.id)); // use Set to remove duplicates
	}, []);
	useEffect(() => {
		// Update localStorage when jokes update in state
		localStorage.setItem('dadJokes', JSON.stringify(jokes));
	}, [jokes]);

	const getJokes = async () => {
		setLoading(true);
		try {
			let newJokes = [];
			while (newJokes.length < jokesNum) {
				let res = await axios.get(apiURL, {
					headers: {
						Accept: 'application/json',
					},
				});
				// Prevent repeating jokes
				if (!existingJokes.has(res.data.id)) {
					newJokes.push({
						joke: res.data.joke,
						id: res.data.id,
						votes: 0,
						active: false,
					});
					existingJokes.add(res.data.id);
				}
			}
			setJokes((jokes) => [...jokes, ...newJokes]);
		} catch (error) {
			console.error(error);
			// setLoading(false);
		}
		setLoading(false);
	};
	const handleVote = (idToUpdate: string, delta: number) => {
		const updatedJokes = jokes.map((j, idx) =>
			j.id === idToUpdate
				? { ...j, votes: j.votes + delta, active: isActive(idx, delta) }
				: { ...j, active: false }
		);
		// > 0	sort a after b; < 0	sort a before b
		const jokesSorted = updatedJokes.sort((a, b) => b.votes - a.votes);
		setJokes(jokesSorted);
	};
	const handleClickNewJokes = () => {
		getJokes();
	};
	const handleClickClearJokes = () => {
		setJokes([]);
	};
	// Do we need to add active class to joke to fade it in when it moves position
	const isActive = (idx: number, delta: number) => {
		let isActive = false;
		// Add class if upvoting & joke before has same vote count
		if (delta === 1 && idx > 0 && jokes[idx - 1].votes == jokes[idx].votes)
			isActive = true;
		// Add class if downvoting & joke after has same vote count
		if (
			delta === -1 &&
			idx < jokes.length - 1 &&
			jokes[idx + 1].votes == jokes[idx].votes
		)
			isActive = true;
		return isActive;
	};

	const jokesSortedComponents = jokes.map((jk) => (
		<Joke
			key={jk.id}
			id={jk.id}
			joke={jk.joke}
			votes={jk.votes}
			active={jk.active}
			handleVote={handleVote}
		/>
	));

	return (
		<div className="Jokes">
			<div className="Jokes-logo-container">
				<h1>
					<span>Dad</span> Jokes
				</h1>
				<div className="Jokes-logo">
					<img src={smiley1} />
				</div>
				<div className="Jokes-btn">
					<button onClick={handleClickNewJokes}>New Jokes</button>
				</div>
				<div className="Jokes-btn2">
					<button onClick={handleClickClearJokes}>Clear Jokes</button>
				</div>
			</div>
			<div className="Jokes-container">{jokesSortedComponents}</div>

			{loading && (
				<div className="Jokes-spinner">
					<div className="Jokes-spinner-overlay"></div>
					<i className="far fa-8x fa-laugh fa-spin" />
					<h1 className="Jokes-title">Loading...</h1>
				</div>
			)}
		</div>
	);
}
