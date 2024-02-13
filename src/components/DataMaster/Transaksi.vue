<template>
  <v-main class="list">
    <h3 class="text-h3 font-weight-medium mb-5">Transaksi</h3>

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

      <v-data-table :headers="headers" :items="transaksi" :search="search">
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn color="blue" fab dark small @click="tampilStruk(item); 
          readDataPesananReservasi(item.id_reservasi); 
          readDataJumlahQty(item.id_reservasi);
          readDataCount(item.id_reservasi)">
            <v-icon>mdi-note-text</v-icon>
          </v-btn>

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
          <span class="headline">{{ formTitle }} Transaksi</span>
        </v-card-title>

        <v-card-text>
          <v-form v-model="valid" ref="form">
            <v-select
              v-model="form.id_pesanan"
              :items="pesanans"
              item-text="no_meja"
              item-value="id"
              label="Nomor Meja"
              outlined
              :rules="idBahanRules"
              required
            ></v-select>

            <v-select
              v-model="form.jenis_pembayaran"
              :items="['cash', 'debit', 'kredit']"
              label="Jenis Pembayaran"
              :rules="SatuanRules"
              outlined
              required
           ></v-select>

           <v-text-field
              v-if="
                form.jenis_pembayaran == 'debit' ||
                  form.jenis_pembayaran == 'kredit'
              "
              v-model="form.no_kartu"
              label="Nomor Kartu"
              :rules="totalRules"
              required
              outlined
            ></v-text-field>

            <!-- <v-text-field
              v-if="
                form.jenis_pembayaran == 'debit' ||
                  form.jenis_pembayaran == 'kredit'
              "
              v-model="form.nama_pemilik_kartu"
              label="Nama Pemilik Kartu"
              :rules="totalRules"
              required
              outlined
            ></v-text-field> -->

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

    <v-dialog v-model="dialogStruk" persistent max-width="700">
      <v-card>
        <div id="printStrukTransaksi">
          <v-card-text class="mt-3 px-10 py-15 text-center">
            <div>
              <v-img
                :src="require('@/assets/struk.jpeg')"
                class=' mx-auto'
                max-width="500"
              />
              <hr style="height:2px" />
              <p style="float:left; text-align:left" class="mt-0 font1">
                Receipt # {{ kode_transaksi }} <br />Waiter {{ nama_karyawan }}
              </p>
              <p class="mt-0 font1" style="text-align:right">
                Date {{ tgl_transaksi }} <br />Time {{ time }}
              </p>
              <hr style="height:2px" />
              <p style="float:left" class="mt-0 font1 teksPosition">
                Table # {{ no_meja }}
              </p>
              <p style="text-align:right" class="mt-0 font1 teksPositionKanan1">
                Customer {{ nama_cust }}
              </p>
              <hr style="height:2px" />
              <v-data-table
                :hide-default-footer="true"
                :headers="headersPesananReservasi"
                :items="pesananreservasis"
                :search="search"
              >
                <template v-slot:[`item.harga_menu`]="{ item }">
                  Rp. {{ item.harga_menu }}
                </template>
                <template v-slot:[`item.harga`]="{ item }">
                  Rp. {{ item.harga }}
                </template>
              </v-data-table>
              <hr style="height:5px" />
              <p style="text-align:right" class="mb-0 font2 teksHarga">
                Sub Total Rp.{{ total_sub_total }}
              </p>
              <p style="text-align:right" class="mb-1 font2 teksHarga">
                Service 5% Rp.{{ service }}
              </p>
              <p style="text-align:right" class="mb-1 font2 teksHarga">
                Tax 10% Rp.{{ tax }}
              </p>
              <hr style="height:2px" />
              <p style="text-align:right" class="mb-0 font2 teksHarga">
                Total Rp.{{ total_harga }}
              </p>
              <hr style="height:2px" />
              <p style="text-align:right" class="mb-1 font3 teksHarga">
                Total Qty: {{ pesananjumlahs }}
              </p>
              <p style="text-align:right" class="mb-1 font3 teksHarga">
                Total Item: {{ pesanancounts }}
              </p>
              <p style="text-align:right" class="mb-1 font3 teksHarga">
                Printed {{ today }}
              </p>
              <p style="text-align:right" class="mb-1 font3 teksHarga">
                Cashier: {{ nama_kasir }}
              </p>
              <hr style="height:2px" />
              <p style="text-align:center" class="fontBottom mt-0 mb-0">
                THANK YOU FOR YOUR VISIT
              </p>
              <hr style="height:2px" />
            </div>
          </v-card-text>
        </div>
        <v-card-actions class="justify-end">
          <v-btn color="blue darken-1" text @click="dialogStruk = false">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="cetak()">Cetak</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogConfirm" persistent max-width="400px">
      <v-card>
        <v-card-title>
          <span class="headline">warning!</span>
        </v-card-title>
        <v-card-text>
          Anda yakin ingin menghapus data transaksi ini?
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
import moment from "moment";
import html2PDF from "jspdf-html2canvas";
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
      dialogStruk: false,
      headers: [
        { text: "Kode Transaksi", value: "kode_transaksi" },
        { text: "Nama Customer", value: "nama_cust" },
        { text: "Nama Karyawan", value: "nama_karyawan" },
        { text: "Nomor Meja", value: "no_meja" },
        { text: "Jenis Pembayaran", value: "jenis_pembayaran" },
        { text: "Nomor Kartu", value: "no_kartu" },
        // { text: "Nama Pemilik Kartu", value: "nama_pemilik_kartu" },
        // { text: "Kode Verifikasi", value: "kode_verifikasi" },
        { text: "Tanggal Transaksi", value: "tgl_transaksi" },
        { text: "Total Harga", value: "total_harga" },
        { text: "Actions", value: "actions" },
      ],
      headersPesananReservasi: [
        {
          text: "QTY",
          align: "start",
          sortable: true,
          value: "qty",
        },
        {text: "Menu", value: "nama_menu"},
        {text: "Harga", value: "harga_menu"},
        {text: "Sub Total", value: "harga"},
      ],
      transaksis: new FormData(),
      transaksi: [],
      pesanans: [],
      users: [],
      pesananreservasis: [],
      pesananjumlahs: [],
      pesanancounts: [],
      form: {
        id_pesanan: null,
        id_karyawan: null,
        jenis_pembayaran: null,
        no_kartu: "",
        nama_pemilik_kartu: "",
        kode_verifikasi: "",
        tgl_transaksi: null,
        total_sub_total: null,
        service: null,
        tax: null,
        total_harga: null,
        
      },
      idBahanRules: [(v) => !!v || "Nama Bahan tidak boleh kosong"],
      idKaryawanRules: [(v) => !!v || "Nama Karyawan tidak boleh kosong"],
      transaksiRules: [(v) => !!v || "Jumlah stok terbuang tidak boleh kosong"],
      SatuanRules: [(v) => !!v || "Satuan tidak boleh kosong"],
      TanggalRules: [(v) => !!v || "Tanggal Stok Terbuang tidak boleh kosong"],
      deleteId: "",
      editId: "",
      date: null,
      //pesanan: false,
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

  cetak() {
      let print = document.getElementById("printStrukTransaksi");
      html2PDF(print, {
        jsPDF: { format: "A4" },
        html2canvas: {
          scrollX: 0,
          scrollY: -window.scrollY,
        },
        output: "StrukAKB",
      });
    },
    //read data
    readData() {
      var url = this.$api + "/transaksi";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.transaksi = response.data.data;
        });
    },
    readDataPesanan() {
      var url = this.$api + "/pesananDisajikan";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.pesanans = response.data.data;
        });
    },
    readDataUsers() {
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
    readDataPesananReservasi(id) {
      var url = this.$api + "/pesananReservasi/"+id;
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.pesananreservasis = response.data.data;
        });
    },
    readDataJumlahQty(id) {
      var url = this.$api + "/pesananJumlah/"+id;
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.pesananjumlahs = response.data.data;
        });
    },
    readDataCount(id) {
      var url = this.$api + "/pesananCount/"+id;
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.pesanancounts = response.data.data;
        });
    },
    tampilStruk(item) {
      this.nama_karyawan = item.nama_karyawan;
      this.nama_kasir = localStorage.getItem("nama_karyawan");
      this.id = item.id;
      this.kode_transaksi = item.kode_transaksi;
      this.id_reservasi = item.id_reservasi;
      this.nama_cust = item.nama_cust;
      this.no_meja = item.no_meja;
      this.tgl_transaksi = item.tgl_transaksi;
      this.total_sub_total = item.total_sub_total;
      this.service = item.service;
      this.tax = item.tax;
      this.total_harga = item.total_harga;
      this.dialogStruk = true;
      this.today = moment 
        .tz(moment(), "Asia/Jakarta")
        .format("MMM DD, YYYY h:mm:ss A");

      this.time = moment.tz(moment(), "Asia/Jakarta").format("HH:mm");
    },


    //simpan data produk
    save() {
      if (this.$refs.form.validate()) {
        this.transaksis.append("id_pesanan", this.form.id_pesanan);
        this.transaksis.append("id_karyawan", localStorage.getItem("id"));
        //this.transaksis.append("kode_transaksi", this.form.kode_transaksi);
        this.transaksis.append("jenis_pembayaran", this.form.jenis_pembayaran);
        this.transaksis.append("no_kartu", this.form.no_kartu);
        this.transaksis.append("nama_pemilik_kartu", this.form.nama_pemilik_kartu);
        this.transaksis.append("kode_verifikasi", "123" + this.count);
        //this.transaksis.append("tgl_transaksi", this.date);
        //this.transaksis.append("total_sub_total", this.form.total_sub_total);
        //this.transaksis.append("service", this.form.service);
        //this.transaksis.append("tax", this.form.tax);
        //this.transaksis.append("total_harga", this.form.no_kartu);

        var url = this.$api + "/transaksi/";
        this.load = true;
        this.$http
          .post(url, this.transaksis, {
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
        kode_transaksi: this.form.kode_transaksi,
        id_pesanan: this.form.id_pesanan,
        id_karyawan: localStorage.getItem("id"),
        jenis_pembayaran: this.form.jenis_pembayaran,
        no_kartu: this.form.no_kartu,
        nama_pemilik_kartu: this.form.nama_pemilik_kartu,
        kode_verifikasi: this.form.kode_verifikasi,
        tgl_transaksi: this.form.tgl_transaksi,
        
      };
      var url = this.$api + "/transaksi/" + this.editId;
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
      var url = this.$api + "/transaksi/" + this.deleteId;
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
      this.form.kode_transaksi = item.kode_transaksi;
      this.form.id_pesanan = item.id_pesanan;
      this.form.id_karyawan = item.id_karyawan;
      this.form.jenis_pembayaran = item.jenis_pembayaran;
      this.form.no_kartu = item.no_kartu;
      this.form.nama_pemilik_kartu = item.nama_pemilik_kartu;
      this.form.kode_verifikasi = item.kode_verifikasi;
      this.form.tgl_transaksi = item.tgl_transaksi;
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
    this.readDataPesanan();
    this.readDataKaryawan();
  },
};
</script>
