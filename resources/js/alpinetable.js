export default function () {
    return {

        // Data
        loading: false,

        //Bindings
        alpinetable: {
            ['x-on:click']() {
                this.loading = !this.loading;
            }
        },

        // Functions
        init() {

        }
    };
};
