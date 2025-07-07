/**
 * Registers hook callbacks.
 */

import * as core from "./core.js";
import { registerSettings } from "./settings.js";

// Core Hooks

Hooks.once("init", () => {
    registerSettings();
});

Hooks.on("ready", function () {
    core.patchCurrencies(); // Patches the dnd currency config
});

Hooks.on("renderCurrencyManager", (application, element, context, options) => {
    core.patchCurrencyManager(element);
    console.log(`${core.WORLD_CURRENCY_5E} | Patched currency manager`);
});

Hooks.on("renderActorSheet5eVehicle", (application, html, data) => {
    core.patchVehicleSheet(html[0]);
    console.log(`${core.WORLD_CURRENCY_5E} | Patched vehicle sheet`);
});

Hooks.on("renderGroupActorSheet", (application, html, data) => {
    core.patchGroupSheet(html[0]);
    console.log(`${core.WORLD_CURRENCY_5E} | Patched group sheet`);
});

// TODO: Copy currency config from item piles, its just better

// TODO: Tidy 5e