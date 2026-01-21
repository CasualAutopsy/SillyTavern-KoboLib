import {saveSettingsDebounced} from '../../../../../script.js';
import {extension_settings} from '../../../../extensions.js';

import {getPerfInfo, getVersionInfo} from './api.js';

export async function ephemeralBNF(args, value) {
    extension_settings.kobolib.eph_bnf = {
        "grammar": value,
        "grammar_string": value
    };

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

// Performance API endpoint
// ------------------------

// Last gen token counts
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

// Total gen count
export async function getTotalGens(_,__){
    const pref = await getPerfInfo();
    return pref["total_gens"];
}

// Uptime and idle time
export async function getUpTime(_,__){
    const pref = await getPerfInfo();
    return pref["uptime"];
}
export async function getIdleTime(_,__){
    const pref = await getPerfInfo();
    return pref["idletime"];
}

// Full performance data
export async function getPerfData(_,__){
    return await getPerfInfo();
}


// Version API endpoint
// ------------------------
export async function getKoboVersion(_,__){
    const pref = await getVersionInfo();
    return pref["version"];
}

export async function getVersionData(_,__){
    return await getVersionInfo();
}
