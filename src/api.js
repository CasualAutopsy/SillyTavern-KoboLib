import {extension_settings} from '../../../../extensions.js';

/*
export async function sendEmbeddingRequest(args, value) {
    const url = `${extension_settings.kcpplibs.url}/api/extra/embeddings`;

    const payload = {
        "model": "kcpp",
        "input": value,
        "truncate": args.truncate
    };

    const header = {
        "accept": "application/json",
        "Content-Type": "application/json"
    };


    try {
        const response = await fetch(url, {
            method: "POST",
            headers: header,
            body: JSON.stringify(payload)
        });

        return await response.json();
    } catch (e) {
        console.error('KCppLibs:',e);
    }
}
*/



export async function convertJSONtoGrammar(args,value){
    const url = `${extension_settings.kcpplibs.url}/api/extra/json_to_grammar`;

    const payload = {
        "schema": JSON.parse(value)
    };

    const header = {
        "accept": "application/json",
        "Content-Type": "application/json"
    };


    try {
        const response = await fetch(url, {
            method: "POST",
            headers: header,
            body: JSON.stringify(payload)
        });

        let result = await response.json();
        result = result["result"];

        return result;
    } catch (e) {
        console.error('KCppLibs:',e);
    }
}
