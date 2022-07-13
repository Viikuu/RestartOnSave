import fs from 'node:fs';
import {spawn} from 'node:child_process';
import process from 'node:process';
import {directory} from './src/foldering.mjs';

const filedir = process.argv[2];

function killchild(child) {
	child.once('exit', () => {
		clearInterval(killTimeout);
	});
	const killTimeout = setTimeout(() => {
		child.kill();
	}, 3000);

	child.kill('SIGINT');
}

async function autoRestart() {
	const projectdir = process.argv[3] === undefined
		? [filedir]
		: await directory(process.argv[3]);

	await console.log('---Starting process...');
	const child = await spawn(process.execPath, [filedir], {stdio: 'inherit'});

	process.addListener('exit', () => {
		if (!child.killed) {
			killchild(child);
		}
	});
	child.on('close', async code => {
		if (code === null) {
			await autoRestart(filedir);
		}
	});
	for (const file of projectdir) {
		fs.watch(file, {
			persistent: false,
		}, () => {
			if (!child.killed) {
				console.log('---Killing process...\n');
				killchild(child);
			}
		});
	}
}

(async () => {
	await autoRestart();
})();

