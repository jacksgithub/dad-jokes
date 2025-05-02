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
	// Initial render
	useEffect(() => {
		if (jokes.length === 0 && loading === false) getJokes();
		existingJokes = new Set(jokes.map((j) => j.id)); // use Set to remove duplicates
	}, []);
	// On jokes state update save saved jokes to localStorage
	useEffect(() => {
		saveJokes();
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
						saved: false,
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
	// Toggle if joke is saved
	const handleSaveToggle = (idToUpdate: string) => {
		const updatedJokes = jokes.map((j) =>
			j.id === idToUpdate ? { ...j, saved: !j.saved } : j
		);
		setJokes(updatedJokes);
	};
	// Get New/More Jokes button
	const handleClickNewJokes = () => {
		getJokes();
	};
	// Clear all (unsaved) jokes
	const handleClickClearJokes = () => {
		setJokes(saveJokes());
	};
	// Save Jokes (to local storage)
	const saveJokes = () => {
		// Update localStorage when jokes update in state
		const savedJokes = jokes.filter((j) => j.saved === true);
		localStorage.setItem('dadJokes', JSON.stringify(savedJokes));
		return savedJokes;
	};
	// Check if we need to add active class to joke to fade it in when it moves position
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
			saved={jk.saved}
			handleVote={handleVote}
			handleSaveToggle={handleSaveToggle}
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
				<p className="Jokes-note">Click on a joke to toggle saving it.</p>
				<div className="Jokes-btn">
					<button onClick={handleClickNewJokes}>Load Jokes</button>
				</div>
				<div className="Jokes-btn2">
					<button onClick={handleClickClearJokes}>Clear Jokes</button>
				</div>
			</div>
			<div className="Jokes-container">{jokesSortedComponents}</div>

			{loading && (
				<div className="Jokes-spinner">
					<div className="Jokes-spinner-overlay"></div>
					{/* <i className="far fa-8x fa-laugh fa-spin" /> */}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 512 512"
						className="fa-spin fa-laugh"
					>
						<path
							fill="#9370db"
							d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM388.1 312.8c12.3-3.8 24.3 6.9 19.3 18.7C382.4 390.6 324.2 432 256.3 432s-126.2-41.4-151.1-100.5c-5-11.8 7-22.5 19.3-18.7c39.7 12.2 84.5 19 131.8 19s92.1-6.8 131.8-19zm-170.5-84s0 0 0 0c0 0 0 0 0 0l-.2-.2c-.2-.2-.4-.5-.7-.9c-.6-.8-1.6-2-2.8-3.4c-2.5-2.8-6-6.6-10.2-10.3c-8.8-7.8-18.8-14-27.7-14s-18.9 6.2-27.7 14c-4.2 3.7-7.7 7.5-10.2 10.3c-1.2 1.4-2.2 2.6-2.8 3.4c-.3 .4-.6 .7-.7 .9l-.2 .2c0 0 0 0 0 0c0 0 0 0 0 0s0 0 0 0c-2.1 2.8-5.7 3.9-8.9 2.8s-5.5-4.1-5.5-7.6c0-17.9 6.7-35.6 16.6-48.8c9.8-13 23.9-23.2 39.4-23.2s29.6 10.2 39.4 23.2c9.9 13.2 16.6 30.9 16.6 48.8c0 3.4-2.2 6.5-5.5 7.6s-6.9 0-8.9-2.8c0 0 0 0 0 0s0 0 0 0zm160 0c0 0 0 0 0 0l-.2-.2c-.2-.2-.4-.5-.7-.9c-.6-.8-1.6-2-2.8-3.4c-2.5-2.8-6-6.6-10.2-10.3c-8.8-7.8-18.8-14-27.7-14s-18.9 6.2-27.7 14c-4.2 3.7-7.7 7.5-10.2 10.3c-1.2 1.4-2.2 2.6-2.8 3.4c-.3 .4-.6 .7-.7 .9l-.2 .2c0 0 0 0 0 0c0 0 0 0 0 0s0 0 0 0c-2.1 2.8-5.7 3.9-8.9 2.8s-5.5-4.1-5.5-7.6c0-17.9 6.7-35.6 16.6-48.8c9.8-13 23.9-23.2 39.4-23.2s29.6 10.2 39.4 23.2c9.9 13.2 16.6 30.9 16.6 48.8c0 3.4-2.2 6.5-5.5 7.6s-6.9 0-8.9-2.8c0 0 0 0 0 0s0 0 0 0s0 0 0 0z"
						/>
					</svg>
					<h1 className="Jokes-title">Loading...</h1>
				</div>
			)}
		</div>
	);
}
