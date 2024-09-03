import Alpine from 'alpinejs';
import persist from '@alpinejs/persist'
Alpine.plugin(persist)

import alpinetable from './alpinetable.js';
Alpine.data('alpinetable', alpinetable);

window.Alpine = Alpine;

Alpine.start();
