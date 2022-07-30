import {readFile} from 'node:fs/promises';

class GitIgnoreParser {
	constructor(gitIgnorePath) {
		this.gitIgnorePath = gitIgnorePath;
		this.ignoredFiles = [];
	}

	async _getIgnore() {
		this.ignoredFiles = (await readFile(this.gitIgnorePath, 'utf8'))
			.split('\r\n')
			.filter(line => (!line.startsWith('#')
				&& line !== ''
				&& !line.includes('[')
				&& !line.includes(']')
			));
		this._setAll();
	}

	_setDirIgnore() {
		this.dirIgnore = this.ignoredFiles
			.filter(line => line.includes('/'))
			.map(line => line.slice(0, line.indexOf('/')));
	}

	_setStartIgnore() {
		this.startIgnore = this.ignoredFiles.filter(line => line.endsWith('*'));
	}

	_setEndIgnore() {
		this.endIgnore = this.ignoredFiles.filter(line => line.startsWith('*'));
	}

	_setElseIgnore() {
		this.elseIgnore = this.ignoredFiles.filter(line => !line.endsWith('/')
			&& !line.endsWith('*')
			&& !line.startsWith('*')
			&& !line.includes('/')
		);
	}

	_setAll() {
		this._setDirIgnore();
		this._setElseIgnore();
		this._setEndIgnore();
		this._setStartIgnore();
	}

	startsWithPattern(stringElement) {
		for (const element of this.startIgnore) {
			if (stringElement.startsWith(element)) {
				return false;
			}
		}

		return true;
	}

	endsWithPattern(stringElement) {
		for (const element of this.endIgnore) {
			if (stringElement.endsWith(element)) {
				return false;
			}
		}

		return true;
	}

	dirPatternString(stringElement) {
		for (const element of this.dirIgnore) {
			if (stringElement === element) {
				return false;
			}
		}

		return true;
	}

	elsePattern(stringElement) {
		return !this.elseIgnore.includes(stringElement);
	}

	addPattern(elements) {
		this.ignoredFiles = this.ignoredFiles.concat(elements);
		this._setAll();
	}

	ignoreString(stringArray) {
		return stringArray.filter((element => this.elsePattern(element)
				&& this.startsWithPattern(element)
				&& this.endsWithPattern(element)
				&& this.dirPatternString(element)),
		);
	}

	ignoreFileDirent(direntArray) {
		return [].concat(
			direntArray
				.filter(element => element.isDirectory())
				.filter(element => this.dirPatternString(element.name)),
			direntArray
				.filter(element => element.isFile())
				.filter(element => this.elsePattern(element.name)
					&& this.startsWithPattern(element.name)
					&& this.endsWithPattern(element.name)),
		);
	}
}

async function gitIgnoreSet(additionalElementsArray = [], gitignorepath) {
	const gitIgnore = new GitIgnoreParser(gitignorepath);
	await gitIgnore._getIgnore();
	gitIgnore.addPattern(additionalElementsArray);
	return gitIgnore;
}

export {
	gitIgnoreSet,
};
