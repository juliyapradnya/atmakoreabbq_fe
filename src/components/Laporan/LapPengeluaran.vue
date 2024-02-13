<template>
  <v-main class="list">
    <v-card class="mx-auto" max-width="600" outlined>
      <v-list-item three-line>
        <v-list-item-content>
          <v-list-item-title class="text-h3 mb-1">
            Laporan Pengeluaran
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-card-actions>
        <v-btn outlined rounded text @click="dialogTahunan = true">
          Laporan Tahunan
        </v-btn>
        <v-btn outlined rounded text @click="dialogBulanan = true">
          Laporan Bulanan
        </v-btn>
      </v-card-actions>

      <v-dialog v-model="dialogTahunan" persistent max-width="700px">
        <v-card>
          
            <span class="headline"
              >{{ formTitle }} Laporan Penjualan Tahunan
            </span>
          
          <v-card-text>
            <v-form v-model="valid" ref="form">
              <v-select
                v-model="tahun1"
                :items="years"
                label="Tahun"
                required
              ></v-select>
              <v-select
                v-model="tahun2"
                :items="years"
                label="Tahun"
                required
              ></v-select>
            </v-form>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
              color="blue"
              dark
              @click="
                dialogTahunan = false;
                resetForm();
              "
            >
              Back
            </v-btn>

            <v-btn
              color="blue"
              dark
              @click="
                dialogTahunan = false;
                readPengeluaranMakananTahunan(tahun1,tahun2);
                readPengeluaranMinumanTahunan(tahun1,tahun2);
                readPengeluaranSideTahunan(tahun1,tahun2);
                dialogLaporanPengeluaranTahunan = true;
              "
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialogBulanan" persistent max-width="450px">
        <v-card>
          
            <span class="headline"
              >{{ formTitle }} Laporan Penjualan Bulanan
            </span>
          
          <v-card-text>
            <v-form v-model="valid" ref="form">
              <v-select
                v-model="tahun"
                :items="years"
                label="Tahun"
                required
              ></v-select>
            </v-form>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
              color="blue"
              dark
              @click="
                dialogBulanan = false;
                resetForm();
              "
            >
              Back
            </v-btn>

            <v-btn
              color="blue"
              dark
              @click="
                dialogBulanan = false;
                readPengeluaranMakananBulanan(tahun);
                readPengeluaranMinumanBulanan(tahun);
                readPengeluaranSideBulanan(tahun);
                dialogLaporanPengeluaranBulanan = true;
              "
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialogLaporanPengeluaranBulanan" persistent max-width="800px">
      <v-card>
        
        <div id="printLaporanPengeluaranBulanan">
          <v-card-text class="mt-2 px-12 py-15 text-center">
            <div>
              <img
                :src="require('@/assets/struk.jpeg')"
                class="mx-auto"
                width="500"
              />
              <hr />
              <p class="mt-0 fontBottom ">
                LAPORAN PENGELUARAN BULANAN
              </p>
              <p style="text-align:left" >TAHUN: {{ tahun }}</p>
              <hr />
              <p style="text-align:left" >
                MAKANAN
              </p>
              <hr />
              <v-data-table
                :hide-default-footer="true"
                :headers="headersPengeluaranBulanan"
                :items="makananBulanan"
                :search="search"
              >
                <template v-slot:[`item.sub_total`]="{ item }">
                  Rp. {{ item.sub_total }}
                </template>
              </v-data-table>
              <hr />
              <p style="text-align:left">
                MINUMAN
              </p>
              <hr />
              <v-data-table
                :hide-default-footer="true"
                :headers="headersPengeluaranBulanan"
                :items="minumanBulanan"
                :search="search"
              >
                <template v-slot:[`item.sub_total`]="{ item }">
                  Rp. {{ item.sub_total }}
                </template>
              </v-data-table>
              <hr />
              <p style="text-align:left">
                SIDE DISH
              </p>
              <hr />
              <v-data-table
                :hide-default-footer="true"
                :headers="headersPengeluaranBulanan"
                :items="sideDishBulanan"
                :search="search"
              >
                <template v-slot:[`item.sub_total`]="{ item }">
                  Rp. {{ item.sub_total }}
                </template>
              </v-data-table>
              <hr />
              <hr />
              <p style="text-align:center" class="mt-1 ">Printed {{ today }}</p>
              <p style="text-align:center" class="mt-1 ">Printed by {{ namaKaryawan }}</p>
            </div>
          </v-card-text>
        </div>
        <v-card-actions class="justify-end">
          <v-btn
            text
            color="blue"
            @click="
              dialogLaporanPengeluaranBulanan = false;
              resetForm();
              resetTabel();
            "
            >Cancel</v-btn
          >
          <v-btn text color="blue" @click="cetakPengeluaranBulanan()">Cetak</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

      <v-dialog v-model="dialogLaporanPengeluaranTahunan" persistent max-width="800px">
      <v-card>
        
        <div id="printLaporanPengeluaranTahunan">
          <v-card-text class="mt-2 px-12 py-15 text-center">
            <div>
              <img
                :src="require('@/assets/struk.jpeg')"
                class="mx-auto"
                width="500"
              />
              <hr />
              <p class="mt-0 fontBottom ">
                LAPORAN PENGELUARAN BULANAN
              </p>
              <p style="text-align:left">TAHUN: {{ tahun1 }} s/d {{tahun2}}</p>
              <hr />
              <p style="text-align:left">
                MAKANAN
              </p>
              <hr />
              <v-data-table
                :hide-default-footer="true"
                :headers="headersPengeluaranTahunan"
                :items="makanan"
                :search="search"
              >
                <template v-slot:[`item.sub_total`]="{ item }">
                  Rp. {{ item.sub_total }}
                </template>
              </v-data-table>
              <hr />
              <p style="text-align:left">
                MINUMAN
              </p>
              <hr />
              <v-data-table
                :hide-default-footer="true"
                :headers="headersPengeluaranTahunan"
                :items="minuman"
                :search="search"
              >
                <template v-slot:[`item.sub_total`]="{ item }">
                  Rp. {{ item.sub_total }}
                </template>
              </v-data-table>
              <hr />
              <p style="text-align:left" >
                SIDE DISH
              </p>
              <hr />
              <v-data-table
                :hide-default-footer="true"
                :headers="headersPengeluaranTahunan"
                :items="sideDish"
                :search="search"
              >
                <template v-slot:[`item.sub_total`]="{ item }">
                  Rp. {{ item.sub_total }}
                </template>
              </v-data-table>
              <hr />
              <hr />
              <p style="text-align:center" class="mt-1">Printed {{ today }}</p>
              <p style="text-align:center" class="mt-1">Printed by {{ namaKaryawan }}</p>
            </div>
          </v-card-text>
        </div>
        <v-card-actions class="justify-end">
          <v-btn
            text
            color="blue"
            @click="
              dialogLaporanPengeluaranTahunan = false;
              resetForm();
              resetTabel();
            "
            >Cancel</v-btn
          >
          <v-btn text color="blue" @click="cetakPengeluaranTahunan()">Cetak</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    </v-card>
  </v-main>
