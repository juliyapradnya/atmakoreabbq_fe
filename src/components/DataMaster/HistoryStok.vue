<template>
  <v-main class="list">
    <h3 class="text-h3 font-weight-medium mb-5">Stok Keluar</h3>

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
        
      </v-card-title>

      <v-data-table :headers="headers" :items="historystok" :search="search">
        
      </v-data-table>
    </v-card>

    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }} Stok Keluar</span>
        </v-card-title>

        <v-card-text>
          <v-form v-model="valid" ref="form">
            <v-select
              v-model="form.id_bahan"
              :items="bahans"
              item-text="nama_bahan"
              item-value="id"
              label="Nama Bahan"
              outlined
              :rules="idBahanRules"
              required
            ></v-select>

            <v-text-field
              v-model="form.sisa_stok"
              label="Sisa Stok"
              outlined
              :rules="sisaRules"
              required
            ></v-text-field>

            <v-text-field
              v-model="form.jumlah_stok_keluar"
              label="Jumlah Stok Keluar"
              outlined
              :rules="keluarRules"
              required
            ></v-text-field>

            <v-text-field
              v-model="form.tanggal_history"
              label="Tanggal Stok Keluar"
              outlined
              :rules="TanggalRules"
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
          Anda yakin ingin menghapus data stok keluar ini?
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
        { text: "Jumlah Stok Keluar", value: "jumlah_stok_keluar" },
        { text: "Tanggal Stok Keluar", value: "tanggal_history" },
        
      ],
      historystoks: new FormData(),
      historystok: [],
      bahans: [],
      
      form: {
        id_bahan: null,
        sisa_stok: null,
        jumlah_stok_keluar: null,
        tanggal_history: null,
        
      },
      idBahanRules: [(v) => !!v || "Nama Bahan tidak boleh kosong"],
      sisaRules: [(v) => !!v || "Sisa stok tidak boleh kosong"],
      keluarMasukRules: [(v) => !!v || "Jumlah stok keluar tidak boleh kosong"],
      TanggalRules: [(v) => !!v || "Tanggal Stok keluar tidak boleh kosong"],
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

    //read data
    readData() {
      var url = this.$api + "/historystok";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.historystok = response.data.data;
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
        this.historystoks.append("id_bahan", this.form.id_bahan);
        this.historystoks.append("sisa_stok", this.form.sisa_stok);
        this.historystoks.append("jumlah_stok_keluar", this.form.jumlah_stok_keluar);
        this.historystoks.append("tanggal_history", this.form.tanggal_history);

        var url = this.$api + "/historystok/";
        this.load = true;
        this.$http
          .post(url, this.historystoks, {
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
        sisa_stok: this.form.sisa_stok,
        jumlah_stok_keluar: this.form.jumlah_stok_keluar,
        tanggal_history: this.form.tanggal_history,
        
      };
      var url = this.$api + "/historystok/" + this.editId;
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
      var url = this.$api + "/historystok/" + this.deleteId;
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
      this.form.sisa_stok = item.sisa_stok;
      this.form.jumlah_stok_keluar = item.jumlah_stok_keluar;
      this.form.tanggal_history = item.tanggal_history;
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
