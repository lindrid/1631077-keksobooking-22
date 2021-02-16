import {generateObjects} from './data.js';
import {createElements as createOfferElements} from './offer.js';

const GENERATED_OBJECTS_NUMBER = 10;

const objects = generateObjects(GENERATED_OBJECTS_NUMBER);
const offerElements = createOfferElements(objects);

const mapCanvas = document.querySelector('#map-canvas');
mapCanvas.appendChild(offerElements[0]);