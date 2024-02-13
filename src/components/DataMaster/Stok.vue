<template>
  <v-main class="list">
    <h3 class="text-h3 font-weight-medium mb-5">Stok Masuk</h3>

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

      <v-data-table :headers="headers" :items="stok" :search="search">
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn color="blue" fab dark small @click="editHandler(item)">
            <v-icon>mdi-circle-edit-outline</v-icon>
          </v-btn>

          <v-btn color="red" fab dark small @click="deleteHandler(item.id)">
            <v-icon>mdi-trash-can</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }} Stok</span>
        </v-card-title>

        <v-card-text>
          <v-form v-model="valid" ref="form">
            <v-select
              v-model="form.id_menu"
              :items="menus"
              item-text="nama_bahan"
              item-value="id"
              label="Nama Bahan"
              outlined
              :rules="idBahanRules"
              required
            ></v-select>

            <v-text-field
              v-model="form.jumlah_stok_masuk"
              label="Jumlah Stok Masuk"
              outlined
              :rules="StokMasukRules"
              required
            ></v-text-field>

            <v-text-field
              v-model="form.harga_stok"
              label="Harga Stok"
              outlined
              :rules="HargaRules"
              required
            ></v-text-field>

            <v-select
              v-model="form.unit_stok"
              :items="['g', 'ml']"
              label="Unit Stok"
              :rules="UnitRules"
              outlined
              required
           ></v-select>

            <v-menu
              v-model="menu"
              :close-on-content-click="false"
              transition="fade-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="date"
                  label="Tanggal Stok Masuk"
                  :rules="TanggalRules"
                  prepend-icon="mdi-calendar-month"
                  readonly
                  v-bind="attrs"
                  outlined
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="date"
                color="red lighten-1"
                max="new Date().toISOString().substr(0, 10)"
                @change="saveDate"
              ></v-date-picker>
            </v-menu>

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
          Anda yakin ingin menghapus data stok ini?
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
      snackbar: false,
      error_message: "",
      color: "",
      search: null,
      dialog: false,
      dialogConfirm: false,
      headers: [
        { text: "Nama Bahan", value: "nama_bahan" },
        { text: "Nama Karyawan", value: "nama_karyawan" },
        { text: "Jumlah Stok Masuk", value: "jumlah_stok_masuk" },
        { text: "Harga Stok", value: "harga_stok" },
        { text: "Unit Stok", value: "unit_stok" },
        { text: "Tanggal Stok Masuk", value: "tanggal_stok_masuk" },
        { text: "Actions", value: "actions" },
      ],
      stoks: new FormData(),
      stok: [],
      bahans: [],
      menus: [],
      karyawans: [],
      form: {
        id_bahan: null,
        id_karyawan: null,
        jumlah_stok_masuk: null,
        harga_stok: null,
        unit_stok: null,
        tanggal_stok_masuk: null,
        
      },
      idBahanRules: [(v) => !!v || "Nama Bahan tidak boleh kosong"],
      idKaryawanRules: [(v) => !!v || "Nama Karyawan tidak boleh kosong"],
      UnitRules: [(v) => !!v || "Unit stok tidak boleh kosong"],
      StokMasukRules: [(v) => !!v || "Jumlah stok tidak boleh kosong"],
      HargaRules: [(v) => !!v || "Harga stok tidak boleh kosong"],
      TanggalRules: [(v) => !!v || "Tanggal Stok Masuk tidak boleh kosong"],
      deleteId: "",
      editId: "",
      date: null,
      menu: false,
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

    //read data
    readData() {
      var url = this.$api + "/stok";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.stok = response.data.data;
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
    readDataMenu() {
      var url = this.$api + "/menu";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.menus = response.data.data;
        });
    },
    readDataKaryawan() {
      var url = this.$api + "/karyawan";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.karyawans = response.data.data;
        });
    },
    //simpan data produk
    save() {
      if (this.$refs.form.validate()) {
        this.stoks.append("id_menu", this.form.id_menu);
        this.stoks.append("id_karyawan", localStorage.getItem("id"));
        this.stoks.append("jumlah_stok_masuk", this.form.jumlah_stok_masuk);
        this.stoks.append("harga_stok", this.form.harga_stok);
        this.stoks.append("unit_stok", this.form.unit_stok);
        this.stoks.append("tanggal_stok_masuk", this.date);

        var url = this.$api + "/stok/";
        this.load = true;
        this.$http
          .post(url, this.stoks, {
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
        id_menu: this.form.id_menu,
        id_karyawan: localStorage.getItem("id"),
        jumlah_stok_masuk: this.form.jumlah_stok_masuk,
        harga_stok: this.form.harga_stok,
        unit_stok: this.form.unit_stok,
        tanggal_stok_masuk: this.form.tanggal_stok_masuk,
        
      };
      var url = this.$api + "/stok/" + this.editId;
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
      var url = this.$api + "/stok/" + this.deleteId;
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
      this.form.id_menu = item.id_menu;
      this.form.id_karyawan = item.id_karyawan;
      this.form.jumlah_stok_masuk = item.jumlah_stok_masuk;
      this.form.harga_stok = item.harga_stok;
      this.form.unit_stok = item.unit_stok;
      this.form.tanggal_stok_masuk = item.tanggal_stok_masuk;
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
    saveDate(date){
      this.$refs.menu.saveDate(date);
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
    this.readDataKaryawan();
    this.readDataMenu();
  },
};
</script>
