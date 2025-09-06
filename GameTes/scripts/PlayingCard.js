export class PlayingCard {
 //{1, 2, 3..., 81}
	id;

	// {A, B, C}
	letter;

	// {1, 2, 3}
	count;

	// {Positive, Negative, Zero}
	rotation;

	// {Solid, Dotted, None}
	border;

	constructor(id, letter, count, rotation, border) {
		this.id = id;
		this.letter = letter;
		this.count = count;
		this.rotation = rotation;
		this.border = border;
	}
}
