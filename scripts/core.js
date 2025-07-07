/**
 * Core functions for patching currencies configuration.
 */

const WORLD_CURRENCY_5E = "world-currency-5e";

const ALT_REMOVE = {
    CP: "cpAltRemove",
    SP: "spAltRemove",
    EP: "epAltRemove",
    GP: "gpAltRemove",
    PP: "ppAltRemove",
};

const ALT = {
    CP: "cpAlt",
    SP: "spAlt",
    EP: "epAlt",
    GP: "gpAlt",
    PP: "ppAlt",
};
const ALT_ABRV = {
    CP: "cpAltAbrv",
    SP: "spAltAbrv",
    EP: "epAltAbrv",
    GP: "gpAltAbrv",
    PP: "ppAltAbrv",
};
const ALT_ICON = {
    CP: "cpAltIcon",
    SP: "spAltIcon",
    EP: "epAltIcon",
    GP: "gpAltIcon",
    PP: "ppAltIcon",
};
const ALT_CONV = {
    CP: "cpAltConv",
    SP: "spAltConv",
    EP: "epAltConv",
    GP: "gpAltConv",
    PP: "ppAltConv",
};

/** Writes the user-provided currencies to the CONFIG.DND5E object. */
function patchCurrencies() {

    // Translation for foundries in other languages
    game.i18n.translations.DND5E.CurrencyPP = game.settings.get(WORLD_CURRENCY_5E, ALT.PP);
    game.i18n.translations.DND5E.CurrencyGP = game.settings.get(WORLD_CURRENCY_5E, ALT.GP);
    game.i18n.translations.DND5E.CurrencyEP = game.settings.get(WORLD_CURRENCY_5E, ALT.EP);
    game.i18n.translations.DND5E.CurrencySP = game.settings.get(WORLD_CURRENCY_5E, ALT.SP);
    game.i18n.translations.DND5E.CurrencyCP = game.settings.get(WORLD_CURRENCY_5E, ALT.CP);

    game.i18n.translations.DND5E.CurrencyAbbrPP = game.settings.get(WORLD_CURRENCY_5E, ALT_ABRV.PP);
    game.i18n.translations.DND5E.CurrencyAbbrGP = game.settings.get(WORLD_CURRENCY_5E, ALT_ABRV.GP);
    game.i18n.translations.DND5E.CurrencyAbbrEP = game.settings.get(WORLD_CURRENCY_5E, ALT_ABRV.EP);
    game.i18n.translations.DND5E.CurrencyAbbrSP = game.settings.get(WORLD_CURRENCY_5E, ALT_ABRV.SP);
    game.i18n.translations.DND5E.CurrencyAbbrCP = game.settings.get(WORLD_CURRENCY_5E, ALT_ABRV.CP);

    // Patch config with the new currencies
    let currencyConfig = {};
    for (let currency of ["CP", "SP", "EP", "GP", "PP"]) {
        const currency_lower = currency.toLowerCase();
        if (!game.settings.get(WORLD_CURRENCY_5E, ALT_REMOVE[currency])) {
            currencyConfig[currency_lower] = {
                label: game.settings.get(WORLD_CURRENCY_5E, ALT[currency]),
                abbreviation: game.settings.get(WORLD_CURRENCY_5E, ALT_ABRV[currency]),
                icon: game.settings.get(WORLD_CURRENCY_5E, ALT_ICON[currency]),
                conversion: game.settings.get(WORLD_CURRENCY_5E, ALT_CONV[currency]),
            };
        }
    }
    CONFIG.DND5E.currencies = currencyConfig;

    // Patch currency icons in the style sheet, since style sheet is already loaded at this point
    /** Change currency icons in a style sheet */
    const css = `:is(.dnd5e2, .dnd5e2-journal) :is(i, span).currency { &.cp { background-image: url('${game.settings.get(WORLD_CURRENCY_5E, ALT_ICON.CP)}'); }} `
        + `:is(.dnd5e2, .dnd5e2-journal) :is(i, span).currency { &.sp { background-image: url('${game.settings.get(WORLD_CURRENCY_5E, ALT_ICON.SP)}'); }} `
        + `:is(.dnd5e2, .dnd5e2-journal) :is(i, span).currency { &.ep { background-image: url('${game.settings.get(WORLD_CURRENCY_5E, ALT_ICON.EP)}'); }} `
        + `:is(.dnd5e2, .dnd5e2-journal) :is(i, span).currency { &.gp { background-image: url('${game.settings.get(WORLD_CURRENCY_5E, ALT_ICON.GP)}'); }} `
        + `:is(.dnd5e2, .dnd5e2-journal) :is(i, span).currency { &.pp { background-image: url('${game.settings.get(WORLD_CURRENCY_5E, ALT_ICON.PP)}'); }} `

    const style = document.createElement("style");
    style.id = "world-currency-5e-style"; // Purely for debugging purposes
    style.innerHTML = css;
    document.head.appendChild(style);

    console.log(`${WORLD_CURRENCY_5E} | Patched Currencies`);
}

