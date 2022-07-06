const {stat,readdir,readFile,writeFile} = require('fs').promises;
const {join} = require('path');

async function ignorePathsSet(ignorePath,ignoreFiles){
    try {
        await readFile(ignorePath, 'utf8');
    }
    catch {
        writeFile(ignorePath,JSON.stringify(ignoreFiles));
    }

    return JSON.parse(await readFile(ignorePath, 'utf8'));

}

async function readFiles(dir){
    try{
        await readdir(dir);
    }
    catch (e){
        throw(`This directory does not exist (or program has no access to it)
           Given Directory: ${dir}
           Er Code: ${e.code}
           Check directory!`);
    }
    return await readdir(dir);
}

async function directory(dir = process.cwd(),options = {ignorePath : join(__dirname,"ignorePaths.json"),ignoreFiles : [ "node_modules", "public", ".idea" ],ignore:true}){
    let filepaths = [];
    const files = await readFiles(dir);
    const ignorePaths = options.ignore ? await ignorePathsSet(options.ignorePath,options.ignoreFiles) : "";
    for (const file of files){
        if(!ignorePaths.includes(file)) {
            const filestat = await stat(join(dir,file));
            if (filestat.isFile()) {
                filepaths.push(join(dir,file));
            } else if (filestat.isDirectory()) {
                filepaths =  filepaths.concat(await directory(join(dir,file)));
            }
        }
    }
    return filepaths;

}

module.exports ={
    directory,
};


