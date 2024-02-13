<template>
  <v-main class="list">
    <h3 class="text-h3 font-weight-medium mb-5">Reservasi</h3>

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

      <v-data-table :headers="headers" :items="reservasi" :search="search">
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn color="blue" fab dark small @click="editHandler(item)">
            <v-icon>mdi-circle-edit-outline</v-icon>
          </v-btn>

          <v-btn color="red" fab dark small @click="deleteHandler(item.id)">
            <v-icon>mdi-trash-can</v-icon>
          </v-btn>
          
          <v-btn :disabled="item.status_reservasi=='selesai'" color="green" fab dark small @click="qrCode(item)">
            <v-icon>mdi-qrcode</v-icon>
          </v-btn>

        </template>
      </v-data-table>
    </v-card>

    <v-dialog
      data-aos="zoom-in"
      v-model="dialogqr"
      persistent
      max-width="500px"
    >
      <v-card>
        
        <v-card-text class="mt-4 px-10 text-center">
          <v-img
            data-aos="zoom-in"
            :src="require('@/assets/akblogo.png')"
            class="mx-auto"
            max-width="150"
          />
          <qrcode-vue :value="value" :size="size" level="H" />
          <p class="mb-5 font3">Printed by {{ qr.name }}</p>
          <p class="mt-5 font2">{{ today }}</p>
          <v-spacer></v-spacer>
          <p class="fontBottom mt-4 mb-4">
            ---------------------------------------------
          </p>
          <p class="fontBottom mt-4 mb-4">FUN PLACE TO GRILL</p>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn text color="blue" @click="dialogqr = false">Tutup</v-btn>
          <v-btn text color="blue" @click="cetak()">Cetak</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }} Reservasi</span>
        </v-card-title>

        <v-card-text>
          <v-form v-model="valid" ref="form">
            <v-select
              v-model="form.id_customer"
              :items="customers"
              item-text="nama_cust"
              item-value="id"
              label="Nama Customer"
              outlined
              :rules="idCustRules"
              required
            ></v-select>

            <v-select
              v-model="form.id_meja"
              :items="mejas"
              item-text="no_meja"
              item-value="id"
              label="Nomor Meja"
              outlined
              :rules="idMejaRules"
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
                  label="Tanggal Reservasi"
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

            <v-select
              v-model="form.jam_reservasi"
              :items="['lunch', 'dinner']"
              label="Sesi Reservasi"
              outlined
              :rules="JamRules"
              required
            ></v-select>

            <v-select
              v-model="form.status_reservasi"
              :items="['belum selesai', 'selesai']"
              label="Status Reservasi"
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
          Anda yakin ingin menghapus data reservasi ini?
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

    <template>
      <div>
        <vue-html2pdf
          :show-layout="false"
          :float-layout="true"
          :enable-download="true"
          :preview-modal="true"
          :paginate-elements-by-height="1200"
          :filename="
            'ReservasiQR-' +
              id_customer +
              '-' +
              id_reservasi +
              '-' +
              id_karyawan
          "
          :pdf-quality="2"
          :manual-pagination="false"
          pdf-orientation="portrait"
          pdf-content-width="550px"
          pdf-format="a5"
          @progress="onProgress($event)"
          @hasStartedGeneration="hasStartedGeneration()"
          @hasGenerated="hasGenerated($event)"
          ref="html2Pdf"
        >
          <section slot="pdf-content" class="text-center mt-6">
            <img
              :src="image.sample"
              class="mx-auto mt-5"
              style="max-width:150px"
            />

            <qrcode-vue :value="value" :size="size" level="H" />
            <p class="mb-1 font3">Printed by {{ qr.name }}</p>
            <p class="mt-1 font2">{{ today }}</p>
            <p class="fontBottom mt-1 mb-1">
              ---------------------------------------------
            </p>
            <p class="fontBottom mt-1 mb-1">FUN PLACE TO GRILL</p>
          </section>
        </vue-html2pdf>
      </div>
    </template>

    <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
      {{ error_message }}
    </v-snackbar>
  </v-main>
