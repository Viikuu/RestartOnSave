import {readdir, readFile, stat, writeFile} from 'node:fs/promises';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import process from 'node:process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function ignorePathsSet(ignorePath, ignoreFiles, ignorePriority) {
	try {
		JSON.parse(await readFile(ignorePath, 'utf8'));
	} catch {
		await writeFile(ignorePath, JSON.stringify(ignoreFiles));
	}

	const data = JSON.parse(await readFile(ignorePath, 'utf8'));

	if (data !== ignoreFiles && !ignorePriority) {
		return ignoreFiles;
	}

	return data;
}

async function readFiles(dir) {
	try {
		await readdir(dir);
	} catch (error) {
		throw new Error(`This directory does not exist (or program has no access to it)
           Given Directory: ${dir}
           Er Code: ${error.code}
           Check directory!`);
	}

	return readdir(dir);
}

const optionsConst = {
	ignorePath: join(__dirname, 'ignorePaths.json'),
	ignoreFiles: ['node_modules', 'public', '.idea', '.git', '.gitignore'], // Ignored files names
	ignore: true, // Turning on ignoring files
	ignorePriority: true, // True for file, false for option arg
};

async function directory(dir = process.cwd(), options = optionsConst) {
	let filepaths = [];
	const files = await readFiles(dir);
	const ignorePaths = options.ignore
		? await ignorePathsSet(options.ignorePath, options.ignoreFiles, options.ignorePriority)
		: '';

	for (const file of files) {
		if (!ignorePaths.includes(file)) {
			const filestat = await stat(join(dir, file));

			if (filestat.isFile()) {
				filepaths.push(join(dir, file));
			} else if (filestat.isDirectory()) {
				filepaths = filepaths.concat(await directory(join(dir, file)));
			}
		}
	}

	return filepaths;
}

export {
	directory,
};
