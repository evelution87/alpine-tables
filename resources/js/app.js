require('./bootstrap');

import Alpine from 'alpinejs';

import alpinetable from './alpinetable.js';
Alpine.data('alpinetable', alpinetable);

window.Alpine = Alpine;

Alpine.start();
