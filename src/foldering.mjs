import {readdir, readFile} from 'node:fs/promises';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import process from 'node:process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function ignorePathsSet(ignorePath) { // Reading ignorePaths config
	try {
		JSON.parse(await readFile(ignorePath, 'utf8'));
	} catch {
		throw new Error([
			'Config does not exist!',
			`ignorePath.json file (${ignorePath}) does not exist!`,
			'Create ignorePath.json config in src directory!',
		].join('\n'));
	}

	return JSON.parse(await readFile(ignorePath, 'utf8'));
}

async function readFiles(dir) {
	try {
		await readdir(dir, {
			withFileTypes: true,
		});
	} catch (error) {
		throw new Error([
			'This directory does not exist (or program has no access to it)',
			`Given Directory: ${dir}`,
			`Er Code: ${error.code}`,
			'Check directory!',
		].join('\n'));
	}

	return readdir(dir, {
		withFileTypes: true,
	});
}

const optionsConst = {
	ignoreConfigPath: join(__dirname, 'ignorePaths.json'),
	ignore: true, // Turning on ignoring files
};

async function directory(dir = process.cwd(), options = optionsConst) {
	let filepaths = [];
	const files = await readFiles(dir);
	const ignorePaths = options.ignore
		? await ignorePathsSet(options.ignoreConfigPath)
		: [];

	for (const file of files) {
		if (!ignorePaths.includes(file.name)) {
			if (file.isFile()) {
				filepaths.push(join(dir, file.name));
			} else if (file.isDirectory()) {
				filepaths = filepaths.concat(await directory(join(dir, file.name)));
			}
		}
	}

	return filepaths;
}

export {
	directory,
};