</template>
<script>
import moment from "moment";
import QrcodeVue from "qrcode.vue";
import VueHtml2pdf from "vue-html2pdf";
export default {
  name: "List",
  data() {
    return {
      image: {
        sample: require("@/assets/akblogo.png"),
      },
      inputType: "Tambah",
      load: false,
      snackbar: false,
      error_message: "",
      color: "",
      search: null,
      dialog: false,
      dialogConfirm: false,
      dialogqr: false,
      value: "",
      size: 200,
      headers: [
        { text: "Nama customer", value: "nama_cust" },
        { text: "Nomor meja", value: "no_meja" },
        { text: "Nama Karyawan", value: "nama_karyawan" },
        { text: "Tanggal Reservasi", value: "created_at" },
        { text: "Tanggal Datang", value: "tgl_reservasi" },
        { text: "Sesi Reservasi", value: "jam_reservasi" },
        { text: "Status Reservasi", value: "status_reservasi" },
        { text: "Actions", value: "actions" },
      ],
      reservasis: new FormData(),
      reservasi: [],
      customers: [],
      mejas: [],
      users: [],
      qr: [],
      today: null,
      form: {
        id_customer: null,
        id_meja: null,
        tgl_reservasi: null,
        jam_reservasi: null,
        status_reservasi: null,
        
      },
      idCustRules: [(v) => !!v || "Nama Customer tidak boleh kosong"],
      idMejaRules: [(v) => !!v || "Nomor Meja tidak boleh kosong"],
      TglRules: [(v) => !!v || "Tanggal Rservasi tidak boleh kosong"],
      JamRules: [(v) => !!v || "Sesi Reservasi tidak boleh kosong"],
      StatusRules: [(v) => !!v || "Status Reservasi tidak boleh kosong"],
      deleteId: "",
      editId: "",
      date: null,
      menu: false,
    };
  },
  components: {
    QrcodeVue,
    VueHtml2pdf,
  },
  methods: {
    setForm() {
      if (this.inputType === "Tambah") {
        this.save();
      } else {
        this.update();
      }
    },
    cetak() {
      this.$refs.html2Pdf.generatePdf();
    },

    //read data
    readData() {
      var url = this.$api + "/reservasi";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.reservasi = response.data.data;
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
    readDataMeja() {
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
    readDataKaryawan() {
      var url = this.$api + "/user";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.users = response.data.data;
        });
    },
    //simpan data produk
    save() {
      if (this.$refs.form.validate()) {
        this.reservasis.append("id_customer", this.form.id_customer);
        this.reservasis.append("id_meja", this.form.id_meja);
        this.reservasis.append("id_karyawan", localStorage.getItem("id"));
        this.reservasis.append("tgl_reservasi", this.date);
        this.reservasis.append("jam_reservasi", this.form.jam_reservasi);
        this.reservasis.append("status_reservasi", this.form.status_reservasi);
        

        var url = this.$api + "/reservasi/";
        this.load = true;
        this.$http
          .post(url, this.reservasis, {
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
        id_customer: this.form.id_customer,
        id_meja: this.form.id_meja,
        id_karyawan: localStorage.getItem("id"),
        tgl_reservasi: this.form.tgl_reservasi,
        jam_reservasi: this.form.jam_reservasi,
        status_reservasi: this.form.status_reservasi,
        
      };
      var url = this.$api + "/reservasi/" + this.editId;
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
      var url = this.$api + "/reservasi/" + this.deleteId;
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
      this.form.id_customer = item.id_customer;
      this.form.id_meja = item.id_meja;
      this.form.tgl_reservasi = item.tgl_reservasi;
      this.form.jam_reservasi = item.jam_reservasi;
      this.form.status_reservasi = item.status_reservasi;
      this.dialog = true;
    },
    deleteHandler(id) {
      this.deleteId = id;
      this.dialogConfirm = true;
    },
    qrCode(item) {
      this.qr = item;
      this.qr.name = item.nama_karyawan;
      this.id_karyawan = item.id_karyawan;
      this.value = "Id : "+ item.id+"\n"+
                   "Nama : "+ item.nama_cust+"\n"+
                   "Meja : "+ item.no_meja;
      this.id_reservasi = item.id;
      this.id_customer = item.id_customer;
      this.dialogqr = true;
      
      this.today = moment
        .tz(moment(), "Asia/Jakarta")
        .format("MMM DD, YYYY h:mm:ss A");
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
    this.readDataCustomer();
    this.readDataMeja();
    this.readDataKaryawan();
  },
};
</script>


