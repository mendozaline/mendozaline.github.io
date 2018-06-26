---
layout: d3v4
title: The Weather in Portland
author: David Mendoza
permalink: /:year/:month/portland-weather
---

<style>
  body {
    font-family: san-serif, arial;
    margin: 0;
  }
  
  .xAxis line {
    stroke: black;
    shape-rendering: crispEdges;
  }
  
  .xAxis path {
    stroke: none;
    shape-rendering: crispEdges;
  }

  .button {
    background: black;
  }

  .button:hover {
    background: crimson;
    opacity: 0.9;
  }

  .active {
    background: crimson;
  }
</style>

{% include weather-pdx.js %}
