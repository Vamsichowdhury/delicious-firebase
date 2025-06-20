<template>
    <v-app>
        <v-container fluid class="pa-0">
            <v-row no-gutters class="hero-section">
                <v-col cols="12" md="6"
                    :class="`d-flex align-center justify-center text-left ${$vuetify.display.mdAndUp ? 'pl-16' : 'pl-2 text-center'} `">
                    <v-container height="100vh">
                        <div>
                            <div>
                                <v-text block
                                    :class="`display-1 ${$vuetify.display.mdAndUp ? 'text-h2' : 'text-h5'} font-weight-bold`">Taste
                                    the World on Your
                                    Plate!</v-text>
                            </div>
                            <div class="py-4">
                                <v-text block class="subtitle-1 text-h7 ">Every dish is prepared with passion and
                                    the finest ingredients.
                                </v-text>

                            </div>
                            <v-btn :color="'primary'" class="text-none" :append-icon="'mdi-open-in-new'" size="large"
                                rounded variant="flat" flat to="/menu">Discover Menu</v-btn>
                        </div>
                    </v-container>
                </v-col>
                <v-col cols="12" md="6"
                    :class="`d-flex align-center justify-start ${$vuetify.display.mdAndUp ? 'pa-5' : 'mobile-image'}`">
                    <v-img src="../../assets/salad.png" aspect-ratio="1" contain></v-img>
                </v-col>
            </v-row>
        </v-container>
    </v-app>
</template>

<script>
export default {
    name: 'HeroPage',
};
</script>

<style scoped>
.hero-section {
    height: 100vh;
}

.text-center {
    max-width: 900px;
}

.v-btn {
    margin-top: 20px;
}

.pa-5 {
    padding: 6rem !important;
}

.mobile-image {
    margin-bottom: 8rem !important;
}
</style>