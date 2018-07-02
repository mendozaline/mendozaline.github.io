---
layout: d3v4
title: The Weather in Portland
author: David Mendoza
permalink: /:year/:month/portland-weather
---

<style>
  .xAxis line {
    stroke: black;
    shape-rendering: crispEdges;
  }
  .xAxis path {
    stroke: none;
    shape-rendering: crispEdges;
  }
</style>

{% include weather-pdx.js %}
