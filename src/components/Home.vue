<template>
  <b-container class="home">
    <h2>Plan Your Holiday!</h2>
    <b-container>
      <b-form @submit="onSubmit">
        <b-row>
          <b-col>
            <b-form-group
              id="flight-search-input-group-from"
              label="Fly from:"
              label-for="from-input"
            >
              <b-form-select id="from-input" v-model="form.from" class="js-choice" required></b-form-select>
            </b-form-group>
          </b-col>
          <b-col>
            <b-form-group id="flight-search-input-group-to" label="Fly to:" label-for="to-input">
              <b-form-select id="to-input" v-model="form.to" class="js-choice" required></b-form-select>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col md="5" class="date-input">
            <b-form-group
              id="flight-search-input-group-date"
              label="Fly on:"
              label-for="date-input"
            >
              <b-form-input type="date" id="date-input" v-model="form.date"></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col md="3" class="middle">
            <b-form-group
              id="flight-search-input-group-currency"
              label="Currency:"
              label-for="currency-input"
            >
              <b-form-select
                id="currency-input"
                v-model="form.currency"
                class="js-choice"
                @change="getExchangeRates()"
              ></b-form-select>
            </b-form-group>
          </b-col>
        </b-row>
        <b-alert v-model="showDismissibleAlert" variant="danger" dismissible>{{ errorMessage }}</b-alert>
        <b-button type="submit" variant="outline-primary">Search!</b-button>
      </b-form>
      <br>
      <b-spinner label="Spinning" v-if="loading"></b-spinner>
    </b-container>

    <b-table striped bordered hover :fields="tableFields" :items="flights" v-if="showTable"></b-table>
  <b-container id="exchange-map-section" class="mt-4">
      <b-row>
        <b-col>
          <b-button
            @click="getExchangeRates"
            v-b-toggle.exchangeRatesCollapse
            variant="outline-warning"
            class="shadow-sm"
          >Show Exchange Rates!</b-button>
          <b-collapse id="exchangeRatesCollapse">
            <b-table
              outlined
              responsive
              caption-top
              hover
              fixed
              small
              head-variant="dark"
              :items="exchangeRates"
              class="mt-3"
            >
              <template slot="table-caption">
                <em>Exchange rates for {{ form.currency }}</em>
              </template>
            </b-table>
          </b-collapse>
        </b-col>

        
      </b-row>
    </b-container>
  </b-container>
  
</template>

<script>
import 'choices.js/public/assets/styles/choices.css'
import 'flatpickr/dist/flatpickr.css'
import Choices from 'choices.js'
import airports from '../assets/airports.json'
import flatpickr from 'flatpickr'
import axios from 'axios'
import querystring from 'querystring'

// initialize an axios object for accessing SkyScanner
const axiosSkyScanner = axios.create({
  baseURL: 'https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices',
  headers: {
    common: {
      'X-RapidAPI-Host': 'skyscanner-skyscanner-flight-search-v1.p.rapidapi.com',
      'X-RapidAPI-Key': '4236a13a41msh2d3b579380a3a0cp1e5d1fjsn39645275c1eb'
    }
  }
})

// initialize an axios object for accessing Exchange rates API
const axiosExchangeRates = axios.create({ baseURL: 'https://api.exchangeratesapi.io' })

const dayInMiliseconds = 86400000

const yesterday = new Date(new Date().getTime() - dayInMiliseconds)
  .toISOString()
  .slice(0, 10) // we want the date to be in a format of `yyyy-mm-dd`, hence the slice
const tomorrow = new Date(new Date().getTime() + dayInMiliseconds)
  .toISOString()
  .slice(0, 10)

const createFlight = (flights, quote, data, returning) => {
  var places = data.Places
  var carriers = data.Carriers
  var origOut = places.find(p => p.PlaceId == quote.OutboundLeg.OriginId)
  var destOut = places.find(p => p.PlaceId == quote.OutboundLeg.DestinationId)

  flights.push({
    direct: quote.Direct ? 'yes' : 'no',
    date: quote.OutboundLeg.DepartureDate.slice(0, 10),
    from: origOut.CityName,
    to: destOut.CityName,
    price: quote.MinPrice,
    currency: data.Currencies[0].Code
  })

  return flights
}

export default {
  name: 'home',
  data () {
    return {
      form: {
        from: 'WAW',
        to: 'IAD',
        date: tomorrow
      },
      returning: false,
      loading: false,
      showDismissibleAlert: false,
      errorMessage: '',
      showTable: false,
      tableFields: ['direct', 'from', 'to', 'date', { key: 'price', sortable: true }, 'currency'],
      flights: []
    }
  },
  mounted () {
    const fromChoices = new Choices('#from-input', { choices: airports.airports })
      .setChoiceByValue(this.form.from)
    const toChoices = new Choices('#to-input', { choices: airports.airports }).setChoiceByValue(this.form.to)
    const fpDate = flatpickr('#date-input', { mode: 'range', disable: [{ from: '1999-01-01', to: yesterday }] })
  },
  methods: {
    onSubmit (event) {
      event.preventDefault()
      this.loading = true

      var dateQuery = ''
      if (this.form.date.length == 'yyyy-mm-dd'.length) {
        dateQuery = this.form.date
        this.returning = false
      } else {
        dateQuery = this.form.date.split(' to ').join('/?inboundpartialdate=')
        this.returning = true
      }

      axiosSkyScanner.get(`browsequotes/v1.0/PL/PLN/pl-pl/${this.form.from}-sky/${this.form.to}-sky/${dateQuery}`)
        .then(response => {
          this.flights = response.data.Quotes.reduce((flights, quote) => createFlight(flights, quote, response.data, this.returning), [])
          if (this.flights.length == 0) {
            this.errorMessage = "No connecting flights found "
            this.loading = false
            this.showTable = false
            this.showDismissibleAlert = true
          } else {
            this.loading = false
            this.showTable = true
          }
        })
        .catch(e => {
          this.errorMessage = e.message
          this.loading = false
          this.showDismissibleAlert = true
        })
    },
    getExchangeRates (event) {
      axiosExchangeRates.get(`/latest?base=${this.form.currency}`)
        .then(response => {
          this.exchangeRates = _.reduce(response.data.rates, (rates, value, key) => {
            if (key !== this.form.currency) {
              rates.push({ 'currency': key, 'value': value.toFixed(4) })
            }
            return rates
          }, [])
        })
    }
  }
}
</script>

<style>
h1,
h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #35495e;
}

.middle {
  float: none;
  margin: 0 auto;
}

.map {
  width: 600px;
  height: 600px;
}
</style>
