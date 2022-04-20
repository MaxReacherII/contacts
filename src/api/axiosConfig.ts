import { configure } from 'axios-hooks'
import LRU from 'lru-cache'
import Axios from 'axios'

const axios = Axios.create({
    baseURL: 'http://localhost:4000/contacts'
})

const cache = new LRU({ max: 10 })

configure({ axios, cache })