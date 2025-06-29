/**
 * Registers hook callbacks.
 */

import * as core from "./5e-world-currency.js";
import { registerSettings } from "./settings.js";

// Core Hooks

Hooks.once("init", () => {
    registerSettings();
});

Hooks.on("ready", function () {
    core.patchCurrencies(); // Patches the dnd currency config
});

Hooks.on("renderCurrencyManager", (options, element, actor, window) => {
    core.patchCurrencyManager(element);
    console.log("5e-world-currency | Altered currency manager");
});

// TODO: Copy currency config from item piles, its just better

// TODO: Tidy 5e