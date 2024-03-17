'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const testConnection = 'https://localhost:7210/Database/testConnection';
const search1 = 'https://localhost:7210/Database/search?searchQuery=oHdE.k';
const search2 = 'https://localhost:7210/Database/search?searchQuery=ohDe_i';
const search3 = 'https://localhost:7210/Database/search?searchQuery=ura o';

const Home = () => {
  useEffect(() => {
    axios
      //.get("http://localhost:8080/WeatherForecast")
      .get(search3, {
        headers: {
          ConnectionString:
            //'Server=(localdb)\\MSSQLLocalDB;Database=SPAv2_master;Trusted_Connection=True;',
            'Server=localhost;Database=YLVA;Trusted_Connection=True;',
        },
      })
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return <p>jee222</p>;
};

export default Home;
