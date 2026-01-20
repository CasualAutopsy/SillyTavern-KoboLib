import { saveSettingsDebounced } from '../../../../../script.js';
import { extension_settings } from "/scripts/extensions.js";

export async function ephemeralBNF(args, value) {
    extension_settings.kcpplibs.eph_bnf = {
        "grammar": value,
        "grammar_string": value
    }

    saveSettingsDebounced();
}


export async function clearEphemeralBNF(args){
    extension_settings.kcpplibs.eph_bnf = "";

    saveSettingsDebounced();
}

export async function sendBNF(args){
    if (extension_settings.kcpplibs.eph_bnf !== "") {
        Object.assign(args, extension_settings.kcpplibs.eph_bnf);
    }
}
