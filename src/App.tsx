import React, { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import CryptoSummary from "./components/CryptoSummary";
import { Crypto } from "./Crypto";
import moment from "moment";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import type { ChartData, ChartOptions } from "chart.js";
import { privateDecrypt } from "crypto";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  const [cryptos, setCryptos] = useState<Crypto[] | null>(null);
  const [selected, setSelected] = useState<Crypto | null>(null);
  const [data, setData] = useState<ChartData<"line">>();

  const [range, setRange] = useState<string>("29");
  const [options, setOptions] = useState<ChartOptions<"line">>({
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: false,
      },
    },
  });

  useEffect(() => {
    
    const url =
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false";
    axios.get(url).then((response) => {
      console.log(response.data);
      setCryptos(response.data);
    });
  }, []);

  useEffect(() => {
    //request
    //update data state
    if (!selected) {
      return;
    }

    axios
      .get(
        `https://api.coingecko.com/api/v3/coins/${
          selected?.id
        }/market_chart?vs_currency=usd&days=${range}&${
          range === "1" ? "interval-hourly" : "interval=daily"
        }`
      )
      .then((response) => {
        console.log("getting crypto");
        console.log(response.data);
        setData({
          labels: response.data.prices.map((price: number[]) => {
            return moment
              .unix(price[0] / 1000)
              .format(range === "1" ? "HH:MM" : "MM-DD");
          }),
          datasets: [
            {
              label: "Dataset 1",
              data: response.data.prices.map((price: number[]) => {
                return price[1];
              }),
              borderColor: "rgb(255, 99, 132)",
              backgroundColor: "rgba(255, 99, 132, 0.5)",
            },
          ],
        });
      });
    setOptions({
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text:
            `${selected?.name} Price over last ` +
            `${
              range === "1" ? "1 day" : range === "29" ? "30 days" : "7 days"
            }`,
        },
      },
    });
  }, [selected, range]);

  return (
    <>
      <div className="App">
        <select
          title="drop"
          onChange={(e) => {
            cryptos?.find((x) => {
              if (x.id === e.target.value) {
                setSelected(x);

                console.log(x);
              }
            });
          }}
          defaultValue="default"
        >
          <option value="default">Choose an option</option>
          {cryptos
            ? cryptos.map((crypto) => {
                return (
                  <option key={crypto.id} value={crypto.id}>
                    {crypto.name}
                  </option>
                );
              })
            : null}{" "}
        </select>
        <select
          onChange={(e) => {
            setRange(e.target.value);
            console.log(e.target.value);
          }}
        >
          <option value="29">30 Days</option>
          <option value="6">7 Days</option>
          <option value="1">1 Day</option>
        </select>
      </div>
      {selected ? <CryptoSummary crypto={selected} /> : null}
      {data ? (
        <div style={{ width: 600 }}>
          <Line options={options} data={data} />{" "}
        </div>
      ) : null}
    </>
  );
}

export default App;
