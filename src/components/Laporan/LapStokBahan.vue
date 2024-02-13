<template>
  <v-main class="list">
    <v-card class="mx-auto" max-width="600" outlined>
      <v-list-item three-line>
        <v-list-item-content>
          <v-list-item-title class="text-h3 mb-1">
            Laporan Stok
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-card-actions>
        <v-btn outlined rounded text @click="dialogTahunan = true">
          Laporan Per Menu
        </v-btn>
        <v-btn outlined rounded text @click="dialogCustom = true">
          Laporan Custom Periode
        </v-btn>
      </v-card-actions>

      <v-dialog v-model="dialogTahunan" persistent max-width="450px">
        <v-card>
          <span class="headline">{{ formTitle }} Laporan Stok </span>

          <v-card-text>
            <v-form v-model="valid" ref="form">
              <v-select
                v-model="nama_menu"
                :items="menus"
                item-text="nama_menu"
                item-value="nama_menu"
                label="Menu"
                required
              ></v-select>
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
                readStokPerMenu(nama_menu, date.year, date.monthIndex);
                dialogLaporanStokPerMenu = true;
              "
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialogCustom" persistent max-width="450px">
        <v-card>
          <span class="headline">{{ formTitle }} Laporan Stok </span>

          <v-card-text>
            <v-form v-model="valid" ref="form">
              <v-menu
                v-model="menu"
                :close-on-content-click="false"
                transition="fade-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="startDate"
                    label="Tanggal"
                    :rules="tglGabungRules"
                    prepend-icon="mdi-calendar-month"
                    readonly
                    v-bind="attrs"
                    outlined
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="startDate"
                  @input="menu = false"
                ></v-date-picker>
              </v-menu>

              <v-menu
                v-model="menu2"
                :close-on-content-click="false"
                transition="fade-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="endDate"
                    label="Tanggal"
                    :rules="tglGabungRules"
                    prepend-icon="mdi-calendar-month"
                    readonly
                    v-bind="attrs"
                    outlined
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="endDate"
                  @input="menu2 = false"
                ></v-date-picker>
              </v-menu>
            </v-form>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
              color="blue"
              dark
              @click="
                dialogCustom = false;
                resetForm();
              "
            >
              Back
            </v-btn>

            <v-btn
              color="blue"
              dark
              @click="
                dialogCustom = false;
                readMakanan(startDate,endDate);
                readMinuman(startDate,endDate);
                readSideDish(startDate,endDate);
                dialogLaporanStokCustom = true;
              "
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialogLaporanStokPerMenu" persistent max-width="600px">
        <v-card>
          
          <div id="printLaporanStokPerMenu">
            <v-card-text class="mt-2 px-12 py-15 text-center">
              <div>
                <img
                  :src="require('@/assets/struk.jpeg')"
                  class="mx-auto"
                  width="500"
                />
                <hr />
                <p class="mt-0 fontBottom ">
                  LAPORAN STOK BAHAN
                </p>
                <hr />
                <p style="text-align:left">
                  ITEM MENU: {{ nama_menu }} <br />PERIODE: {{ date.month }}
                  {{ date.year }}
                </p>
                <hr style="height:5px" />
                <v-data-table
                  :hide-default-footer="true"
                  :headers="headersStokPerMenu"
                  :items="satuMenu"
                  :search="search"
                >
          
                </v-data-table>
                <hr />
                <p style="text-align:center">
                  Printed {{ today }}
                </p>
                <p style="text-align:center">
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
                dialogLaporanStokPerMenu = false;
                resetForm();
                resetTabel();
              "
              >Close</v-btn
            >
            <v-btn text color="blue" @click="cetakStokPerMenu()"
              >Cetak</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialogLaporanStokCustom" persistent max-width="800px">
      <v-card>
        
        <div id="printLaporanStokCustom">
          <v-card-text class="mt-2 px-12 py-15 text-center">
            <div>
              <img
                :src="require('@/assets/struk.jpeg')"
                class="mx-auto"
                width="500"
              />
              <hr />
              <p class="fontBottom ">
                LAPORAN STOK BAHAN
              </p>
              <hr />
              <p style="text-align:left">
                ITEM MENU: ALL<br />PERIODE: CUSTOM ({{ startDate }} s/d
                {{ endDate }})
              </p>
              <hr />
              <p class="fontBottom teksPosition">
                MAKANAN
              </p>
              <hr />
              <hr />
              <v-data-table
                :hide-default-footer="true"
                :headers="headersStokCustom"
                :items="makanan"
                :search="search"
              >
                
              </v-data-table>
              <hr />
              <p class="fontBottom teksPosition">
                SIDE DISH
              </p>
              <hr />
              <v-spacer></v-spacer>
              <v-data-table
                :hide-default-footer="true"
                :headers="headersStokCustom"
                :items="sideDish"
                :search="search"
              >
               
              </v-data-table>
              <hr />
              <p class="mt-0  mb-0">
                MINUMAN
              </p>
              <hr />
              <v-spacer></v-spacer>
              <v-data-table
                :hide-default-footer="true"
                :headers="headersStokCustom"
                :items="minuman"
                :search="search"
              >
                
              </v-data-table>
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
              dialogLaporanStokCustom = false;
              resetForm();
              resetTabel();
            "
            >Cancel</v-btn
          >
          <v-btn text color="blue" @click="cetakStokPertahunCustom()"
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
      dialogCustom: false,
      dialogLaporanStokPerMenu: false,
      dialogLaporanStokCustom: false,
      satuMenu: [],
      menus: [],
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
      headersStokPerMenu: [
        {
          text: "Tanggal",
          align: "start",
          sortable: true,
          value: "tanggal",
        },

        { text: "Unit", value: "unit_stok" },
        { text: "Incoming Stok", value: "stok_masuk" },
        { text: "Remaining Stok", value: "sisa_stok" },
      ],
      headersStokCustom: [
        {
          text: "Item menu",
          align: "start",
          sortable: true,
          value: "nama_menu",
        },

        { text: "Unit", value: "unit_stok" },
        { text: "Incoming Stok", value: "stok_masuk" },
        { text: "Remaining Stok", value: "sisa_stok" },
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
      menu: false,
      menu2: false,
      startDate: new Date().toISOString().substr(0, 10),
      endDate: new Date().toISOString().substr(0, 10),
    };
  },
  components: {
    MonthPicker,
  },
  methods: {
    showDate(date) {
      this.date = date;
    },
    cetakStokPerMenu() {
      let print = document.getElementById("printLaporanStokPerMenu");
      html2PDF(print, {
        jsPDF: { format: "A4" },
        html2canvas: {
          scrollX: 0,
          scrollY: -window.scrollY,
        },
        output: "AKB-Stok " + this.nama_menu,
      });
    },
    cetakStokPertahunCustom() {
      let print = document.getElementById("printLaporanStokCustom");
      html2PDF(print, {
        jsPDF: { format: "A4" },
        html2canvas: {
          scrollX: 0,
          scrollY: -window.scrollY,
        },
        output: "AKB-Stok",
      });
    },
    readStokPerMenu(menu, tahun, bulan) {
      var url = this.$api + "/stokPerMenu/" + menu + "," + tahun + "," + bulan;
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.satuMenu = response.data.data;
        });
    },
    readMakanan(tanggal1, tanggal2)
    {
      var url = this.$api + "/stokMakanan/" + tanggal1 + "," + tanggal2;
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
    readMinuman(tanggal1, tanggal2)
    {
      var url = this.$api + "/stokMinuman/" + tanggal1 + "," + tanggal2;
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
    readSideDish(tanggal1, tanggal2)
    {
      var url = this.$api + "/stokSideDish/" + tanggal1 + "," + tanggal2;
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
    readMenu() {
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
    resetForm() {
      this.$refs.form.reset();
    },
    resetTabel() {
      this.satuMenu;
      this.makanan;
      this.minuman;
      this.sideDish;
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
  mounted() {
    this.readMenu();
  },
};
</script>
