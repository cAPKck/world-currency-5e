/**
 * Settings that allow user to specify custom currencies and other options.
 */

import { patchCurrencies, WORLD_CURRENCY_5E, ALT_REMOVE, ALT, CONVERT } from "./world-currency-5e.js";

/** Registers setting to remove the currency converter from character sheets. */
function registerSettingsConverter() {
    game.settings.register(WORLD_CURRENCY_5E, "RemoveConverter", {
        name: "Remove currency converter from character sheets.",
        scope: "world",
        config: true,
        default: true,
        requiresReload: true,
        type: Boolean,
        onChange: () => patchCurrencies(),
    });
}

/** Helper function that registers whether currency should be removed. */
function registerRemove(settingName, originalName) {
    game.settings.register(WORLD_CURRENCY_5E, settingName + "Remove", {
        name: "Hide " + originalName,
        scope: "world",
        config: true,
        default: false,
        requiresReload: true,
        type: Boolean,
        onChange: () => patchCurrencies(),
    });
}

/** Registers settings to remove currencies */
function registerSettingsCurrencyRemove() {
    registerRemove(ALT.CP, "Copper");
    registerRemove(ALT.SP, "Silver");
    registerRemove(ALT.EP, "Electrum");
    registerRemove(ALT.GP, "Gold");
    registerRemove(ALT.PP, "Platinum");
}

/** Helper function that registers a new currency. */
function registerCurrency(settingName, originalName, originalAbrv, altRemove) {
    let isRemoved = game.settings.get(WORLD_CURRENCY_5E, altRemove);
    game.settings.register(WORLD_CURRENCY_5E, settingName, {
        name: originalName + " New Name",
        scope: "world",
        config: !isRemoved,
        default: originalName,
        requiresReload: true,
        type: String,
        onChange: () => patchCurrencies(),
    });
    game.settings.register(WORLD_CURRENCY_5E, settingName + "Abrv", {
        name: originalName + " New Abbreviation",
        scope: "world",
        config: !isRemoved,
        default: originalAbrv,
        requiresReload: true,
        type: String,
        onChange: () => patchCurrencies(),
    });
    game.settings.register(WORLD_CURRENCY_5E, settingName + "Icon", {
        name: originalName + " New Icon File Path",
        scope: "world",
        config: !isRemoved,
        requiresReload: true,
        default: "",
        type: String,
        onChange: () => patchCurrencies(),
    });
}

/** Registers settings to change names of abbreviations of currencies */
function registerSettingsCurrencyNames() {
    registerCurrency(ALT.CP, "Copper", "CP", ALT_REMOVE.CP);
    registerCurrency(ALT.SP, "Silver", "SP", ALT_REMOVE.SP);
    registerCurrency(ALT.EP, "Electrum", "EP", ALT_REMOVE.EP);
    registerCurrency(ALT.GP, "Gold", "GP", ALT_REMOVE.GP);
    registerCurrency(ALT.PP, "Platinum", "PP", ALT_REMOVE.PP);
}

/** Helper function that registers an exchange rate. */
function registerExchangeRate(exchangeSetting, newName, isRemoved) {
    game.settings.register(WORLD_CURRENCY_5E, exchangeSetting, {
        name: "How many " + newName + " in a RAW GP?",
        scope: "world",
        config: !isRemoved,
        default: null,
        requiresReload: true,
        type: Number,
        onChange: () => patchCurrencies(),
    });
}

/** Registers settings to change all exchange rates. */
function registerSettingsExchangeRates() {
    let cpAltRemove = game.settings.get(WORLD_CURRENCY_5E, ALT_REMOVE.CP);
    let spAltRemove = game.settings.get(WORLD_CURRENCY_5E, ALT_REMOVE.SP);
    let epAltRemove = game.settings.get(WORLD_CURRENCY_5E, ALT_REMOVE.EP);
    let gpAltRemove = game.settings.get(WORLD_CURRENCY_5E, ALT_REMOVE.GP);
    let ppAltRemove = game.settings.get(WORLD_CURRENCY_5E, ALT_REMOVE.PP);

    let cpAlt = game.settings.get(WORLD_CURRENCY_5E, ALT.CP);
    let spAlt = game.settings.get(WORLD_CURRENCY_5E, ALT.SP);
    let epAlt = game.settings.get(WORLD_CURRENCY_5E, ALT.EP);
    let gpAlt = game.settings.get(WORLD_CURRENCY_5E, ALT.GP);
    let ppAlt = game.settings.get(WORLD_CURRENCY_5E, ALT.PP);

    registerExchangeRate(CONVERT.CP, cpAlt, cpAltRemove);
    registerExchangeRate(CONVERT.SP, spAlt, spAltRemove);
    registerExchangeRate(CONVERT.EP, epAlt, epAltRemove);
    registerExchangeRate(CONVERT.GP, gpAlt, gpAltRemove);
    registerExchangeRate(CONVERT.PP, ppAlt, ppAltRemove);
}

/** Registers setting to set a standard currency */
function registerSettingsStandard() {
    game.settings.register(WORLD_CURRENCY_5E, "Standard", {
        name: "Standard Currency",
        scope: "world",
        config: true,
        default: "gp",
        requiresReload: true,
        type: String,
        choices: {
            pp: game.settings.get(WORLD_CURRENCY_5E, ALT.PP),
            gp: game.settings.get(WORLD_CURRENCY_5E, ALT.GP),
            ep: game.settings.get(WORLD_CURRENCY_5E, ALT.EP),
            sp: game.settings.get(WORLD_CURRENCY_5E, ALT.SP),
            cp: game.settings.get(WORLD_CURRENCY_5E, ALT.CP),
        },
        onChange: () => patchCurrencies(),
    });
}

/** Registers all settings for this module. */
function registerSettings() {
    registerSettingsCurrencyRemove();
    registerSettingsCurrencyNames();
    registerSettingsConverter();
    registerSettingsExchangeRates();
    registerSettingsStandard();
    console.log(`${WORLD_CURRENCY_5E} | Registered Settings`);
}

export { registerSettings };
