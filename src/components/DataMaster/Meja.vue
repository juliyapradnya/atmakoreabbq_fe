<template>
  <v-main class="list">
    <h3 class="text-h3 font-weight-medium mb-5 font-weight-bold">
      Meja
    </h3>

    <v-card>
      <v-card-title>
        <v-switch
          v-model="showMeja"
          color="info"
          inset
          :label="`Meja Tersedia`"
        ></v-switch>

        <v-spacer></v-spacer>
        <v-btn
          @click="dialogCari = true"
          rounded
          class="ma-2 white--text"
          color="blue"
        >
          search
          <v-icon right dark>mdi-magnify</v-icon>
        </v-btn>

        <v-btn @click="dialog = true" fab dark small color="green">
          <v-icon>mdi-plus-circle</v-icon>
        </v-btn>
      </v-card-title>

      <v-row md="3" v-if="showMeja == false">
        <v-col
          v-for="(item, i) in mejas"
          :key="i"
          cols="6"
          md="4"
          :search="search"
        >
          <v-card v-if="item.status_meja === 'tersedia'" class="pa-3 green">
            <v-list-item-title class="white--text headline mb-5">
              <b> {{ item.no_meja }}</b>
              <p>
                {{ item.status_meja }}
                <v-icon large left> mdi-check-circle</v-icon>
              </p>
            </v-list-item-title>
            <v-card-actions>
              <v-btn
                @click="editHandler(item)"
                fab
                dark
                small
                right
                color="blue"
              >
                <v-icon>mdi-circle-edit-outline</v-icon>
              </v-btn>

              <v-btn
                @click="deleteHandler(item.id)"
                fab
                dark
                small
                right
                color="red"
              >
                <v-icon>mdi-trash-can </v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>

          <v-card
            v-else-if="item.status_meja === 'tidak tersedia'"
            class="pa-3 red"
          >
            <v-list-item-title class="white--text headline mb-5">
              <b> {{ item.no_meja }}</b>
              <p>
                {{ item.status_meja }}
                <v-icon large left> mdi-close-circle</v-icon>
              </p>
            </v-list-item-title>
            <v-card-actions>
              <v-btn @click="editHandler(item)" fab dark small color="blue">
                <v-icon dark>
                  mdi-circle-edit-outline
                </v-icon>
              </v-btn>

              <v-btn @click="deleteHandler(item.id)" fab dark small color="red">
                <v-icon dark>
                  mdi-trash-can
                </v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <v-row md="3" v-if="showMeja == true">
        <v-col
          v-for="(item, i) in mejas"
          :key="i"
          cols="6"
          md="4"
          :search="search"
        >
          <v-card v-if="item.status_meja === 'tersedia'" class="pa-3 green">
            <v-list-item-title class="white--text headline mb-5">
              <b> {{ item.no_meja }}</b>
              <p>
                {{ item.status_meja }}
                <v-icon large left> mdi-check-circle</v-icon>
              </p>
            </v-list-item-title>
            <v-card-actions class="mx-auto">
              <v-btn @click="editHandler(item)" fab dark small color="blue">
                <v-icon dark>
                  mdi-circle-edit-outline
                </v-icon>
              </v-btn>

              <v-btn @click="deleteHandler(item.id)" fab dark small color="red">
                <v-icon dark>
                  mdi-trash-can
                </v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-card>

    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }} Meja</span>
        </v-card-title>

        <v-card-text>
          <v-form v-model="valid" ref="form">
            <v-text-field
              v-model="form.no_meja"
              label="Nomor Meja"
              :rules="nomorRules"
              outlined
              required
            ></v-text-field>

          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="blue darken-1" text @click="cancel">
            Cancel
          </v-btn>

          <v-btn color="blue darken-1" text @click="setForm">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogCari" persistent max-width="600px">
      <v-card>
        <v-data-table :headers="headers" :items="mejas" :search="search">
          <template v-slot:top>
            <v-text-field
              v-model="search"
              clearable
              flat
              solo-inverted
              hide-details
              prepend-inner-icon="mdi-magnify"
              label="Search"
            ></v-text-field>
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <v-btn color="blue" fab dark small @click="editHandler(item)">
              <v-icon>mdi-circle-edit-outline</v-icon>
            </v-btn>

            <v-btn color="red" fab dark small @click="deleteHandler(item.id)">
              <v-icon>mdi-trash-can</v-icon>
            </v-btn>
          </template>
        </v-data-table>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="back">
            Back
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogConfirm" persistent max-width="400px">
      <v-card>
        <v-card-title>
          <span class="headline">Warning!</span>
        </v-card-title>

        <v-card-text>
          Anda yakin ingin menghapus Meja ini?
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="blue darken-1" text @click="dialogConfirm = false">
            Cancel
          </v-btn>

          <v-btn color="blue darken-1" text @click="deleteData">
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
      {{ error_message }}
    </v-snackbar>
  </v-main>
