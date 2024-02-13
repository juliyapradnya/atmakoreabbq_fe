<template>
  <v-main class="list">
    <v-card class="mx-auto" max-width="600" outlined>
      <v-list-item three-line>
        <v-list-item-content>
          <v-list-item-title class="text-h3 mb-1">
            Laporan Penjualan
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
                readPenjualanMakananTahunan(tahun);
                readPenjualanSideTahunan(tahun);
                readPenjualanMinumanTahunan(tahun);
                dialogLaporanPenjualanTahunan = true;
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
              <template>
                
                <month-picker v-model="bulan" @change="showDate"></month-picker>
              </template>
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
                readPenjualanMakananBulanan(date.year, date.monthIndex);
                readPenjualanSideBulanan(date.year, date.monthIndex);
                readPenjualanMinumanBulanan(date.year, date.monthIndex);
                dialogLaporanPenjualanBulanan = true;
              "
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog
        v-model="dialogLaporanPenjualanTahunan"
        persistent
        max-width="800px"
      >
        <v-card>
          
          <div id="printLaporanPenjualanTahunan">
            <v-card-text class="mt-2 px-12 py-15 text-center">
              <div>
                <img
                  :src="require('@/assets/struk.jpeg')"
                  class="mx-auto"
                  width="500"
                />
                <hr />
                <p class="mt-0">
                  LAPORAN PENJUALAN ITEM MENU
                </p>
                <hr />
                <p style="text-align:left" class="mt-0">
                  TAHUN: {{ tahun }} <br />BULAN: ALL
                </p>
                <hr />
                <p
                  style="text-align:left"
                  class="mt-0  mb-0"
                >
                  MAKANAN
                </p>
                <hr />
                <v-data-table
                  :hide-default-footer="true"
                  :headers="headersPenjualan"
                  :items="makanan"
                  :search="search"
                >
                </v-data-table>
                <hr />
                <p
                  style="text-align:left"
                  class="mt-0  mb-0"
                >
                  SIDE DISH
                </p>
                <hr />
                <v-data-table
                  :hide-default-footer="true"
                  :headers="headersPenjualan"
                  :items="sideDish"
                  :search="search"
                >
                </v-data-table>
                <hr />
                <p
                  style="text-align:left"
                  class="mt-0  mb-0 "
                >
                  MINUMAN
                </p>
                <hr />
                <v-data-table
                  :hide-default-footer="true"
                  :headers="headersPenjualan"
                  :items="minuman"
                  :search="search"
                >
                </v-data-table>
                <hr />
                <p style="text-align:center" class="mt-1 ">
                  Printed {{ today }}
                </p>
                <p style="text-align:center" class="mt-1 ">
                  Printed by {{ namaKaryawan }}
                </p>
              </div>
            </v-card-text>
          </div>
          <v-card-actions class="justify-end">
            <v-btn
              
              color="blue"
              text
              @click="
                dialogLaporanPenjualanTahunan = false;
                resetForm();
                resetTabel();
              "
              >Cancel</v-btn
            >
            <v-btn color="blue" text  @click="cetakPenjualanTahunan()"
              >Cetak</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog
        v-model="dialogLaporanPenjualanBulanan"
        persistent
        max-width="800px"
      >
        <v-card>
         
          <div id="printLaporanPenjualanBulanan">
            <v-card-text class="mt-2 px-12 py-15 text-center">
              <div>
                <img
                  :src="require('@/assets/struk.jpeg')"
                  class="mx-auto"
                  width="500"
                />
                <hr />
                <p class="mt-0 fontBottom ">
                  LAPORAN PENJUALAN ITEM MENU
                </p>
                <hr />
                <p style="text-align:left" class="mt-0">
                  TAHUN: {{ date.year }} <br />BULAN: {{date.month}}
                </p>
                <hr />
                <p
                  style="text-align:left"
                  class="mt-0  mb-0"
                >
                  MAKANAN
                </p>
                <hr />
                <v-data-table
                  :hide-default-footer="true"
                  :headers="headersPenjualan"
                  :items="makananBulanan"
                  :search="search"
                >

                </v-data-table>
                <hr />
                <p
                  style="text-align:left"
                  class="mt-0  mb-0"
                >
                  SIDE DISH
                </p>
                <hr />
                <v-data-table
                  :hide-default-footer="true"
                  :headers="headersPenjualan"
                  :items="sideDishBulanan"
                  :search="search"
                >
                </v-data-table>
                <hr />
                <p
                  style="text-align:left"
                  class="mt-0  mb-0"
                >
                  MINUMAN
                </p>
                <hr />
                <v-data-table
                  :hide-default-footer="true"
                  :headers="headersPenjualan"
                  :items="minumanBulanan"
                  :search="search"
                >
                </v-data-table>
                <hr />
                <p style="text-align:center" class="mt-1">
                  Printed {{ today }}
                </p>
                <p style="text-align:center" class="mt-1">
                  Printed by {{ namaKaryawan }}
                </p>
              </div>
            </v-card-text>
          </div>
          <v-card-actions class="justify-end">
            <v-btn
              text
              color="blue"
              @click="
                dialogLaporanPenjualanBulanan = false;
                resetForm();
                resetTabel();
              "
              >Cancel</v-btn
            >
            <v-btn text color="blue" @click="cetakPenjualanBulanan()"
              >Cetak</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>

    </v-card>
  </v-main>
</template>
<script>
import moment from "moment";
import html2PDF from "jspdf-html2canvas";
import { MonthPicker } from "vue-month-picker";
export default {
  name: "List",
  data() {
    return {
      dialogTahunan: false,
      dialogBulanan: false,
      dialogLaporanPenjualanTahunan: false,
      dialogLaporanPenjualanBulanan: false,
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
      headersPenjualan: [
        {
          text: "Item Menu",
          align: "start",
          sortable: true,
          value: "nama_menu",
        },
        { text: "Unit", value: "unit_menu" },
        { text: "Penjualan harian Tertinggi", value: "qty" },
        { text: "Total Penjualan", value: "Total" },
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
  components:{
      MonthPicker,
  },
  methods: {
    showDate(date) {
      this.date = date;
    },
    cetakPenjualanTahunan() {
      let print = document.getElementById("printLaporanPenjualanTahunan");
      html2PDF(print, {
        jsPDF: { format: "A4" },
        html2canvas: {
          scrollX: 0,
          scrollY: -window.scrollY,
        },
        output: "AKB-Penjualan-Tahun " + this.tahun,
      });
    },
    cetakPenjualanBulanan() {
      let print = document.getElementById("printLaporanPenjualanBulanan");
      html2PDF(print, {
        jsPDF: { format: "A4" },
        html2canvas: {
          scrollX: 0,
          scrollY: -window.scrollY,
        },
        output: "AKB-Penjualan-Bulanan " + this.tahun,
      });
    },
    readPenjualanMakananTahunan(tahun) {
      var url = this.$api + "/makanantahunan/" + tahun;
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
    readPenjualanMinumanTahunan(tahun) {
      var url = this.$api + "/minumantahunan/" + tahun;
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
    readPenjualanSideTahunan(tahun) {
      var url = this.$api + "/sidedishtahunan/" + tahun;
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
    readPenjualanMakananBulanan(tahun, bulan) {
      var url = this.$api + "/makananbulanan/" + tahun + ',' + bulan;
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
    readPenjualanMinumanBulanan(tahun, bulan) {
      var url = this.$api + "/minumanbulanan/" + tahun + ',' + bulan;
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
    readPenjualanSideBulanan(tahun, bulan) {
      var url = this.$api + "/sidedishbulanan/" + tahun + ',' + bulan;
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
