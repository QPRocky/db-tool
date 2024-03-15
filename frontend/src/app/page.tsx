"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

const Home = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios
      .get("https://localhost:7210/WeatherForecast")
      .then((response) => {
        setData(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }, []);

  return <p>kissa</p>;
};

export default Home;
