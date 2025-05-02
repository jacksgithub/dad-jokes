import './Joke.css';

interface IJokeProps {
	id: string;
	joke: string;
	votes: number;
	active: boolean;
	saved: boolean;
	handleVote: (id: string, delta: number) => void;
	handleSaveToggle: (id: string) => void;
}

export default function Joke({
	id,
	joke,
	votes,
	active,
	saved,
	handleVote,
	handleSaveToggle,
}: IJokeProps) {
	// Color for vote count circle
	const getColor = () => {
		if (votes >= 15) {
			return '#4CAF50';
		} else if (votes >= 12) {
			return '#8BC34A';
		} else if (votes >= 9) {
			return '#CDDC39';
		} else if (votes >= 6) {
			return '#FFEB3B';
		} else if (votes >= 3) {
			return '#FFC107';
		} else if (votes >= 0) {
			return '#FF9800';
		} else {
			return '#f44336';
		}
	};
	// Emoji based on vote count
	const getEmoji = () => {
		if (votes >= 15) {
			return 'em em-rolling_on_the_floor_laughing';
		} else if (votes >= 12) {
			return 'em em-laughing';
		} else if (votes >= 9) {
			return 'em em-smiley';
		} else if (votes >= 6) {
			return 'em em-slightly_smiling_face';
		} else if (votes >= 3) {
			return 'em em-neutral_face';
		} else if (votes >= 0) {
			return 'em em-confused';
		} else {
			return 'em em-angry';
		}
	};
	const getClasses = () => {
		let classes = 'Joke';
		if (active) classes += ' active';
		if (saved) classes += ' saved';
		return classes;
	};

	return (
		<div className={getClasses()}>
			<span className="Joke-rating">
				<span className="Joke-num" style={{ borderColor: getColor() }}>
					{votes}
				</span>
				<span className="Joke-vote-container">
					{votes < 15 && (
						<span className="Joke-upVote" onClick={() => handleVote(id, 1)}>
							&uarr;
						</span>
					)}
					<span className="Joke-downVote" onClick={() => handleVote(id, -1)}>
						&darr;
					</span>
				</span>
			</span>
			<span className="Joke-text" onClick={() => handleSaveToggle(id)}>
				{joke}
				<i className="em em---1" aria-label="THUMBS UP SIGN"></i>
				<i className="em em--1" aria-label="THUMBS DOWN SIGN"></i>
			</span>
			<span className="Joke-smiley">
				<i className={getEmoji()} />
			</span>
		</div>
	);
}
