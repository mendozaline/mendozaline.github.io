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

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

{% include weather-pdx.js %}

`data.filter(t => {
  return t.date > new Date('2016, 12, 31') && t.date < new Date('2017, 12, 31');
});`


```Javascript
const f = d3.max(y, t => {
  return t.recMax
});

const g = d3.scaleLinear()
  .domain([-25, 115])
  .range([s - i, 0 + n])
  
const m = d3.scaleBand()
  .domain(["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"])
  .range([0 + d, l - o])
  .paddingInner(.05)
  .paddingOuter(.025)
```
