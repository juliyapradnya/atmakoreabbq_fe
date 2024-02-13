<template>
  <v-main class="list">
    <h3 class="text-h3 font-weight-medium mb-5">Karyawan</h3>

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

      <v-data-table :headers="headers" :items="user" :search="search">
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn v-if="item.deleted_at == null" color="blue" fab dark small @click="editHandler(item)">
            <v-icon>mdi-circle-edit-outline</v-icon>
          </v-btn>

          <v-btn v-if="item.deleted_at == null" color="red" fab dark small @click="deleteHandler(item.id)">
            <v-icon>mdi-trash-can</v-icon>
          </v-btn>

          <v-btn v-if="item.deleted_at != null" rounded class="ma-2 white--text" color="green"  @click="restore(item.id)">
            aktifkan
            <v-icon>mdi-checkbox-multiple-marked-circle-outline</v-icon>
          </v-btn>

        </template>

        <template v-slot:[`item.status`]="{ item }">
          <v-chip
            v-if="item.deleted_at != null"
            class="ma-3"
            color="red"
            text-color="white"
          >
            Nonaktif
          </v-chip>

          <v-chip v-else class="ma-3" color="green" text-color="white">
            Aktif
          </v-chip>
        </template>

      </v-data-table>
    </v-card>

    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }} Karyawan</span>
        </v-card-title>

        <v-card-text>
          <v-form v-model="valid" ref="form">
            <v-text-field
              v-model="form.nama_karyawan"
              label="Nama Karyawan"
              :rules="namaKaryawanRules"
              outlined
              required
            ></v-text-field>

            <v-select
              v-model="form.jenis_kelamin_karyawan"
              :items="['male', 'female']"
              label="Jenis kelamin"
              :rules="jenisRules"
              outlined
              required
            ></v-select>

            <v-text-field
              v-model="form.no_telp_karyawan"
              label="Nomor Telepon Karyawan"
              :rules="noTelpRules"
              outlined
              required
            ></v-text-field>

            <v-select
              v-model="form.posisi_karyawan"
              :items="[
                'Operational Manager',
                'Owner',
                'Chef',
                'Waiter',
                'Cashier',
              ]"
              label="Posisi"
              :rules="posisiRules"
              outlined
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
                  label="Tanggal Gabung"
                  :rules="tglGabungRules"
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

            <v-text-field
              v-model="form.email"
              label="Email"
              :rules="emailRules"
              outlined
              required
            ></v-text-field>

            <v-text-field
              v-model="form.password"
              label="Password"
              type="password"
              outlined
              :rules="passRules"
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

    <v-dialog v-model="dialogEdit" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }} Karyawan</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-text-field
              v-model="form.nama_karyawan"
              label="Nama Karyawan"
              required
              outlined
            ></v-text-field>

            <v-select
              v-model="form.jenis_kelamin_karyawan"
              :items="['male', 'female']"
              label="Jenis kelamin"
              outlined
              required
            ></v-select>

            <v-text-field
              v-model="form.no_telp_karyawan"
              label="Nomor Telepon Karyawan"
              outlined
              required
            ></v-text-field>

            <v-select
              v-model="form.posisi_karyawan"
              :items="[
                'Operational Manager',
                'Owner',
                'Chef',
                'Waiter',
                'Cashier',
              ]"
              label="Posisi"
              outlined
              required
            ></v-select>

            <v-text-field
              v-model="form.tgl_gabung"
              label="Tanggal Bergabung"
              placeholder="yyyy-mm-dd"
              outlined
              required
            ></v-text-field>

            <v-text-field
              v-model="form.email"
              label="Email"
              outlined
              required
            ></v-text-field>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="blue darken-1" text @click="cancel">
            Cancel
          </v-btn>

          <v-btn color="blue darken-1" text @click="update">
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
          Anda yakin ingin menonaktifkan data karyawan ini?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialogConfirm = false">
            Cancel
          </v-btn>
          <v-btn color="blue darken-1" text @click="deleteData">
            Nonaktifkan
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
      dialogEdit: false,
      dialogConfirm: false,
      headers: [
        {
          text: "Nama",
          align: "start",
          sortable: true,
          value: "nama_karyawan",
        },
        { text: "Jenis Kelamin", value: "jenis_kelamin_karyawan" },
        { text: "Nomor Telepon", value: "no_telp_karyawan" },
        { text: "Posisi", value: "posisi_karyawan" },
        { text: "Tanggal Bergabung", value: "tgl_gabung" },
        { text: "Email", value: "email" },
        { text: "Status Karyawan", value: "status" },
        { text: "Actions", value: "actions" },
      ],
      users: new FormData(),
      user: [],
      form: {
        nama_karyawan: null,
        jenis_kelamin_karyawan: null,
        no_telp_karyawan: null,
        posisi_karyawan: null,
        tgl_gabung: null,
        email: null,
        password: null,
      },
      namaKaryawanRules: [(v) => !!v || "Nama Karyawan tidak boleh kosong"],
      jenisRules: [(v) => !!v || "Jenis Kelamin tidak boleh kosong"],
      noTelpRules: [(v) => !!v || "Nomor Telepon tidak boleh kosong"],
      posisiRules: [(v) => !!v || "Posisi Karyawan tidak boleh kosong"],
      tglGabungRules: [(v) => !!v || "Tanggal Gabung tidak boleh kosong"],
      emailRules: [(v) => !!v || "Email tidak boleh kosong"],
      passRules: [(v) => !!v || "Password tidak boleh kosong"],
      deleteId: "",
      editId: "",
      date: null,
      menu: false,
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
      var url = this.$api + "/user";
      this.$http
        .post(url, {
          headers: {
            Authorization: "Bearer" + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.user = response.data.data;
        });
    },
    //simpan data produk
    save() {
      if (this.$refs.form.validate()) {
      this.users.append("nama_karyawan", this.form.nama_karyawan);
      this.users.append("jenis_kelamin_karyawan", this.form.jenis_kelamin_karyawan);
      this.users.append("no_telp_karyawan", this.form.no_telp_karyawan);
      this.users.append("posisi_karyawan", this.form.posisi_karyawan);
      this.users.append("tgl_gabung", this.date);
      this.users.append("email", this.form.email);
      this.users.append("password", this.form.password);

      var url = this.$api + "/register/";
      this.load = true;
      this.$http
        .post(url, this.users, {
          headers: {
            Authorization: "Bearer" + localStorage.getItem("token"),
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
        nama_karyawan: this.form.nama_karyawan,
        jenis_kelamin_karyawan: this.form.jenis_kelamin_karyawan,
        no_telp_karyawan: this.form.no_telp_karyawan,
        posisi_karyawan: this.form.posisi_karyawan,
        tgl_gabung: this.form.tgl_gabung,
        email: this.form.email,
      };
      var url = this.$api + "/user/" + this.editId;
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
          this.closeEdit();
          this.readData(); //mengambil data
          this.resetForm();
          //this.save();
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
      var url = this.$api + "/user/" + this.deleteId;
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
    restore(id) {
      var url = this.$api + "/user/" + id;
      this.$http
        .post(url, {
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
      this.form.nama_karyawan = item.nama_karyawan;
      this.form.jenis_kelamin_karyawan = item.jenis_kelamin_karyawan;
      this.form.no_telp_karyawan = item.no_telp_karyawan;
      this.form.posisi_karyawan = item.posisi_karyawan;
      this.form.tgl_gabung = item.tgl_gabung;
      this.form.email = item.email;
      this.dialogEdit = true;
    },
    deleteHandler(id) {
      this.deleteId = id;
      this.dialogConfirm = true;
    },
    close() {
      this.dialog = false;
      this.dialogEdit = false;
      this.dialogConfirm = false;
      this.inputType = "Tambah";
    },
    closeEdit() {
      this.dialogEdit = false;
      this.dialogConfirm = false;
    },
    cancel() {
      this.resetForm();
      this.readData();
      this.dialog = false;
      this.dialogEdit = false;
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
  },
};
</script>
