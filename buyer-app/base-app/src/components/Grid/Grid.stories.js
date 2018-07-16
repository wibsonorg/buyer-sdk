import React from "react";
import { storiesOf } from "@storybook/react";

import Grid from "./Grid";

storiesOf("Grid", module).add("One Column", () => (
  <Grid columns={1}>
    <div style={{"border": "1px solid black"}}>First row</div>
    <div style={{"border": "1px solid black"}}>Second row</div>
    <div style={{"border": "1px solid black"}}>Third row</div>
    <div style={{"border": "1px solid black"}}>Fourth row</div>
  </Grid>

)).add("Two Columns", () => (
  <Grid columns={2}>
    <div style={{"border": "1px solid black"}}>First row</div>
    <div style={{"border": "1px solid black"}}>Second row</div>
    <div style={{"border": "1px solid black"}}>Third row</div>
    <div style={{"border": "1px solid black"}}>Fourth row</div>
  </Grid>

)).add("Three Columns", () => (
  <Grid columns={3}>
    <div style={{"border": "1px solid black"}}>First row</div>
    <div style={{"border": "1px solid black"}}>Second row</div>
    <div style={{"border": "1px solid black"}}>Third row</div>
    <div style={{"border": "1px solid black"}}>Fourth row</div>
  </Grid>
)).add("Complex Grid", () => (
  <div style={{"textAlign": "center"}}>
    <Grid columns={1}>
      <Grid columns={2}>
        <div style={{"border": "1px solid black"}}>First row</div>
        <div style={{"border": "1px solid black"}}>Second row</div>
      </Grid>
      <div style={{"border": "1px solid black"}}>Third row</div>
      <div style={{"border": "1px solid black"}}>Fourth row</div>
      <Grid columns={4}>
        <div style={{"border": "1px solid black"}}>Fifth row</div>
        <div style={{"border": "1px solid black"}}>Sixth row</div>
        <div style={{"border": "1px solid black"}}>Seventh row</div>
        <div style={{"border": "1px solid black"}}>Eighth row</div>
      </Grid>
      <Grid columns={3}>
        <div style={{"border": "1px solid black"}}>Ninth row</div>
        <div style={{"border": "1px solid black"}}>Tenth row</div>
        <div style={{"border": "1px solid black"}}>Eleventh row</div>
      </Grid>
      <div style={{"border": "1px solid black"}}>Twelfth row</div>
    </Grid>
  </div>
));
