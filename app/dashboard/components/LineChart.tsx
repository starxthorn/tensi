"use client";
import React, { PureComponent } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "Jan",
    uv: Math.floor(Math.random() * 5000) + 1000,
    pv: Math.floor(Math.random() * 5000) + 1000,
    amt: 2400,
  },
  {
    name: "Feb",
    uv: Math.floor(Math.random() * 5000) + 1000,
    pv: Math.floor(Math.random() * 5000) + 1000,
    amt: 2210,
  },
  {
    name: "Mar",
    uv: Math.floor(Math.random() * 5000) + 1000,
    pv: Math.floor(Math.random() * 5000) + 1000,
    amt: 2290,
  },
  {
    name: "Apr",
    uv: Math.floor(Math.random() * 5000) + 1000,
    pv: Math.floor(Math.random() * 5000) + 1000,
    amt: 2000,
  },
  {
    name: "May",
    uv: Math.floor(Math.random() * 5000) + 1000,
    pv: Math.floor(Math.random() * 5000) + 1000,
    amt: 2181,
  },
  {
    name: "Jun",
    uv: Math.floor(Math.random() * 5000) + 1000,
    pv: Math.floor(Math.random() * 5000) + 1000,
    amt: 2500,
  },
  {
    name: "Jul",
    uv: Math.floor(Math.random() * 5000) + 1000,
    pv: Math.floor(Math.random() * 5000) + 1000,
    amt: 2100,
  },
  {
    name: "Aug",
    uv: Math.floor(Math.random() * 5000) + 1000,
    pv: Math.floor(Math.random() * 5000) + 1000,
    amt: 2100,
  },
];

export default class TwoLineChart extends PureComponent {
  static demoUrl =
    "https://codesandbox.io/p/sandbox/line-chart-width-xaxis-padding-8v7952";

  render() {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="pv"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
          <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    );
  }
}
