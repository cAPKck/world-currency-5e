import * as core from "./5e-world-currency.js";

export class ItemPilesSettingsUpdater extends FormApplication {
    // Object to build button on the form to update Item Piles settings

    constructor() {
        super({});
        core.patchIPCurrencies();
    }

    async _updateObject(event, formData) {
    }

    render() {
        this.close();
    }



}