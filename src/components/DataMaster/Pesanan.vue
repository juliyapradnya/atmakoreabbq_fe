<template>
  <v-main class="list">
    <h3 class="text-h3 font-weight-medium mb-5">Pesanan</h3>

    <v-card>
      <v-card-title>
        <v-switch
          v-model="showPesanan"
          color="info"
          inset
          :label="`Pesanan Belum Disajikan`"
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

      <v-data-table v-if="showPesanan == false " :headers="headers" :items="pesanan" :search="search">

        <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            v-if="item.status_pesanan == 'selesai'"
            v-b-tooltip.hover.left="'Status'"
            icon
            small
            class="green"
            
          >
            <v-icon>mdi-checkbox-marked-circle-outline</v-icon>
          </v-btn>

          <v-btn
            v-if="item.status_pesanan == 'belum disajikan'"
            v-b-tooltip.hover.left="'Status'"
            icon
            small
            class="red"
            @click="changeStatus(item.id)"
          >
            <v-icon>mdi-close-circle</v-icon>
          </v-btn>

        </template>
      </v-data-table>

      <v-data-table v-if="showPesanan == true " :headers="headers" :items="belum" :search="search">
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            v-if="item.status_pesanan == 'belum disajikan'"
            v-b-tooltip.hover.left="'Status'"
            icon
            small
            class="red"
            @click="changeStatus(item.id)"
          >
            <v-icon>mdi-check-bold</v-icon>
          </v-btn>

        </template>
      </v-data-table>
      
    </v-card>


    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }} Pesanan</span>
        </v-card-title>

        <v-card-text>
          <v-form v-model="valid" ref="form">

            <v-select
              v-model="form.id_reservasi"
              :items="reservasis"
              item-text="no_meja"
              item-value="id"
              label="Nomor Meja"
              outlined
              :rules="idReseRules"
              required
            ></v-select>

            <v-select
              v-model="form.id_menu"
              :items="menus"
              item-text="nama_menu"
              item-value="id"
              label="Nama Menu"
              outlined
              :rules="idMenuRules"
              required
            ></v-select>

            <v-text-field
              v-model="form.qty"
              label="Qty"
              outlined
              :rules="qtyRules"
              required
            ></v-text-field>


            <v-select
              v-model="form.status_pesanan"
              :items="['belum disajikan', 'selesai']"
              label="Status Pesanan"
              outlined
              :rules="StatusRules"
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
          Anda yakin ingin menghapus data pesanan ini?
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
      showPesanan: false,
      load: false,
      snackbar: false,
      error_message: "",
      color: "",
      search: null,
      dialog: false,
      dialogConfirm: false,
      dialogDeskripsi: false,
      headers: [
        { text: "Nama customer", value: "nama_cust" },
        { text: "Nomor meja", value: "no_meja" },
        { text: "Nama Menu", value: "nama_menu" },
        { text: "QTY", value: "qty" },
        { text: "Harga", value: "harga" },
        { text: "Status Pesanan", value: "status_pesanan" },
        { text: "Actions", value: "actions" },
      ],
      pesanans: new FormData(),
      pesanan: [],
      customers: [],
      reservasis: [],
      menus:[],
      mejas: [],
      belums: [],
      form: {
        id_customer: null,
        id_reservasi: null,
        id_menu: null,
        qty: null,
        status_pesanan: null,
        
      },
      idReseRules: [(v) => !!v || "Nomor Meja tidak boleh kosong"],
      idMenuRules: [(v) => !!v || "Nama Menu tidak boleh kosong"],
      qtyRules: [(v) => !!v || "QTY tidak boleh kosong"],
      StatusRules: [(v) => !!v || "Status Pesanan tidak boleh kosong"],
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
      var url = this.$api + "/pesanan";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.pesanan = response.data.data;
        });
    },
    readDataBelum() {
      var url = this.$api + "/belum";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.belum = response.data.data;
        });
    },
    readDataCustomer() {
      var url = this.$api + "/customer";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.customers = response.data.data;
        });
    },
    readDataReservasi() {
      var url = this.$api + "/reservasi";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.reservasis = response.data.data;
        });
    },
    readDataMenu() {
      var url = this.$api + "/tampilmenu";
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
    //simpan data produk
    save() {
      if (this.$refs.form.validate()) {
        
        this.pesanans.append("id_reservasi", this.form.id_reservasi);
        this.pesanans.append("id_menu", this.form.id_menu);
        this.pesanans.append("qty", this.form.qty);
        this.pesanans.append("status_pesanan", this.form.status_pesanan);
        

        var url = this.$api + "/pesanan/";
        this.load = true;
        this.$http
          .post(url, this.pesanans, {
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
    
        id_reservasi: this.form.id_reservasi,
        id_menu: this.form.id_menu,
        qty: this.form.qty,
        status_pesanan: this.form.status_pesanan,
        
      };
      var url = this.$api + "/pesanan/" + this.editId;
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

    //ubah status
    changeStatus(id) {
      let newData = {
        status_pesanan: "selesai",
      };
      var url = this.$api + "/updateStatus/" + id;
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
      var url = this.$api + "/pesanan/" + this.deleteId;
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
      this.form.id_reservasi = item.id_reservasi;
      this.form.id_menu = item.id_menu;
      this.form.qty = item.qty;
      this.form.status_pesanan = item.status_pesanan;
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
    this.readDataCustomer();
    this.readDataReservasi();
    this.readDataMenu();
    this.readDataBelum();
  },
};
</script>