</template>
<script>
export default {
  no_meja: "List",
  data() {
    return {
      showMeja: false,
      show: false,
      inputType: "Tambah",
      load: false,
      snackbar: false,
      error_message: "",
      color: "",
      search: null,
      dialog: false,
      dialogEdit: false,
      dialogCari: false,
      dialogConfirm: false,
      headers: [
        {
          text: "Nomor Meja",
          align: "start",
          sortable: true,
          value: "no_meja",
        },
        { text: "Status Meja", value: "status_meja" },
        { text: "Actions", value: "actions" },
      ],
      meja: new FormData(),
      mejas: [],
      form: {
        no_meja: "",
        status_meja: "",
      },
      nomorRules: [(v) => !!v || "Nomor Meja tidak boleh kosong"],
      statusRules: [(v) => !!v || "Status meja tidak boleh kosong"],
      deleteId: "",
      editId: "",
    };
  },
  methods: {
    setForm() {
      if (this.inputType === "Tambah") {
        this.save();
      } else {
        this.update();
      }
    },
    back() {
      this.dialogCari = false;
    },
    //read data meja
    readData() {
      var url = this.$api + "/meja";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.mejas = response.data.data;
        });
    },
    //simpan data produk
    save() {
      if (this.$refs.form.validate()) {
        this.meja.append("no_meja", this.form.no_meja);
        this.meja.append("status_meja", 'tersedia');

        var url = this.$api + "/meja/";
        this.load = true;
        this.$http
          .post(url, this.meja, {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          })
          .then((response) => {
            this.error_message = response.data.message;
            this.color = "green";
            this.snackbar = true;
            this.load = false;
            this.close();
            this.readData(); //mengambil data
            this.resetForm();
          })
          .catch((error) => {
            this.error_message = error.response.data.message;
            this.color = "red";
            this.snackbar = true;
            this.load = false;
          });
      }
    },
    //ubah data produk
    update() {
      let newData = {
        no_meja: this.form.no_meja,
        status_meja: this.form.status_meja,
        notelp_meja: this.form.notelp_meja,
      };
      var url = this.$api + "/meja/" + this.editId;
      this.load = true;
      this.$http
        .put(url, newData, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.error_message = response.data.message;
          this.color = "green";
          this.snackbar = true;
          this.load = false;
          this.close();
          this.readData(); //mengambil data
          this.resetForm();
          this.inputType = "Tambah";
        })
        .catch((error) => {
          this.error_message = error.response.data.message;
          this.color = "red";
          this.snackbar = true;
          this.load = false;
        });
    },
    //hapus data produk
    deleteData() {
      //mengahapus data
      var url = this.$api + "/meja/" + this.deleteId;
      //data dihapus berdasarkan id
      this.$http
        .delete(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.error_message = response.data.message;
          this.color = "green";
          this.snackbar = true;
          this.load = false;
          this.close();
          this.readData(); //mengambil data
          this.resetForm();
          this.inputType = "Tambah";
        })
        .catch((error) => {
          this.error_message = error.response.data.message;
          this.color = "red";
          this.snackbar = true;
          this.load = false;
        });
    },
    editHandler(item) {
      this.inputType = "Ubah";
      this.editId = item.id;
      this.form.no_meja = item.no_meja;
      this.form.status_meja = item.status_meja;
      this.form.notelp_meja = item.notelp_meja;
      this.dialog = true;
    },
    deleteHandler(id) {
      this.deleteId = id;
      this.dialogConfirm = true;
    },
    close() {
      this.dialog = false;
      this.dialogEdit = false;
      this.dialogConfirm = false;
      this.inputType = "Tambah";
    },
    cancel() {
      this.resetForm();
      this.readData();
      this.dialog = false;
      this.dialogEdit = false;
      this.inputType = "Tambah";
    },
    resetForm() {
      this.$refs.form.reset();
    },
  },
  computed: {
    formTitle() {
      return this.inputType;
    },
  },
  mounted() {
    this.readData();
  },
};
</script>
