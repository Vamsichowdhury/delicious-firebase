<template>
  <div v-if="getCategoryDialogData.open" class="text-center">
    <v-dialog v-model="dialog" width="auto">
      <v-card
        class="mx-auto"
        :style="`max-width: 500px;  ${
          $vuetify.display.mdAndUp ? 'width: 500px;' : 'width: 300px;'
        }`"
      >
        <v-toolbar color="primary" cards dark flat>
          <v-card-title class="text-h6 font-weight-regular">
            {{ getCategoryDialogData?.operation }}
          </v-card-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-form ref="form" v-model="isValid" class="pa-4 pt-6">
          <v-text-field
            v-model="categoryName"
            color="primary"
            label="Enter Category name"
            variant="outlined"
          ></v-text-field>
          <v-textarea
            v-model="categoryDesc"
            color="primary"
            label="Enter Category description"
            rows="1"
            variant="outlined"
            auto-grow
          ></v-textarea>
          <!-- <v-btn color="primary" variant="flat" block>
                        {{ getCategoryDialogData?.operation === "Add Category" ? "Upload Image" : "Change Image" }}
                    </v-btn> -->
          <v-file-input
            color="primary"
            variant="outlined"
            @change="onFileSelected"
            label="Upload Image"
            show-size
          ></v-file-input>
        </v-form>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn @click="closeDialog()"> Cancel </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            :disabled="!isValid"
            @click="handleCategory()"
            :loading="isLoading"
            color="primary"
          >
            Submit
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { mapMutations, mapGetters, mapActions } from "vuex";

export default {
  name: "categoryProductDialog",
  props: ["closeCategoryDialog"],
  data() {
    return {
      dialog: true,
      categoryName: "",
      categoryDesc: "",
      categoryImage: null,
      isValid: false,
      isLoading: false,
    };
  },

  computed: {
    ...mapGetters("adminPanel/categories", [
      "getCategories",
      "getCategoryDialogData",
    ]),

    isValid() {
      return this.categoryName && this.categoryDesc;
    },
  },

  methods: {
    ...mapMutations("adminPanel/categories", [
      "setCategories",
      "setCategoryDialogData",
    ]),
    ...mapActions("adminPanel/categories", ["createCategory", "editCategory"]),

    closeDialog() {
      this.setCategoryDialogData({ open: false });
    },

    onFileSelected(event) {
      this.categoryImage = event.target.files[0];
    },

    async handleCategory() {
      const categoryData = {
        title: this.categoryName,
        description: this.categoryDesc,
        image: this.categoryImage || "",
      };

      this.isLoading = true;
      try {
        if (this.getCategoryDialogData?.operation === "Add Category") {
          await this.createCategory(categoryData);
        } else if (this.getCategoryDialogData?.operation === "Edit Category") {
          await this.editCategory({
            id: this.getCategoryDialogData?.data?.id,
            category: categoryData,
          });
        }
        this.closeDialog();
      } catch (error) {
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
  },

  beforeUpdate() {
    this.categoryName = this.getCategoryDialogData?.data?.title || "";
    this.categoryDesc = this.getCategoryDialogData?.data?.description || "";
  },
};
</script>
