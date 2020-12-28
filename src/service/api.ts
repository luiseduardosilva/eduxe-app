import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers:  {'Access-Control-Allow-Origin': '*'},
});

export const viacep = axios.create({
  baseURL: 'https://viacep.com.br/ws',
  headers:  {'Access-Control-Allow-Origin': '*'},
});


export const receitaws = axios.create({
  baseURL: 'https://www.receitaws.com.br/v1/cnpj',
  headers:  {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
  },
});
