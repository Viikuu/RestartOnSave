import {watch} from 'node:fs';
import {spawn} from 'node:child_process';
import process from 'node:process';
import {directory} from './src/foldering.mjs';

const filedir = process.argv[2];

function killChild(child) {
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

	await console.log('--- Starting process...');
	const child = await spawn(process.execPath, [filedir], {stdio: 'inherit'});

	process.once('exit', () => {
		if (!child.killed) {
			killChild(child);
		}
	});
	child.on('close', async code => {
		if (code === null) {
			console.log('--- Killing process...\n');
			for (const watcher of watchers) {
				watcher.close();
			}

			await autoRestart(filedir);
		} else {
			console.log('--- Error occured\n--- Restarting program in 5sec...\n');
			setTimeout(async () => {
				for (const watcher of watchers) {
					watcher.close();
				}

				await autoRestart(filedir);
			}, 5000);
		}
	});
	const watchers = [];
	for (const file of projectdir) {
		watchers.push(watch(file, {
			persistent: false,
		}, () => {
			if (!child.killed) {
				killChild(child);
			}
		}));
	}
}

(async () => {
	await autoRestart();
})();

