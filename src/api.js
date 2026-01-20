import {extension_settings} from '../../../../extensions.js';

export async function sendEmbeddingRequest(args, value) {
    const url = `${extension_settings.kcpplibs.url}/api/extra/embeddings`;

    let docs = value;
    if (typeof docs !== 'string') { // Parse list if un-named arg isn't a string
        docs = JSON.parse(docs);
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

        if (args.vectors) { // If enabled, then only retrieve the vectors
            result = result["data"];

            let vectors = [];
            result.forEach(function(vec) {
                vectors.push(vec["embedding"])
            });
            return vectors;
        }
        return await response.json();
    } catch (e) {
        console.error('KCppLibs:',e);
    }
}



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
