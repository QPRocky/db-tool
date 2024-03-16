'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Home = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios
      //.get("http://localhost:8080/WeatherForecast")
      .get('https://localhost:7210/Database/TestConnection', {
        headers: {
          ConnectionString:
            'Server=(localdb)\\MSSQLLocalDB;Database=SPAv2_master;Trusted_Connection=True;',
        },
      })
      .then(response => {
        setData(response.data);
        console.log('jes!');
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return <p>jee222</p>;
};

export default Home;
