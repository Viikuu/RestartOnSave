import {readFile} from 'node:fs/promises';

class GitIgnoreParser {
	constructor(GitIgnorePath) {
		this.GitIgnorePath = GitIgnorePath;
		this.IgnoredFiles = [];
	}

	async _getIgnore() {
		this.IgnoredFiles = (await readFile(this.GitIgnorePath, 'utf8'))
			.split('\r\n')
			.filter(line => (!line.startsWith('#')
				&& line !== ''
				&& !line.includes('[')
				&& !line.includes(']')
			));
		this._setAll();
	}

	_setDirIgnore() {
		this.DirIgnore = this.IgnoredFiles
			.filter(line => line.includes('/'))
			.map(line => line.slice(0, line.indexOf('/')));
	}

	_setStartIgnore() {
		this.StartIgnore = this.IgnoredFiles.filter(line => line.endsWith('*'));
	}

	_setEndIgnore() {
		this.EndIgnore = this.IgnoredFiles.filter(line => line.startsWith('*'));
	}

	_setElseIgnore() {
		this.ElseIgnore = this.IgnoredFiles.filter(line => !line.endsWith('/')
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
		for (const element of this.StartIgnore) {
			if (stringElement.startsWith(element)) {
				return false;
			}
		}

		return true;
	}

	endsWithPattern(stringElement) {
		for (const element of this.EndIgnore) {
			if (stringElement.endsWith(element)) {
				return false;
			}
		}

		return true;
	}

	dirPatternString(stringElement) {
		for (const element of this.DirIgnore) {
			if (stringElement === element) {
				return false;
			}
		}

		return true;
	}

	elsePattern(stringElement) {
		return !this.ElseIgnore.includes(stringElement);
	}

	addPattern(Elements) {
		this.IgnoredFiles = this.IgnoredFiles.concat(Elements);
		this._setAll();
	}

	ignoreString(StringArray) {
		return StringArray.filter((element => this.elsePattern(element)
				&& this.startsWithPattern(element)
				&& this.endsWithPattern(element)
				&& this.dirPatternString(element)),
		);
	}

	ignoreFileDirent(DirentArray) {
		return [].concat(
			DirentArray
				.filter(element => element.isDirectory())
				.filter(element => this.dirPatternString(element.name)),
			DirentArray
				.filter(element => element.isFile())
				.filter(element => this.elsePattern(element.name)
					&& this.startsWithPattern(element.name)
					&& this.endsWithPattern(element.name)),
		);
	}
}

async function gitIgnoreSet(AdditionalElementsArray = [], gitignorepath) {
	const GitIgnore = new GitIgnoreParser(gitignorepath);
	await GitIgnore._getIgnore();
	GitIgnore.addPattern(AdditionalElementsArray);
	return GitIgnore;
}

export {
	gitIgnoreSet,
};
