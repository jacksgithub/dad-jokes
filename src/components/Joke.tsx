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
		const thresholds = [
			{ min: 15, color: '#4CAF50' },
			{ min: 12, color: '#8BC34A' },
			{ min: 9, color: '#CDDC39' },
			{ min: 6, color: '#FFEB3B' },
			{ min: 3, color: '#FFC107' },
			{ min: 0, color: '#FF9800' },
		];

		for (const threshold of thresholds) {
			if (votes >= threshold.min) {
				return threshold.color;
			}
		}

		return '#f44336'; // For votes < 0
	};

	// Emoji based on vote count
	const getEmoji = () => {
		const emojiThresholds = [
			{ min: 15, emoji: 'em em-rolling_on_the_floor_laughing' },
			{ min: 12, emoji: 'em em-laughing' },
			{ min: 9, emoji: 'em em-smiley' },
			{ min: 6, emoji: 'em em-slightly_smiling_face' },
			{ min: 3, emoji: 'em em-neutral_face' },
			{ min: 0, emoji: 'em em-confused' },
		];

		for (const threshold of emojiThresholds) {
			if (votes >= threshold.min) {
				return threshold.emoji;
			}
		}

		return 'em em-angry'; // For votes < 0
	};

	// Build the class list as an array and filter out any false values, then join it into a string.
	const getClasses = () => {
		return ['Joke', active && 'active', saved && 'saved']
			.filter(Boolean)
			.join(' ');
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
