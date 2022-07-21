import {readdir} from 'node:fs/promises';
import {join} from 'node:path';
import process from 'node:process';
import {gitIgnoreSet} from './ignoring.mjs';

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

async function directory(dir = process.cwd()) {
	let filepaths = [];
	const files = await readFiles(dir);
	let gitignorepath = join(process.cwd(), '.gitignore');
	for (const file of files) {
		if (file.name === '.gitignore') {
			gitignorepath = join(dir, file.name);
		}
	}

	const ignoreObject = await gitIgnoreSet(['.git/', '.idea/'], gitignorepath);
	const ignorePaths = ignoreObject.ignoreFileDirent(files);

	for (const file of files) {
		if (ignorePaths.includes(file)) {
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
