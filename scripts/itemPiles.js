import * as core from "./core.js";

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