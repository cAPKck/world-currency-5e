/**
 * Settings that allow user to specify custom currencies and other options.
 */

import { patchCurrencies, WORLD_CURRENCY_5E, ALT_REMOVE, ALT } from "./5e-world-currency.js";
import { ItemPilesSettingsUpdater } from "./itemPiles.js";

/** Registers setting to remove the currency converter from the currency manager. */
function registerSettingsConverter() {
    game.settings.register(WORLD_CURRENCY_5E, "RemoveConverter", {
        name: "Remove currency converter from currency manager.",
        scope: "world",
        config: true,
        default: true,
        requiresReload: true,
        type: Boolean
    });
}

/** Registers setting for Item Piles */
function registerSettingsItemPiles() {
    // Check if Item Piles is installed
    if (!game.modules.get("itempilesdnd5e")?.active) {
        console.info(`${WORLD_CURRENCY_5E} | Item Piles D&D 5e module is not active, Skipping Item Piles settings.`);
        return;
    }
    game.settings.registerMenu(WORLD_CURRENCY_5E, "UpdateItemPiles", {
        name: "Update Item Piles",
        label: "Update",
        hint: "This will update the currency settings of Item Piles to match the current settings. REQUIRES MANUAL RELOAD (F5) after pressing the button and saving.",
        default: false,
        restricted: false,
        type: ItemPilesSettingsUpdater,
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
function registerCurrency(settingName, originalName, originalAbrv, originalIcon, originalRate, altRemove) {
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
        default: originalIcon,
        type: String,
        onChange: () => patchCurrencies(),
    });
    game.settings.register(WORLD_CURRENCY_5E, settingName + "Conv", {
        name: originalName + " Conversion Rate (how many in an ORIGINAL GP)",
        scope: "world",
        config: !isRemoved,
        requiresReload: true,
        default: originalRate,
        type: Number,
        onChange: () => patchCurrencies(),
    });
}

/** Registers settings for currencies */ // TODO: Load from original config
function registerSettingsCurrencyConfig() {
    registerCurrency(ALT.CP, "Copper", "CP", "systems/dnd5e/icons/currency/copper.webp", 100, ALT_REMOVE.CP);
    registerCurrency(ALT.SP, "Silver", "SP", "systems/dnd5e/icons/currency/silver.webp", 10, ALT_REMOVE.SP);
    registerCurrency(ALT.EP, "Electrum", "EP", "systems/dnd5e/icons/currency/electrum.webp", 2, ALT_REMOVE.EP);
    registerCurrency(ALT.GP, "Gold", "GP", "systems/dnd5e/icons/currency/gold.webp", 1, ALT_REMOVE.GP);
    registerCurrency(ALT.PP, "Platinum", "PP", "systems/dnd5e/icons/currency/platinum.webp", 0.1, ALT_REMOVE.PP);
}

/** Registers setting to set a standard currency */
// function registerSettingsStandard() {
//     game.settings.register(WORLD_CURRENCY_5E, "Standard", {
//         name: "Standard Currency",
//         scope: "world",
//         config: true,
//         default: "gp",
//         requiresReload: true,
//         type: String,
//         choices: {
//             pp: game.settings.get(WORLD_CURRENCY_5E, ALT.PP),
//             gp: game.settings.get(WORLD_CURRENCY_5E, ALT.GP),
//             ep: game.settings.get(WORLD_CURRENCY_5E, ALT.EP),
//             sp: game.settings.get(WORLD_CURRENCY_5E, ALT.SP),
//             cp: game.settings.get(WORLD_CURRENCY_5E, ALT.CP),
//         },
//         onChange: () => patchCurrencies(),
//     });
// }

/** Registers all settings for this module. */
function registerSettings() {
    registerSettingsCurrencyRemove();
    registerSettingsCurrencyConfig();
    registerSettingsConverter();
    registerSettingsItemPiles();
    // registerSettingsStandard(); // TODO see main.js
    console.log(`${WORLD_CURRENCY_5E} | Registered Settings`);
}

export { registerSettings };
