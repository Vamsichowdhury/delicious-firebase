<template>
    <div :class="`${$vuetify.display.mdAndUp ? 'admin-dashboard-container' : 'admin-dashboard-mb-container'}`"
        :style="'2px solid red'">
        <v-data-table-virtual :headers=" headers " :items=" admins " height="75vh">
            <template v-slot:item.adminLevel="{ value }">
                <v-chip :color=" getColor(value) ">
                    {{ value }}
                </v-chip>
            </template>
            <template v-slot:top>
                <v-toolbar flat>
                    <v-toolbar-title>Admins</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-dialog v-model=" dialog " max-width="400px">
                        <template v-slot:activator="{ props }">
                            <v-btn class="mb-2" color="primary" dark v-bind=" props ">
                                Register Admin
                            </v-btn>
                        </template>
                        <v-card>
                            <v-card-title>
                                <span class="text-h5">{{ formTitle }}</span>
                            </v-card-title>

                            <v-card-text>
                                <v-container>
                                    <v-row>
                                        <v-col cols="12" md="12" sm="6">
                                            <v-text-field type="email" variant="outlined" v-model=" editedItem.email "
                                                label="Email"></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col v-if=" editedIndex < 0 " cols="12" md="12" sm="6">
                                            <v-text-field type="password" variant="outlined"
                                                v-model=" editedItem.password " label="Password"></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col cols="12" md="12" sm="6">
                                            <v-select variant="outlined" v-model=" editedItem.adminLevel "
                                                label="Admin Level" :items=" ['Super Admin', 'Admin'] "></v-select>
                                        </v-col>
                                    </v-row>

                                </v-container>
                            </v-card-text>

                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue-darken-1" variant="text" @click=" close ">
                                    Cancel
                                </v-btn>
                                <v-btn :loading="loading" color="blue-darken-1" variant="text" @click=" save ">
                                    Save
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                    <v-dialog v-model=" dialogDelete " max-width="500px">
                        <v-card>
                            <v-card-title class="text-h5">Are you sure you want to delete ?</v-card-title>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue-darken-1" variant="text" @click=" closeDelete ">Cancel</v-btn>
                                <v-btn color="blue-darken-1" :loading="loading" variant="text" @click=" deleteItemConfirm ">OK</v-btn>
                                <v-spacer></v-spacer>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-toolbar>
            </template>
            <template v-slot:item.actions="{ item }">
                <v-icon class="me-2" size="small" @click="editItem(item)">
                    mdi-pencil
                </v-icon>
                <v-icon size="small" @click="deleteItem(item)">
                    mdi-delete
                </v-icon>
            </template>
        </v-data-table-virtual>
    </div>
</template>
<script>
import { mapActions, mapMutations } from "vuex";

export default {
  data: () => ({
    dialog: false,
    dialogDelete: false,
    headers: [
      {
        title: 'Email',
        align: 'start',
        sortable: false,
        key: 'email',
      },
      {
        title: 'Admin Level',
        align: 'center',
        sortable: true,
        key: 'adminLevel',
      },
      { title: 'Actions', key: 'actions', sortable: false },
    ],
    admins: [],
    editedIndex: -1,
    editedItem: {
      email: '',
      password: "",
      adminLevel: "Admin"
    },
    defaultAdmin: {
      email: '',
      adminLevel: ""
    },
    loading: false
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Register new Admin' : 'Edit Admin'
    },
  },

  watch: {
    dialog(val) {
      val || this.close()
    },
    dialogDelete(val) {
      val || this.closeDelete()
    },
  },

  methods: {
    ...mapActions("adminPanel/adminDashboard", ["registerAdmin", "setAllAdmins", "deleteAdmin", "editAdmin"]),

    editItem(item) {
      this.editedIndex = this.admins.indexOf(item)
      this.editedItem = Object.assign({}, item)
      delete this.editedItem.password // Remove password field when editing
      this.dialog = true
    },

    deleteItem(item) {
      this.editedIndex = this.admins.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    async deleteItemConfirm() {
      const response = await this.deleteAdmin(this.admins[this.editedIndex])
      if (response.success) {
        this.fetchAdmins()
      }
      this.closeDelete()
    },

    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultAdmin)
        this.editedIndex = -1
      })
    },

    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultAdmin)
        this.editedIndex = -1
      })
    },

    async save() {
      this.loading = true
      if (this.editedIndex > -1) {
        // Edit existing admin
        const response = await this.editAdmin(this.editedItem)
        if (response.success) {
          this.fetchAdmins()
        }
      } else {
        // Register new admin
        const response = await this.registerAdmin(this.editedItem)
        if (response.success) {
          this.fetchAdmins()
        }
      }
      this.loading = false
      this.close()
    },

    getColor(adminLevel) {
      if (adminLevel === 'Admin') return 'orange'
      else return 'green'
    },

    async fetchAdmins() {
      const allAdmins = await this.setAllAdmins()
      this.admins = allAdmins?.data
    },
  },

  created() {
    this.fetchAdmins()
  },
}
</script>

<style scoped>
.admin-dashboard-container {
    width: 60vw;
    margin: 20px auto;
}

.admin-dashboard-mb-container {
    width: 90vw;
    margin: 20px auto;
}

.custom-data-table {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Infinite scroll styling */
.v-data-table__wrapper {
    max-height: 60vh;
    overflow-y: auto;
}
</style>
