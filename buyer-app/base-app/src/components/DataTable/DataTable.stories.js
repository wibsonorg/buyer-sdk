import React, { Component } from "react";

import { storiesOf } from "@storybook/react";

import DataTable from "./DataTable";

const columns = [
  {
    name: "date",
    label: "Date",
    sortable: true,
    sortFunction: (a, b) => {
      if (a.length === b.length) {
        return a > b ? 1 : -1;
      }
      return a.length > b.length ? 1 : -1;
    }
  },
  {
    name: "notaries",
    label: "Notaries",
    renderer: value => <div><b>{value}</b><br/><b>{value}</b><br/><b>{value}</b></div>
  },
  {
    name: "audiences",
    label: "Audiences"
  },
  {
    name: "requestedData",
    label: "Requested Data"
  },
  {
    name: "actions",
    renderer: () => <button>Do something</button>
  }
];

const data = [
  {
    date: "1/1/1",
    notaries: "notary 2",
    audiences: "Males",
    requestedData: "Browsing history",
    actions: "none"
  },
  {
    date: "1/1/1100",
    notaries: "notary 2",
    audiences: "Females",
    requestedData: "Browsing history",
    actions: "none"
  },
  {
    date: "1/1/2000",
    notaries: "notary 2",
    audiences: "Females",
    requestedData: "Browsing history",
    actions: "none"
  }
];

const asyncData = new Promise((resolve, reject) => { });

storiesOf("DataTable", module)
  .add("Basic DataTable", () => <DataTable columns={columns} data={data} />)
  .add("Async Data", () => <DataTable columns={columns} data={asyncData} />);
