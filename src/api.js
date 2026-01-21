import {extension_settings} from '../../../../extensions.js';

export async function sendEmbeddingRequest(args, value) {
    const url = `${extension_settings.kobolib.url}/api/extra/embeddings`;

    let docs = value;
    try {
        docs = JSON.parse(docs);
        let check = docs.every(item => typeof item === 'string');
        if (!check) {
            throw new TypeError('');
        }
    } catch {
        if (typeof docs !== 'string') {
            throw new TypeError('Error: Input must be a string or a list of strings');
        }
    }

    const payload = {
        "model": "kcpp",
        "input": docs,
        "truncate": args.truncate_input
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

        // Retrieve the embedding info.
        let result = await response.json();

        let vector_list = [];
        result["data"].forEach(function(embed) {
            // Construct a list of embed vectors
            vector_list.push(embed["embedding"]);
        });

        return vector_list;
    } catch (e) {
        console.error('KCppLibs:',e);
    }
}



export async function convertJSONtoGrammar(args,value){
    const url = `${extension_settings.kobolib.url}/api/extra/json_to_grammar`;

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