</template>
<script>
import moment from "moment";
import html2PDF from "jspdf-html2canvas";
// import { MonthPicker } from "vue-month-picker";
export default {
  name: "List",
  data() {
    return {
      dialogTahunan: false,
      dialogBulanan: false,
      dialogLaporanPengeluaranTahunan: false,
      dialogLaporanPengeluaranBulanan: false,
      makanan: [],
      minuman: [],
      sideDish: [],
      makananBulanan: [],
      minumanBulanan: [],
      sideDishBulanan: [],
      today: moment
        .tz(moment(), "Asia/Jakarta")
        .format("MMM DD, YYYY h:mm:ss A"),
      namaKaryawan: localStorage.getItem("nama_karyawan"),
      headersPengeluaranBulanan: [
        {
          text: "Bulan",
          align: "start",
          sortable: true,
          value: "month",
        },
        { text: "Total", value: "sub_total" },
      ],
      headersPengeluaranTahunan: [
        {
          text: "Tahun",
          align: "start",
          sortable: true,
          value: "year",
        },
        { text: "Total", value: "sub_total" },
      ],
      date: {
        from: null,
        to: null,
        month: null,
        monthIndex: null,
        rangeFrom: null,
        rangeTo: null,
        rangeFromMonth: null,
        rangeToMonth: null,
        year: null,
      },
    };
  },
//   components:{
//       MonthPicker,
//   },
  methods: {
    showDate(date) {
      this.date = date;
    },
    cetakPengeluaranTahunan() {
      let print = document.getElementById("printLaporanPengeluaranTahunan");
      html2PDF(print, {
        jsPDF: { format: "A4" },
        html2canvas: {
          scrollX: 0,
          scrollY: -window.scrollY,
        },
        output: "AKB-Pengeluaran-Tahun " + this.tahun1 + " s/d " + this.tahun2,
      });
    },
    cetakPengeluaranBulanan() {
      let print = document.getElementById("printLaporanPengeluaranBulanan");
      html2PDF(print, {
        jsPDF: { format: "A4" },
        html2canvas: {
          scrollX: 0,
          scrollY: -window.scrollY,
        },
        output: "AKB-Pengeluaran-Bulanan " + this.tahun,
      });
    },
    readPengeluaranMakananTahunan(tahun1,tahun2) {
      var url = this.$api + "/pengeluaranMakananTahunan/" + tahun1 + "," + tahun2;
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.makanan = response.data.data;
        });
    },
    readPengeluaranMinumanTahunan(tahun1,tahun2) {
      var url = this.$api + "/pengeluaranMinumanTahunan/" + tahun1 + "," + tahun2;
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.minuman = response.data.data;
        });
    },
    readPengeluaranSideTahunan(tahun1,tahun2) {
      var url = this.$api + "/pengeluaranSideTahunan/" + tahun1 + "," + tahun2;
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.sideDish = response.data.data;
        });
    },
    readPengeluaranMakananBulanan(tahun) {
      var url = this.$api + "/pengeluaranMakananBulanan/" + tahun;
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.makananBulanan = response.data.data;
        });
    },
    readPengeluaranMinumanBulanan(tahun) {
      var url = this.$api + "/pengeluaranMinumanBulanan/" + tahun;
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.minumanBulanan = response.data.data;
        });
    },
    readPengeluaranSideBulanan(tahun) {
      var url = this.$api + "/pengeluaranSideBulanan/" + tahun;
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.sideDishBulanan = response.data.data;
        });
    },
    resetForm() {
      this.$refs.form.reset();
    },
    resetTabel() {
      this.makanan = [];
      this.minuman = [];
      this.sideDish = [];
      this.makananBulanan=[];
      this.minumanBulanan= [];
      this.sideDishBulanan= [];
    },
  },
  computed: {
    years() {
      const year = new Date().getFullYear();
      return Array.from(
        { length: year - 1900 },
        (value, index) => 2000 + index
      );
    },
  },
  mounted() {},
};
</script>
