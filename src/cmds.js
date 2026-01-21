import {saveSettingsDebounced} from '../../../../../script.js';
import {extension_settings} from '../../../../extensions.js';

import {getPerfInfo} from './api.js';

export async function ephemeralBNF(args, value) {
    extension_settings.kobolib.eph_bnf = {
        "grammar": value,
        "grammar_string": value
    }

    saveSettingsDebounced();
}


export async function clearEphemeralBNF(args){
    extension_settings.kobolib.eph_bnf = "";

    saveSettingsDebounced();
}

export async function sendBNF(args){
    if (extension_settings.kobolib.eph_bnf !== "") {
        Object.assign(args, extension_settings.kobolib.eph_bnf);
    }
}


export async function getTokenCount(_,__){
    const pref = await getPerfInfo();
    return pref["last_token_count"];
}
export async function getInputCount(_,__){
    const pref = await getPerfInfo();
    return pref["last_input_count"];
}
export async function getTotalCount(_,__){
    const pref = await getPerfInfo();
    return pref["last_token_count"] + pref["last_input_count"];
}
