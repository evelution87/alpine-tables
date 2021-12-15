import persist from '@alpinejs/persist';
import alpinetable from './alpinetable.js';

document.addEventListener( 'alpine:init', () => {
	window.Alpine.plugin( persist );
	window.Alpine.data( 'alpinetable', alpinetable );
} );