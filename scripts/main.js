/**
 * Registers hook callbacks.
 */

import * as core from "./world-currency-5e.js";
import { registerSettings } from "./settings.js";
import * as convert from "./convert.js";

// Core Hooks

Hooks.once("init", () => {
    registerSettings();
});

Hooks.on("ready", function () {
    core.patchCurrencies();
});

Hooks.on("renderActorSheetV2", (options, element, actor, window) => {
    core.removeCurrencies(element);
    core.changeCurrencyIcons(element);
    console.log("world-currency-5e | Altered character sheet");
});

Hooks.on("renderActorSheet5eVehicle", (options, elements, actor) => {
    let element = elements[0];
    core.removeCurrencies(element);
    console.log("world-currency-5e | Altered vehicle sheet");
});

Hooks.on("renderGroupActorSheet", (options, elements, actor) => {
    let element = elements[0];
    core.removeCurrencies(element);
    console.log("world-currency-5e | Altered group sheet");
});

Hooks.on("renderItemSheet5e", (options, element, actor, window) => {
    core.changeCurrencyIcons(element);
    // let standard = game.settings.get(core.WORLD_CURRENCY_5E, "Standard");
    // if (!(game.user.isGM && standard == "gp")) {
    //     html.find('[name="system.price"]').prop("disabled", true);
    //     html.find('[name="system.price.value"]').val(convert.formatCurrency(convert.gpToStandard(data.system.price))); // Not working, html element has different name
    // }

    // TODO: Remove currencies from item sheet (low priority, since only visible in edit mode)
});

// TODO: Tooltip item hover

// TODO: Currency Converter in Item Sheet

// TODO: Trade Window from Item Piles



// Important: Try to change the style elements instead of modifying the HTML directly, especially for the icons, since the toolips are loaded without triggering hooks