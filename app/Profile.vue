
<template lang="html">
  <div class="off-canvas-content" data-off-canvas-content>
    <div class="row content">
      <div class="small-12 columns">
        <!-- Title -->
        <h4 class="title">
          <router-link to="/">
            <i class="fa fa-chevron-left" aria-hidden="true"></i>
          </router-link>
          {{$t("message.profile")}}
        </h4>
      </div>

      <div class="small-12 columns">
        <div class="card">
          <div class="card-section">
            <p class="subheader uppercase">{{$t("message.personalInformation")}}</p>
            <br>
            <label for="name">
              {{$t("message.name")}}
              <input type="text" name="name" id="name" v-model="profile.name" />
            </label>
            <label for="lastname">
              {{$t("message.lastname")}}
              <input type="text" name="name" id="lastname" v-model="profile.lastName" />
            </label>
            <label for="address">
              {{$t("message.address")}}
              <vue-google-autocomplete
                  id="address"
                  classname="form-control"
                  v-bind:placeholder="addressLiteral"
                  country="ar"
                  v-on:placechanged="getAddressData">
              </vue-google-autocomplete>
            </label>
            <div id="map" style="width: 100%; height: 300px;"></div>
            <br>
            <button href="#" class="button hollow" @click="updateProfile">{{$t("message.save")}} <i class="fa fa-floppy-o" aria-hidden="true"></i></button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
const HTTP = require('./http.js');
import VueGoogleAutocomplete from 'vue-google-autocomplete';

export default{
  components: { VueGoogleAutocomplete },

  name: 'profile',

  data: function(){
    return {
      profile: {
        address: '',
        name: '',
        lastName: '',
        latitude: null,
        longitude: null
      },
      address: {lat: -34.709405, lng: -58.280486}
    };
  },
  computed: {
    user: function(){
      return this.$store.state.user;
    },
    addressLiteral: function(){
      if(this.profile.address != ''){
        return this.profile.address;
      }
      return 'Type an address'
    },
    coords: function(){
      return {
        lat: this.profile.latitude,
        lng: this.profile.longitude
      }
    }
  },
  watch:{
    coords: function(){
      this.drawMap();
    }
  },
  created: function(){
    HTTP.get("user/profile/" + this.user.username)
        .then(response => {
          this.profile = response.data;
        })
        .catch(error => {
          this.$store.commit("setError", error.response.data);
        });
  },
  mounted: function(){
    this.drawMap();
  },
  methods: {
    updateProfile: function(){
      HTTP.put("user/profile", this.profile)
          .then(response => {
            this.$store.commit("setMessage", response.data);
          })
          .catch(error => {
            this.$store.commit("setError", error.response.data);
          });
    },
    getAddressData: function(data, place){
      console.log(data);
      this.address = data;
      this.profile.address = data.route + " " + data.street_number + ", " + data.locality + ", " + data.administrative_area_level_1 + ", " + data.country;
      this.profile.latitude = data.latitude;
      this.profile.longitude = data.longitude;
    },
    drawMap(){
      var myLatLngOrigin = {lat: -34.706543, lng: -58.278538};
      var map = new google.maps.Map(document.getElementById('map'), {
        center: myLatLngOrigin,
        scrollwheel: false,
        zoom: 14
      });


      var markerOrigin = new google.maps.InfoWindow({
          content: "<h5>Store</h5>",
          position: myLatLngOrigin
      });

      var markerDestination = new google.maps.InfoWindow({
          content: "<h5> Your Home </h5>" + "<p>"+ this.profile.address +"</p>",
          position: this.coords
      });

      markerOrigin.open(map);
      markerDestination.open(map);


      var directionsService = new google.maps.DirectionsService;
      var directionsDisplay = new google.maps.DirectionsRenderer;

      directionsDisplay.setMap(map);

      directionsService.route({
          origin: myLatLngOrigin,
          destination: this.coords,
          travelMode: 'DRIVING'
        }, function(response, status) {
          if (status === 'OK') {
            directionsDisplay.setDirections(response);
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });

    }
  }
}
</script>

<style lang="css">
</style>
