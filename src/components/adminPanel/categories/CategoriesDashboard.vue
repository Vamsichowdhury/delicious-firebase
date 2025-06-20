<template>
    <v-card>
        <v-banner color="primary" icon="mdi-shape" lines="one">
            <v-banner-text class="text-h6">
                Categories
            </v-banner-text>

            <template v-slot:actions>
                <v-btn @click="handleCategory('Add Category')" class="text-none" color="primary" min-width="92"
                    variant="outlined" rounded>
                    <v-icon class="mx-2">mdi-plus</v-icon>
                    Add Category
                </v-btn>
            </template>
        </v-banner>
        <category-dialog />
        <delete-category-dialog v-if="categoryDeletionDialog" :categoryDeletionData="categoryDeletionData"
            :closeCategoryDeletionDialog="closeCategoryDeletionDialog" />
        <v-container fluid class="scrollable-container">
            <v-row>
                <v-col v-for="(item, index) in getCategories" :key="index" cols="12" md="3">
                    <v-hover v-slot="{ isHovering, props }">
                        <v-card :class="{ 'on-hover': isHovering }" :elevation="isHovering ? 24 : 12" v-bind="props"
                            :disabled="item.loading" :loading="item.loading" class="mx-auto my-12" max-width="374">
                            <template v-slot:loader="{ isActive }">
                                <v-progress-linear :active="isActive" color="primary" height="4"
                                    indeterminate></v-progress-linear>
                            </template>

                            <v-img height="250" :src="item.imageSrc" cover></v-img>

                            <v-card-item>
                                <v-card-title>{{ item.title }}</v-card-title>
                            </v-card-item>
                            <v-divider class="mx-4"></v-divider>

                            <v-card-text class="description-container">
                                <div class="text-subtitle-1">
                                    {{ item.description }}
                                </div>
                            </v-card-text>

                            <v-divider class="mx-4"></v-divider>
                            <v-card-text class="d-flex justify-space-around">
                                <v-chip color="primary" variant="outlined" size="x-large">
                                    No.of items : {{ item?.totalItemsCount }}
                                    <v-icon icon="mdi-outline" end></v-icon>
                                </v-chip>

                            </v-card-text>
                            <v-divider class="mx-4 mb-1"></v-divider>
                            <v-card-actions class="d-flex justify-space-around">

                                <v-btn color="success" text="Add to Cart" variant="outlined"
                                    @click="redirectToProducts(item?.id, index)">
                                    <v-icon class="mx-2">mdi-eye</v-icon>
                                    View
                                </v-btn>
                                <v-btn color="medium-emphasis" text="Add to Cart" variant="outlined"
                                    @click="handleCategory('Edit Category', item, index)">
                                    <v-icon class="mx-2">mdi-pencil</v-icon>
                                    Edit
                                </v-btn>
                                <v-btn color="error" text="Add to Cart" variant="outlined"
                                    @click="handleCategoryDeletion(item, index)">
                                    <v-icon class="mx-2">mdi-delete</v-icon>
                                    Delete
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-hover>
                </v-col>
            </v-row>
        </v-container>

    </v-card>
    <!-- <v-snackbar :color="snackbarColor" v-model="snackbar" :timeout="timeout" location="top">
        {{ text }}

        <template v-slot:actions>
            <v-btn variant="text" @click="snackbar = false">
                Close
            </v-btn>
        </template>
    </v-snackbar> -->
</template>
<script>
import CategoryDialog from "./CategoryDialog.vue"
import DeleteCategoryDialog from "./DeleteCategoryDialog.vue"
import { mapActions, mapMutations, mapGetters } from "vuex";

export default {
    components: {
        CategoryDialog,
        DeleteCategoryDialog
    },
    data: () => ({
        tab: null,
        categoryDeletionDialog: false,
        snackbar: false,
        text: '',
        timeout: 2000,
        snackbarColor: null
    }),

    computed: {
        ...mapGetters("adminPanel/categories", ["getCategories"]),
    },

    methods: {

        ...mapActions("adminPanel/categories", ["fetchCategories"]),
        ...mapMutations("adminPanel/categories", ["setCategoryDialogData"]),

        reserve(index) {
            this.getCategories[index].loading = true;
            setTimeout(() => (this.getCategories[index].loading = false), 2000);
        },

        handleCategoryDeletion(item, index) {
            this.categoryDeletionData = item
            this.categoryDeletionDialog = true
            this.reserve(index)
        },
        closeCategoryDeletionDialog() {
            this.categoryDeletionDialog = false
        },
        handleCategory(operation, item, index) {
            const categoryData = {
                open: true,
                operation: operation,
                data: item
            }
            this.setCategoryDialogData(categoryData)
            // this.reserve(index)
        },
        redirectToProducts(categoryId, index) {
            const path = `/admin/categories/${categoryId}/items`;
            this.$router.push(path);
            this.reserve(index)

        },
    },

    created() {
        // this.snackbar = true
        // this.text = 'Successfully login'
        // this.snackbarColor = 'success'
        this.fetchCategories();
    },
}
</script>

<style lang="scss" scoped>
.scrollable-container {
    height: 85vh;
    overflow-y: auto;
}

.description-container {
    height: 100px;
    overflow: auto;
}
</style>