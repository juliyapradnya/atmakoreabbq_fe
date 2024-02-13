<template>
  <v-main class="list">
    <h3 class="text-h3 font-weight-medium mb-5">Menu</h3>

    <v-card>
      <v-card-title>
        <v-text-field
          v-model="search"
          clearable
          flat
          solo-inverted
          hide-details
          prepend-inner-icon="mdi-magnify"
          label="Search"
        ></v-text-field>

        <v-spacer></v-spacer>
        <v-btn color="green" fab dark small @click="dialog = true">
          <v-icon>mdi-plus-circle</v-icon>
        </v-btn>
      </v-card-title>

      <v-data-table :headers="headers" :items="menu" :search="search">
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn color="blue" fab dark small @click="editHandler(item)">
            <v-icon>mdi-circle-edit-outline</v-icon>
          </v-btn>

          <v-btn color="red" fab dark small @click="deleteHandler(item.id)">
            <v-icon>mdi-trash-can</v-icon>
          </v-btn>
        </template>

        <template v-slot:[`item.deskripsi_menu`]="{ item }">
          <v-btn icon small dark @click="showDeskripsi(item)">
            <v-icon fab dark color="red">mdi-note-text</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="dialogDeskripsi" persistent max-width="600px">
      <v-card>
        <v-card-title class="headline blue lighten-2">
          Deskripsi Menu
        </v-card-title>
        <v-card-text>
          <h2 class="mt-10 my-font text">{{ menudesc }}</h2>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="dialogDeskripsi = false">Close </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }} Menu</span>
        </v-card-title>

        <v-card-text>
          <v-form v-model="valid" ref="form">
            <v-select
              v-model="form.id_bahan"
              :items="bahans"
              item-text="nama_bahan"
              item-value="id"
              label="Nama bahan"
              outlined
              :rules="idBahanRules"
              required
            ></v-select>

            <v-select
              v-model="form.jenis_menu"
              :items="['makanan utama', 'side dish', 'minuman']"
              label="Jenis Menu"
              outlined
              :rules="jenisMenuRules"
              required
            ></v-select>

            <v-text-field
              v-model="form.nama_menu"
              label="Nama Menu"
              outlined
              :rules="namaMenuRules"
              required
            ></v-text-field>

            <v-text-field
              v-model="form.deskripsi_menu"
              label="Deskripsi Menu"
              outlined
              :rules="descMenuRules"
              required
            ></v-text-field>

            <v-select
              v-model="form.unit_menu"
              :items="['plate', 'bowl', 'mini bowl', 'glass', 'bottle']"
              label="Unit Menu"
              outlined
              :rules="unitMenuRules"
              required
            ></v-select>

            <v-text-field
              v-model="form.harga_menu"
              label="Harga Menu"
              outlined
              :rules="hargaMenuRules"
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

    <v-dialog v-model="dialogConfirm" persistent max-width="400px">
      <v-card>
        <v-card-title>
          <span class="headline">warning!</span>
        </v-card-title>
        <v-card-text>
          Anda yakin ingin menghapus data menu ini?
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
  name: "List",
  data() {
    return {
      inputType: "Tambah",
      load: false,
      menudesc: null,
      snackbar: false,
      error_message: "",
      color: "",
      search: null,
      dialog: false,
      dialogConfirm: false,
      dialogDeskripsi: false,
      headers: [
        
        { text: "Nama bahan", value: "nama_bahan" },
        { text: "Jenis Menu", value: "jenis_menu" },
        { text: "Nama Menu", value: "nama_menu" },
        { text: "Deskripsi Menu", value: "deskripsi_menu" },
        { text: "Unit Menu", value: "unit_menu" },
        { text: "Harga Menu", value: "harga_menu" },
        { text: "Actions", value: "actions" },
      ],
      menus: new FormData(),
      menu: [],
      bahans: [],
      form: {
        id_bahan: null,
        jenis_menu: null,
        nama_menu: null,
        deskripsi_menu: null,
        unit_menu: null,
        harga_menu: null,
      },
      idBahanRules: [(v) => !!v || "Nama Bahan tidak boleh kosong"],
      jenisMenuRules: [(v) => !!v || "Jenis Menu tidak boleh kosong"],
      namaMenuRules: [(v) => !!v || "Nama Menu tidak boleh kosong"],
      descMenuRules: [(v) => !!v || "Deskripsi Menu tidak boleh kosong"],
      unitMenuRules: [(v) => !!v || "Unit Menu tidak boleh kosong"],
      hargaMenuRules: [(v) => !!v || "Harga Menu tidak boleh kosong"],
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

    showDeskripsi(item) {
      this.dialogDeskripsi = true;
      this.menudesc = item.deskripsi_menu;
    },
    //read data
    readData() {
      var url = this.$api + "/menu";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.menu = response.data.data;
        });
    },
    readDataBahan() {
      var url = this.$api + "/bahan";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.bahans = response.data.data;
        });
    },
    //simpan data produk
    save() {
      if (this.$refs.form.validate()) {
        this.menus.append("id_bahan", this.form.id_bahan);
        this.menus.append("nama_menu", this.form.nama_menu);
        this.menus.append("deskripsi_menu", this.form.deskripsi_menu);
        this.menus.append("jenis_menu", this.form.jenis_menu);
        this.menus.append("unit_menu", this.form.unit_menu);
        this.menus.append("harga_menu", this.form.harga_menu);

        var url = this.$api + "/menu/";
        this.load = true;
        this.$http
          .post(url, this.menus, {
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
    //ubah
    update() {
      let newData = {
        id_bahan: this.form.id_bahan,
        nama_menu: this.form.nama_menu,
        deskripsi_menu: this.form.deskripsi_menu,
        jenis_menu: this.form.jenis_menu,
        unit_menu: this.form.unit_menu,
        harga_menu: this.form.harga_menu,
      };
      var url = this.$api + "/menu/" + this.editId;
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
    //hapus
    deleteData() {
      //mengahapus data
      var url = this.$api + "/menu/" + this.deleteId;
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
      this.form.id_bahan = item.id_bahan;
      this.form.nama_menu = item.nama_menu;
      this.form.deskripsi_menu = item.deskripsi_menu;
      this.form.jenis_menu = item.jenis_menu;
      this.form.unit_menu = item.unit_menu;
      this.form.harga_menu = item.harga_menu;
      this.dialog = true;
    },
    deleteHandler(id) {
      this.deleteId = id;
      this.dialogConfirm = true;
    },
    close() {
      this.dialog = false;
      this.dialogConfirm = false;
      this.inputType = "Tambah";
    },
    cancel() {
      this.resetForm();
      this.readData();
      this.dialog = false;
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
    this.readDataBahan();
  },
};
</script>
