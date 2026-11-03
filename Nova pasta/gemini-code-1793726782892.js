import { DentalModel } from './models/DentalModel.js';
import { AppView } from './views/AppView.js';
import { AppController } from './controllers/AppController.js';

document.addEventListener('DOMContentLoaded', () => {
    const model = new DentalModel();
    const view = new AppView();
    const controller = new AppController(model, view);

    controller.init();
});