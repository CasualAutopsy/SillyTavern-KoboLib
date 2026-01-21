import {event_types, eventSource, saveSettingsDebounced} from '../../../../script.js';
import {extension_settings} from '../../../extensions.js';

import {SlashCommandParser} from '../../../slash-commands/SlashCommandParser.js';
import {SlashCommand} from '../../../slash-commands/SlashCommand.js';
import {
    ARGUMENT_TYPE,
    SlashCommandArgument,
    SlashCommandNamedArgument
} from '../../../slash-commands/SlashCommandArgument.js';

import {convertJSONtoGrammar, sendEmbeddingRequest} from './src/api.js';
import {
    clearEphemeralBNF, ephemeralBNF,
    sendBNF, getTotalCount,
    getTokenCount, getInputCount,
    getTotalGens, getUpTime,
    getIdleTime, getKoboVersion,
    getPerfData, getVersionData
} from "./src/cmds.js";


const extensionName = 'SillyTavern-KoboLib';
const extensionFolder = `scripts/extensions/third-party/${extensionName}`;


async function loadSettings()
{
    if ( ! extension_settings.kobolib )
        extension_settings.kobolib = { "url": "http://127.0.0.1:5001", "eph_bnf": "" };
    if ( ! extension_settings.kobolib.url )
        extension_settings.kobolib.url = "http://127.0.0.1:5001";
    if ( ! extension_settings.kobolib.url )
        extension_settings.kobolib.eph_bnf = "";

    saveSettingsDebounced();
}


function trimTrailingSlash(str) {
    return str.endsWith('/') ? str.replace(/\/+$/, '') : str;
}

function onKoboldURLChanged() {
    extension_settings.kobolib.url = trimTrailingSlash($(this).val());
    saveSettingsDebounced();
}

// Embedding commands
SlashCommandParser.addCommandObject(SlashCommand.fromProps({
    name: "kcpp-vectorize",
    aliases: ["kcpp-embed", "kcpp-embedding"],
    callback: sendEmbeddingRequest,
    namedArgumentList: [
        SlashCommandNamedArgument.fromProps({
            name: "truncate_input",
            aliases: ["truncate", "trunc"],
            description: "",
            typeList: [ARGUMENT_TYPE.BOOLEAN],
            isRequired: false,
            acceptsMultiple: false,
            defaultValue: true
        })
    ],
    unnamedArgumentList: [
        SlashCommandArgument.fromProps({
            description: "A string or list of strings to encode into embedding vectors",
            typeList: [ARGUMENT_TYPE.LIST, ARGUMENT_TYPE.STRING],
            isRequired: true,
            acceptsMultiple: false
        })
    ],
    splitUnnamedArgument: false,
    helpString: '',
    returns: "List containing embedding vectors"
}));


// BNF commands
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

// Token Count Commands
SlashCommandParser.addCommandObject(SlashCommand.fromProps({
    name: "last-token-input",
    aliases: ["kcpp-token-input", "last-input-count"],
    callback: getInputCount,
    helpString: 'Get the prompt token count from the previous generation request.',
    returns: "Number of tokens"
}));

SlashCommandParser.addCommandObject(SlashCommand.fromProps({
    name: "last-token-output",
    aliases: ["kcpp-token-output", "last-token-count"],
    callback: getTokenCount,
    helpString: 'Get the generated token count from the last generation request.',
    returns: "Number of tokens"
}));

SlashCommandParser.addCommandObject(SlashCommand.fromProps({
    name: "last-token-total",
    aliases: ["kcpp-token-total", "last-total-count"],
    callback: getTotalCount,
    helpString: 'Get the total token count from the last generation request.',
    returns: "Number of tokens"
}));

SlashCommandParser.addCommandObject(SlashCommand.fromProps({
    name: "kcpp-gen-count",
    callback: getTotalGens,
    helpString: 'Get the total amount of completed generation request since booting up KoboldCpp.',
    returns: "Number of generations"
}));

SlashCommandParser.addCommandObject(SlashCommand.fromProps({
    name: "kcpp-uptime",
    callback: getUpTime,
    helpString: 'Get the total KoboldCpp uptime in seconds.',
    returns: "Uptime in seconds"
}));

SlashCommandParser.addCommandObject(SlashCommand.fromProps({
    name: "kcpp-idle-time",
    callback: getIdleTime,
    helpString: 'Get the idle time since the last generation request in seconds.',
    returns: "Idle time in seconds"
}));

SlashCommandParser.addCommandObject(SlashCommand.fromProps({
    name: "kcpp-get-version",
    callback: getKoboVersion,
    helpString: 'Get the current version of KoboldCpp in use.',
    returns: "String of current KCpp version."
}));


SlashCommandParser.addCommandObject(SlashCommand.fromProps({
    name: "kcpp-perf-data",
    callback: getPerfData,
    helpString: 'Get the performance data from Kobold.',
    returns: "Object containing performance data"
}));

SlashCommandParser.addCommandObject(SlashCommand.fromProps({
    name: "kcpp-ver-data",
    callback: getVersionData,
    helpString: 'Get the version data from Kobold.',
    returns: "Object containing version data"
}));



function registerEvents() {
    eventSource.on(event_types.TEXT_COMPLETION_SETTINGS_READY, sendBNF);
    eventSource.on(event_types.GENERATION_ENDED, clearEphemeralBNF);
}

jQuery(async () => {
    const settingsHtml = await $.get(`${extensionFolder}/src/html/settings.html`);
    $('#extensions_settings').append(settingsHtml);

    await loadSettings();
    $('#kobolib_api_url').val(extension_settings.kobolib.url).on('input',onKoboldURLChanged);

    registerEvents();
});
