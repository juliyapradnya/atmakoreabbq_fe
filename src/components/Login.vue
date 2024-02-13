<template>
  <main>
    <v-container fluid fill-height class="posisinya">
      <v-layout flex align-center justify-center>
        <v-flex xs12 sm4 elevation-6>
          
            <v-card-title id="titleHeader">
              <span id="titleLogin">Atma Korean BBQ</span>
            <img id="logoLogin" src="../assets/akb pict.jpeg" width="200" height="200" alt="Kitten">
            
          </v-card-title>
          <v-card-title>
            <span id="title" >Login</span>
          </v-card-title>
            
          
          <v-card>
            <v-card-text>
              <div>
                <v-form v-model="valid" ref="form">
                  <v-text-field
                      label="E-mail"
                      v-model="email"
                      :rules="emailRules"
                      required
                  >
                  </v-text-field>
                  <v-text-field
                      label="Password"
                      v-model="password"
                      type="password"
                      min="8"
                      :rules="passwordRules"
                      counter
                      required
                  >
                  </v-text-field>
                  <v-layout justify-end>
                    <v-btn color="blue darken-1" text @click="submit">
                        Login
                    </v-btn>
                    <v-btn color="blue darken-1" text @click="clear">
                        Clear
                    </v-btn>
                  </v-layout>
                </v-form>
              </div>
            </v-card-text>
          </v-card>
          <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
            {{ error_message }}
          </v-snackbar>
        </v-flex>
      </v-layout>
    </v-container>
  </main>
</template>

<style>
@import url("https://fonts.googleapis.com/css?family=Jolly%20Lodger");
@import url("https://fonts.googleapis.com/css?family=Yellowtail");

.grey--text {
  font-family: "Jolly Lodger";
}


#title{
    font-family: "Jolly%20Lodger";
    
  }

#titleLogin{
    color: rgb(58, 117, 172);
    margin-left: 110px;
    margin-bottom: 50px;
    font-family: "Yellowtail";
    font-size: 30px;
}

#logoLogin{
    margin-left: 120px;
  }
#titleHeader{
    background-color: rgb(255, 255, 255);
    margin-left: 20px;
    margin-right: 20px;
  }
</style>

<script>
export default {
  name: "Login",
  data() {
    return {
      load: false,
      snackbar: false,
      error_message: "",
      color: "",
      valid: false,
      password: "",
      passwordRules: [v => !!v || "Password tidak boleh kosong :("],
      email: "",
      emailRules: [v => !!v || "E-mail tidak boleh kosong :("]
    };
  },
  methods: {
    register(){
			this.$router.push({name: "register"});
		},
    submit() {
      if (this.$refs.form.validate()) {
        //cek apakah data yang akan dikirim sudah valid
        this.load = true;
        this.$http
            .post(this.$api + "/login", {
              email: this.email,
              password: this.password,
            })
            .then(response => {
              localStorage.setItem("id", response.data.user.id); //menyimpan id user yang sedang login
              localStorage.setItem("token", response.data.access_token); //menyimpan auth token
              localStorage.setItem("email",response.data.user.email);
              localStorage.setItem("posisi_karyawan",response.data.user.posisi_karyawan);
              localStorage.setItem("nama_karyawan",response.data.user.nama_karyawan);
              this.error_message = response.data.message;
              this.color = "green";
              this.snackbar = true;
              this.load = false;
              this.clear();
              if (response.data.user.posisi_karyawan == "Chef") {
                    this.$router.push({
                        name: "ChefBahan"
                      });
              } else if(response.data.user.posisi_karyawan == "Operational Manager") {
                      this.$router.push({
                          name: "User"
                        });
              
              } else if(response.data.user.posisi_karyawan == "Owner") {
                      this.$router.push({
                          name: "OwnerKaryawan"
                        });
              
              } else if(response.data.user.posisi_karyawan == "Waiter") {
                      this.$router.push({
                          name: "WaiterCustomer"
                        });
              }else if(response.data.user.posisi_karyawan == "Cashier") {
                      this.$router.push({
                          name: "CashierCustomer"
                        });
              }
            })
            .catch(error => {
              this.error_message = error.response.data.message;
              this.color = "red";
              this.snackbar = true;
              localStorage.removeItem("token");
              this.load = false;
            });
      }
    },
    clear() {
      
      this.$refs.form.reset(); //Clear form login
    }
  }
};
</script>