/** Patches the item piles currency config */
function patchIPCurrencies() {

    let currencyConfig = [];
    for (let currency of ["CP", "SP", "EP", "GP", "PP"]) {
        const currency_lower = currency.toLowerCase();
        if (!game.settings.get(WORLD_CURRENCY_5E, ALT_REMOVE[currency])) {
            currencyConfig.push({
                index: currencyConfig.length,
                id: `system.currency.${currency_lower}`,
                data: {
                    path: `system.currency.${currency_lower}`,
                },
                primary: currencyConfig.length === 0,
                secondary: false,
                type: "attribute",
                name: game.settings.get(WORLD_CURRENCY_5E, ALT[currency]),
                abbreviation: game.settings.get(WORLD_CURRENCY_5E, ALT_ABRV[currency]),
                img: game.settings.get(WORLD_CURRENCY_5E, ALT_ICON[currency]),
                exchangeRate: Math.round(((1 / game.settings.get(WORLD_CURRENCY_5E, ALT_CONV[currency])) * 1000)) / 1000,
            });
        }
    }

    game.settings.set("item-piles", "currencies", currencyConfig);
    game.settings.set("item-piles", "secondaryCurrencies", []);

}

/** Udpates the currency Manager according to currency settings. */
function patchCurrencyManager(element) {

    // Remove the currency converter from the currency manager
    if (game.settings.get(WORLD_CURRENCY_5E, "RemoveConverter")) {
        // TODO: not the cleanest solution
        element.getElementsByClassName("sheet-tabs")?.[0]?.children?.[0]?.remove();
    }

    // Remove currencies from transfer window
    // TODO: Also not the cleanest solution, but it works
    const currencyClass = element.getElementsByClassName("currency")?.[0];
    if (currencyClass) {
        for (let currency of currencyClass.children) {
            const currencyType = currency.children?.[0]?.name?.split(".")[1];
            if (!currencyType || !ALT_REMOVE[currencyType.toUpperCase()]) continue;
            if (game.settings.get(WORLD_CURRENCY_5E, ALT_REMOVE[currencyType.toUpperCase()])) {
                currency.remove();
            }
        }
    }

}

/**
 * Patches the vehicle sheet for removed currencies.
 */
function patchVehicleSheet(element) {
    for (let currency of ["cp", "sp", "ep", "gp", "pp"]) {
        if (game.settings.get(WORLD_CURRENCY_5E, ALT_REMOVE[currency.toUpperCase()])) {
            element.querySelector(`input[name='system.currency.${currency}']`)?.remove();
            element.querySelector(`label[class='denomination ${currency}']`)?.remove();
        }
    }
}

/**
 * Patches the Group sheet for removed currencies.
 */
function patchGroupSheet(element) {
    for (let currency of ["cp", "sp", "ep", "gp", "pp"]) {
        if (game.settings.get(WORLD_CURRENCY_5E, ALT_REMOVE[currency.toUpperCase()])) {
            element.querySelector(`input[name='system.currency.${currency}']`)?.remove();
            element.querySelector(`label[class='denomination ${currency}']`)?.remove();
        }
    }
}

export {
    patchCurrencies,
    patchIPCurrencies,
    patchCurrencyManager,
    patchVehicleSheet,
    patchGroupSheet,
    WORLD_CURRENCY_5E,
    ALT_REMOVE,
    ALT,
    ALT_CONV,
    ALT_ABRV,
};
