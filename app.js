const fs = require("fs");
const path = require('path');
const { spawn } = require('child_process');
const {directory} = require('./src/foldering');

const filedir = process.argv[2];

async function autoRes(){
    const projectdir = process.argv[3] === undefined ? [filedir]:await directory(process.argv[3]);
    await console.log("Starting process...");
    const child = await spawn(process.execPath,[filedir],{stdio: "inherit",});


    process.addListener('exit',()=>
    {
        if(!child.killed) child.kill();
    });
    child.on('close', async (code) => {
        child.kill();
        if(code===null) await autoRes(filedir);
    });
    for (const file of projectdir) {
        await fs.watchFile(file, {
                persistent: false,
                interval: 5000,
            },
            (eventType, filename) => {
                if (!child.killed) {
                    console.log(`Killing process...`);
                    child.kill();
                }
            });
    }
}


(async()=>{
    try {
        await autoRes();

    }
    catch(e){

        throw (e);


    }
})();

