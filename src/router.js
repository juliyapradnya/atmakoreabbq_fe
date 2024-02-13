import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

function importComponent(path) {
    return () => import(`./components/${path}.vue`)
}

Vue.use(VueRouter);

const router = new VueRouter({
    mode: "history",
    routes: [
        // Login
        {
            path: "/login",
            name: "login",
            meta: {title: 'Login'},
            component: importComponent('Login'),
        },
     {
        path: "/",
        component: importComponent('DashboardLayout'),
        children: [
            //Dashboard
            {
                path: "/dashboard",
                name: "Dashboard",
                meta: {title: 'Dashboard'},
                component: importComponent('Dashboard'),
            },
            // Karyawan
            {
                path: "/user",
                name: "User",
                meta: {title: 'User'},
                component: importComponent('DataMaster/User'),
            },
            //Customer
            {
                path: "/customer",
                name: "Customer",
                meta: {title: 'Customer'},
                component: importComponent('DataMaster/Customer'),
            },
            //Meja
            {
                path: "/meja",
                name: "Meja",
                meta: {title: 'Meja'},
                component: importComponent('DataMaster/Meja'),
            },
            //Menu
            {
                path: "/menu",
                name: "Menu",
                meta: {title: 'Menu'},
                component: importComponent('DataMaster/Menu'),
            },
            //Bahan
            {
                path: "/bahan",
                name: "Bahan",
                meta: {title: 'Bahan'},
                component: importComponent('DataMaster/Bahan'),
            },
            //Reservasi
            {
                path: "/reservasi",
                name: "Reservasi",
                meta: {title: 'Reservasi'},
                component: importComponent('DataMaster/Reservasi'),
            },
            //Pesanan
            {
                path: "/pesanan",
                name: "Pesanan",
                meta: {title: 'Pesanan'},
                component: importComponent('DataMaster/Pesanan'),
            },
            //Stok masuk
            {
                path: "/stok",
                name: "Stok",
                meta: {title: 'Stok'},
                component: importComponent('DataMaster/Stok'),
            },
            //Stok keluar
            {
                path: "/historystok",
                name: "HistoryStok",
                meta: {title: 'HistoryStok'},
                component: importComponent('DataMaster/HistoryStok'),
            },
            //Stok terbuang
            {
                path: "/stokterbuang",
                name: "StokTerbuang",
                meta: {title: 'StokTerbuang'},
                component: importComponent('DataMaster/StokTerbuang'),
            },
            //Transaksi
            {
                path: "/transaksi",
                name: "Transaksi",
                meta: {title: 'Transaksi'},
                component: importComponent('DataMaster/Transaksi'),
            },
            //Laporan Stok
            {
                path: "/lapstokbahan",
                name: "LapStokBahan",
                meta: {title: 'LapStokBahan'},
                component: importComponent('Laporan/LapStokBahan'),
            },
            //Laporan Penjualan
            {
                path: "/lappenjualan",
                name: "LapPenjualan",
                meta: {title: 'LapPenjualan'},
                component: importComponent('Laporan/LapPenjualan'),
            },
            //Laporan Pendapatan
            {
                path: "/lappendapatan",
                name: "LapPendapatan",
                meta: {title: 'LapPendapatan'},
                component: importComponent('Laporan/LapPendapatan'),
            },
            //Laporan Pengeluaran
            {
                path: "/lappengeluaran",
                name: "LapPengeluaran",
                meta: {title: 'LapPengeluaran'},
                component: importComponent('Laporan/LapPengeluaran'),
            },
        ]
      },
      {
        path: "/",
        component: importComponent('ChefLayout'),
        name: "cheflayout",
        children: [
           
            //Bahan
            {
                path: "/chefbahan",
                name: "ChefBahan",
                meta: {title: 'ChefBahan'},
                component: importComponent('DataMaster/Bahan'),
            },
            //Pesanan
            {
                path: "/chefpesanan",
                name: "ChefPesanan",
                meta: {title: 'ChefPesanan'},
                component: importComponent('DataMaster/Pesanan'),
            },
            //stok masuk
            {
                path: "/chefstok",
                name: "ChefStok",
                meta: {title: 'ChefStok'},
                component: importComponent('DataMaster/Stok'),
            },
            //stok keluar
            {
                path: "/chefhistorystok",
                name: "ChefHistoryStok",
                meta: {title: 'ChefHistoryStok'},
                component: importComponent('DataMaster/HistoryStok'),
            },
            //stok terbuang
            {
                path: "/chefstokterbuang",
                name: "ChefStokTerbuang",
                meta: {title: 'ChefStokTerbuang'},
                component: importComponent('DataMaster/StokTerbuang'),
            },
        ]
      },

      {
        path: "/",
        component: importComponent('OwnerLayout'),
        name: "ownerlayout",
        children: [
           
            //Karyawan
            {
                path: "/ownerkaryawan",
                name: "OwnerKaryawan",
                meta: {title: 'OwnerKaryawan'},
                component: importComponent('DataMaster/User'),
            },
        ]
      },

      {
        path: "/",
        component: importComponent('WaiterLayout'),
        name: "waiterlayout",
        children: [
           
            //Customer
            {
                path: "/waitercustomer",
                name: "WaiterCustomer",
                meta: {title: 'WaiterCustomer'},
                component: importComponent('DataMaster/Customer'),
            },
            //Reservasi
            {
                path: "/waiterreservasi",
                name: "WaiterReservasi",
                meta: {title: 'WaiterReservasi'},
                component: importComponent('DataMaster/Reservasi'),
            },
             //Pesanan
             {
                path: "/waiterpesanan",
                name: "WaiterPesanan",
                meta: {title: 'WaiterPesanan'},
                component: importComponent('DataMaster/Pesanan'),
            },
        ]
      },

      {
        path: "/",
        component: importComponent('CashierLayout'),
        name: "cashierlayout",
        children: [
           
            //Customer
            {
                path: "/cashiercustomer",
                name: "CashierCustomer",
                meta: {title: 'CashierCustomer'},
                component: importComponent('DataMaster/Customer'),
            },
            //Reservasi
            {
                path: "/cashierreservasi",
                name: "CashierReservasi",
                meta: {title: 'CashierReservasi'},
                component: importComponent('DataMaster/Reservasi'),
            },
             //Pesanan
             {
                path: "/cashierpesanan",
                name: "CashierPesanan",
                meta: {title: 'CashierPesanan'},
                component: importComponent('DataMaster/Pesanan'),
            },
            //Transaksi
            {
                path: "/cashiertransaksi",
                name: "CashierTransaksi",
                meta: {title: 'CashierTransaksi'},
                component: importComponent('DataMaster/Transaksi'),
            },
        ]
      },
        
        {
            path: '*',
            redirect: '/'
        },
    ],
});

//Mengset Judul
router.beforeEach((to, from, next)=>{
    if(to.name!="login" && localStorage.getItem("token")==null){
        next('login')
    }
    document.title = to.meta.title;
    next();
});

export default router;