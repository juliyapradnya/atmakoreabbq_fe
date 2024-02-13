<template>
  <div class="dashboard">
    <v-navigation-drawer
      color="#194350"
      v-model="drawer"
      class="fullheight"
      width="256"
      app
    >
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title"> Atma Korean BBQ </v-list-item-title>
          <v-list-item-subtitle class="white--text">
            Operational Manager
          </v-list-item-subtitle>
          <img id="logoLogin" src="../assets/akblogo.png" width="50" height="150" alt="Kitten">
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>
      <template>
        <v-card color="#194350" class="mx-auto" max-width="300" tile>
          <v-list dense>
            <v-list-item
              v-for="(item, i) in items"
              :key="i"
              link
              tag="router-link"
              :to="item.to"
            >
              <v-list-item-icon>
                <v-icon color="white" v-text="item.icon"> </v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title class="white--text" v-text="item.text">
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </template>
    </v-navigation-drawer>
    <v-app-bar color="#194350" app fixed height="75px">
      <v-app-bar-nav-icon
        color="white"
        @click.stop="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <v-spacer></v-spacer>

      <v-toolbar-items>
        <v-btn @click="logout" text router>
          <v-icon color="white">mdi-logout</v-icon>
        </v-btn>
      </v-toolbar-items>
    </v-app-bar>
    <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
      {{ error_message }}
    </v-snackbar>
    <div class="fullheight pa-5">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
export default {
  name: "Dashboard",
  data() {
    return {
      drawer: true,
      error_message: "",
      snackbar: false,
      items: [
        { text: "Karyawan", icon: "mdi-account-group", to: "/user" },
        { text: "Customer", icon: "mdi-account", to: "/customer" },
        { text: "Menu", icon: "mdi-food", to: "/menu" },
        { text: "Bahan", icon: "mdi-shaker", to: "/bahan" },
        { text: "Meja", icon: "mdi-table-chair", to: "/meja" },
        { text: "Reservasi", icon: "mdi-calendar-clock", to: "/reservasi" },
        { text: "Pesanan", icon: "mdi-calendar-edit", to: "/pesanan" },
        { text: "Stok Masuk", icon: "mdi-cart-arrow-down", to: "/stok" },
        { text: "Stok Keluar", icon: "mdi-cart-arrow-up", to: "/historystok" },
        { text: "Stok Terbuang", icon: "mdi-cart-remove", to: "/stokterbuang" },
        { text: "Transaksi", icon: "mdi-cash-multiple", to: "/transaksi" },
        { text: "Laporan Stok Bahan", icon: "mdi-book-open-outline", to: "/lapstokbahan" },
        { text: "Laporan Penjualan", icon: "mdi-book", to: "/lappenjualan" },
        { text: "Laporan Pendapatan", icon: "mdi-book", to: "/lappendapatan" },
        { text: "Laporan Pengeluaran", icon: "mdi-book", to: "/lappengeluaran" },
      ],
    };
  },
  methods: {
    logout() {
      localStorage.removeItem("token");

      this.$router.push({
        name: "login",
      });
    },
  },
};
</script>

<style scoped>
.fullheight {
  min-height: 100vh !important;
}

.router {
  text-decoration: none;
  color: rgb(255, 255, 255);
}

.v-list-item__title {
  color: rgb(216, 160, 57);
}
</style>
