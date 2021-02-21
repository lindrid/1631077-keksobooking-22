import {generateObjects} from './data.js';
import {createElements as createOfferElements} from './offer.js';
import {addChangeListeners as addFormChangeListeners, 
  setToInactiveState as setFormToInactiveState} from './form.js';

const GENERATED_OBJECTS_NUMBER = 10;

const objects = generateObjects(GENERATED_OBJECTS_NUMBER);
const offerElements = createOfferElements(objects);

addFormChangeListeners();
setFormToInactiveState();