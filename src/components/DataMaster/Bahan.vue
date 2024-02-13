<template>
  <v-main class="list">
    <h3 class="text-h3 font-weight-medium mb-5">Bahan</h3>

    <v-card>
      <v-card-title>
        <v-switch
          v-model="showBahanHabis"
          color="info"
          inset
          :label="`Stok Bahan Habis`"
        ></v-switch>
        <v-spacer></v-spacer>
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

      <v-data-table v-if="showBahanHabis == false" :headers="headers" :items="bahan" :search="search">
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn color="blue" fab dark small @click="editHandler(item)">
            <v-icon>mdi-circle-edit-outline</v-icon>
          </v-btn>

          <v-btn color="red" fab dark small @click="deleteHandler(item.id)">
            <v-icon>mdi-trash-can</v-icon>
          </v-btn>
        </template>
      </v-data-table>

      <v-data-table v-if="showBahanHabis == true" :headers="headers" :items="bahanhabis" :search="search">
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
          <span class="headline">{{ formTitle }} Bahan</span>
        </v-card-title>

        <v-card-text>
          <v-form v-model="valid" ref="form">
            <v-text-field
              v-model="form.nama_bahan"
              label="Nama Bahan"
              :rules="namaBahanRules"
              outlined
              required
            ></v-text-field>

            <v-select
              v-model="form.unit_bahan"
              :items="['plate', 'bowl', 'mini bowl', 'glass', 'bottle']"
              label="Unit Bahan"
              :rules="unitBahanRules"
              outlined
              required
            ></v-select>

            <v-text-field
              v-model="form.jumlah_bahan"
              label="Jumlah Bahan"
              :rules="jumlahBahanRules"
              outlined
              required
            ></v-text-field>

            <v-text-field
              v-model="form.serving_size"
              label="Serving Size"
              :rules="servingSizeRules"
              outlined
              required
            ></v-text-field>

           <v-select
              v-model="form.satuan"
              :items="['g', 'ml']"
              label="satuan"
              :rules="satuanStokRules"
              outlined
              required
           ></v-select>
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
          Anda yakin ingin menghapus data bahan ini?
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
      showBahanHabis: false,
      load: false,
      snackbar: false,
      error_message: "",
      color: "",
      search: null,
      dialog: false,
      dialogConfirm: false,
      headers: [
        {
          text: "Nama Bahan",
          align: "start",
          sortable: true,
          value: "nama_bahan",
        },
        { text: "Unit Bahan", value: "unit_bahan" },
        { text: "Jumlah Bahan", value: "jumlah_bahan" },
        { text: "Serving Size", value: "serving_size" },
        { text: "Satuan", value: "satuan" },
        { text: "Actions", value: "actions" },
      ],
      bahans: new FormData(),
      bahan: [],
      form: {
        nama_bahan: null,
        unit_bahan: null,
        jumlah_bahan: null,
        serving_size: null,
        satuan: null,
      },
      namaBahanRules: [(v) => !!v || "Nama Bahan tidak boleh kosong"],
      unitBahanRules: [(v) => !!v || "Unit Bahan tidak boleh kosong"],
      jumlahBahanRules: [(v) => !!v || "Jumlah Bahan tidak boleh kosong"],
      servingSizeRules: [(v) => !!v || "Serving Size tidak boleh kosong"],
      satuanStokRules: [(v) => !!v || "satuan Stok tidak boleh kosong"],
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
      var url = this.$api + "/bahan";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.bahan = response.data.data;
        });
    },
    readStokBahanHabis() {
      var url = this.$api + "/bahanhabis";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.bahanhabis = response.data.data;
        });
    },
    //simpan data produk
    save() {
        if (this.$refs.form.validate()) {
        this.bahans.append("nama_bahan", this.form.nama_bahan);
        this.bahans.append("unit_bahan", this.form.unit_bahan);
        this.bahans.append("jumlah_bahan", this.form.jumlah_bahan);
        this.bahans.append("serving_size", this.form.serving_size);
        this.bahans.append("satuan", this.form.satuan);

        var url = this.$api + "/bahan/";
        this.load = true;
        this.$http
          .post(url, this.bahans, {
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
        nama_bahan: this.form.nama_bahan,
        unit_bahan: this.form.unit_bahan,
        jumlah_bahan: this.form.jumlah_bahan,
        serving_size: this.form.serving_size,
        satuan: this.form.satuan,
      };
      var url = this.$api + "/bahan/" + this.editId;
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
      var url = this.$api + "/bahan/" + this.deleteId;
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
      this.form.nama_bahan = item.nama_bahan;
      this.form.unit_bahan = item.unit_bahan;
      this.form.jumlah_bahan = item.jumlah_bahan;
      this.form.serving_size = item.serving_size;
      this.form.satuan = item.satuan;
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
    this.readStokBahanHabis();
  },
};
</script>
