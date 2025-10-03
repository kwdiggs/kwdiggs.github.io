import { Table } from '../scripts/Table.js';
import * as Ui from '../scripts/UiHelper.js';


function init() {
	const table = new Table();
	table.setTable();

	Ui.buildTableStatic(table);
	Ui.makeUpcards(table.completeDeck);

	window.print();
}

init();
