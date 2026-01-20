import {event_types, eventSource, saveSettingsDebounced} from '../../../../script.js';
import {extension_settings} from '../../../extensions.js';

import {SlashCommandParser} from '../../../slash-commands/SlashCommandParser.js';
import {SlashCommand} from '../../../slash-commands/SlashCommand.js';
import {
    ARGUMENT_TYPE,
    SlashCommandArgument,
    SlashCommandNamedArgument
} from '../../../slash-commands/SlashCommandArgument.js';

import {convertJSONtoGrammar} from './src/api.js'
import {clearEphemeralBNF, ephemeralBNF, sendBNF} from "./src/cmds.js";

async function loadSettings()
{
    if ( ! extension_settings.kcpplibs )
        extension_settings.kcpplibs = { "url": "http://127.0.0.1:5001", "eph_bnf": "" };
    if ( ! extension_settings.kcpplibs.url )
        extension_settings.kcpplibs.url = "http://127.0.0.1:5001";
    if ( ! extension_settings.kcpplibs.url )
        extension_settings.kcpplibs.eph_bnf = "";

    saveSettingsDebounced();
}


function trimTrailingSlash(str) {
    return str.endsWith('/') ? str.replace(/\/+$/, '') : str;
}

function onKoboldURLChanged() {
    extension_settings.kcpplibs.url = trimTrailingSlash($(this).val())
    saveSettingsDebounced();
}




/*
SlashCommandParser.addCommandObject(SlashCommand.fromProps({
    name: "kcpp-vectorize",
    aliases: ["kcpp-embed", "kcpp-embedding"],
    callback: sendEmbeddingRequest,
    namedArgumentList: SlashCommandNamedArgument.fromProps({
        name: "truncate",
        description: "",
        typeList: [ARGUMENT_TYPE.BOOLEAN],
        isRequired: false,
        acceptsMultiple: false,
        default: true,
    }),
    unnamedArgumentList: SlashCommandArgument.fromProps({
        description: "",
        typeList: [ARGUMENT_TYPE.LIST, ARGUMENT_TYPE.STRING],
        isRequired: true,
        acceptsMultiple: false
    }),
    splitUnnamedArgument: false,
    helpString: '',
    returns: "Dictionary containing embedding vectors"
}));
*/

SlashCommandParser.addCommandObject(SlashCommand.fromProps({
    name: "kcpp-json-to-grammar",
    aliases: ["kcpp-schema-to-grammar", "kcpp-json-to-bnf"],
    callback: convertJSONtoGrammar,
    unnamedArgumentList: [
        SlashCommandArgument.fromProps({
            description: "JSON Schema",
            typeList: [ARGUMENT_TYPE.DICTIONARY],
            isRequired: true
        })
    ],
    splitUnnamedArgument: false,
    helpString: 'Convert JSON Schemas into BNF grammars using Kobold\'s `/api/extra/json_to_grammar` endpoint.',
    returns: "String - BNF grammar string"
}));





SlashCommandParser.addCommandObject(SlashCommand.fromProps({
    name: "ephemeral-bnf",
    aliases: ["eph-bnf"],
    callback: ephemeralBNF,
    unnamedArgumentList: [
        SlashCommandArgument.fromProps({
            description: "BNF grammar string",
            typeList: [ARGUMENT_TYPE.STRING],
            isRequired: true
        })
    ],
    splitUnnamedArgument: false,
    helpString: 'Set the grammar string for the next generation request.\n(G/E)BNF Sampler parameters are reset upon finishing a gen request.'
}));





function registerEvents() {
    eventSource.on(event_types.TEXT_COMPLETION_SETTINGS_READY, sendBNF);
    eventSource.on(event_types.GENERATION_ENDED, clearEphemeralBNF);
}

jQuery(async () => {
    const html =`
    <div class="kcpplib_settings">
        <div class="inline-drawer">
            <div class="inline-drawer-toggle inline-drawer-header">
                <b>KCPP Library</b>
                <div class="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div>
            </div>
            <div class="inline-drawer-content">
                <div class="flex-container flexFlowColumn">
                    <h4>KoboldCPP API URL</h4>
                    <input id="kcpplib_api_url" class="text_pole textarea_compact" type="text" />
                </div>
            </div>
        </div>
    </div>`;

    await loadSettings();
    $('#extensions_settings').append(html);
    $('#kcpplib_api_url').val(extension_settings.kcpplibs.url).on('input',onKoboldURLChanged);

    registerEvents();
});
