<template>
    <div class="text-center pa-4">
        <v-dialog v-model="dialog" width="auto">
            <v-card class="mx-auto" :style="`max-width: 500px;  ${$vuetify.display.mdAndUp ? 'width: 500px;' : 'width: 300px;'}`">
                <v-toolbar color="primary" cards dark flat>
                    <v-card-title class="text-h6 font-weight-regular">
                        Delete Category
                    </v-card-title>
                    <v-spacer></v-spacer>
                </v-toolbar>
                <v-card-text>
                    <div class="text-medium-emphasis mb-4">
                        Are you sure, you want to delete Category: {{ categoryDeletionData?.title }} ?
                    </div>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-btn variant="text" @click="closeDialog()">
                        Cancel
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn @click="handleDelete()" :loading="isLoading" color="error">
                        Delete
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
import { mapMutations, mapActions } from "vuex";

export default {

    name: "categoryProductDialog",
    props: ['categoryDeletionData', 'closeCategoryDeletionDialog'],

    data() {
        return {
            dialog: true,
            categoryName: "",
            isValid: false,
            isLoading: false,
        }
    },
    methods: {
        ...mapMutations("adminPanel/categories", ["setCategories"]),
        ...mapActions("adminPanel/categories", ["deleteCategory"]),

        closeDialog() {
            this.dialog = false
            this.closeCategoryDeletionDialog(false)
        },
        handleDelete() {
            this.deleteCategory(this.categoryDeletionData?.id)
            this.closeDialog()
        }
    },
}
</script>