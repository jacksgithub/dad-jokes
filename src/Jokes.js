/*
 * React app to show/get dad jokes
 */
import React, { Component } from 'react';
import axios from 'axios';
import Joke from './Joke';
import './Jokes.css';

export default class Jokes extends Component {
	static defaultProps = {
		jokesNum: 10,
		apiURL: 'https://icanhazdadjoke.com/',
	};
	constructor(props) {
		super(props);
		this.state = {
			jokes: JSON.parse(window.localStorage.getItem('dadJokes') || '[]'),
			loading: false,
		};
		// use Set to check for duplicates (faster than checking array)
		this.existingJokes = new Set(this.state.jokes.map((j) => j.id));
		this.handleClick = this.handleClick.bind(this);
	}
	async componentDidMount() {
		if (this.state.jokes.length === 0 && this.state.loading === false) {
			this.getJokes();
		}
	}
	async getJokes() {
		this.setState({ loading: true });
		try {
			let newJokes = [];
			while (newJokes.length < this.props.jokesNum) {
				let res = await axios.get(this.props.apiURL, {
					headers: {
						Accept: 'application/json',
					},
				});
				// Prevent repeating jokes
				if (!this.existingJokes.has(res.data.id)) {
					newJokes.push({
						joke: res.data.joke,
						id: res.data.id,
						votes: 0,
					});
					this.existingJokes.add(res.data.id);
				}
			}
			this.setState(
				(st) => ({
					jokes: [...st.jokes, ...newJokes],
					loading: false,
				}),
				() =>
					window.localStorage.setItem(
						'dadJokes',
						JSON.stringify(this.state.jokes)
					)
			);
		} catch (error) {
			console.error(error);
			this.setState({ loading: false });
		}
	}
	handleVote(id, delta) {
		this.setState(
			(st) => ({
				jokes: st.jokes.map((j) =>
					j.id === id ? { ...j, votes: j.votes + delta } : j
				),
			}),
			() =>
				window.localStorage.setItem(
					'dadJokes',
					JSON.stringify(this.state.jokes)
				)
		);
	}
	handleClick() {
		// Callback getJokes after setState finishes
		// this.setState({ loading: true }, this.getJokes);
		this.getJokes();
	}
	render() {
		// > 0	sort a after b; < 0	sort a before b
		const jokesSorted = this.state.jokes.sort((a, b) => b.votes - a.votes);
		const jokes = jokesSorted.map((jk) => (
			<Joke
				key={jk.id}
				id={jk.id}
				joke={jk.joke}
				votes={jk.votes}
				smiley={jk.smiley}
				upVote={() => this.handleVote(jk.id, 1)}
				downVote={() => this.handleVote(jk.id, -1)}
			/>
		));
		return (
			<div className="Jokes">
				<div className="Jokes-logo-container">
					<h1>
						<span>Dad</span> Jokes
					</h1>
					<div className="Jokes-logo">
						<img src="https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg" />
					</div>
					<div className="Jokes-btn">
						<button onClick={this.handleClick}>New Jokes</button>
					</div>
				</div>
				<div className="Jokes-container">{jokes}</div>

				{this.state.loading && (
					<div className="Jokes-spinner">
						<div className="Jokes-spinner-overlay"></div>
						<i className="far fa-8x fa-laugh fa-spin" />
						<h1 className="Jokes-title">Loading...</h1>
					</div>
				)}
			</div>
		);
	}
}
