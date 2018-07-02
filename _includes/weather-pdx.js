<script>
let data;
const dataURL = 'https://gist.githubusercontent.com/mendozaline/75f31235d6f3ebb58189aad1ee748e64/raw/a46417057794f94055b98404c208737cadee9fd0/pdx-weather.csv'

const rowConvert = (d) => {
  return {
    date: new Date(d.date),
    dayMin: +d.daily_temp_min,
    dayMax: +d.daily_temp_max,
    avgMin: +d.avg_temp_min,
    avgMax: +d.avg_temp_max,
    recMin: +d.rec_temp_min,
    recMax: +d.rec_temp_max,
    recMinYr: +d.rec_temp_min_yr,
    recMaxYr: +d.rec_temp_max_yr,
    cRain: d.daily_precip,
    recRain: +d.daily_precip_record,
    recRainYr: +d.precip_daily_record_yr
  }
}

d3.csv(dataURL, rowConvert, weather => {
    data = weather
    drawCharts()
})

const drawCharts = () => {
  const chartWidth = parseInt(d3.select('body').style('width')) * 0.947
  const chartHeight = chartWidth / 2

  const chartDiv = d3.select('#charts')
    .append('div')
    .attr('id', 'chart-1')
    .style('width', chartWidth + 'px')
    .style('margin', 'auto')

  const w = parseInt(d3.select('#chart-1').style('width')) * 1
  const h = w / 2
  const pad = {top:h/29, bottom:h/12.5, left:w/20, right:w/100}

  const yearRange = d3.extent(data, d => d.date)
  const startYear = yearRange[0].getUTCFullYear()
  const endYear = yearRange[1].getUTCFullYear()

  const currentYr = d3.select('#chart-1')
    .append('h3')
    .text(2017)
    .attr('id', 'year')
    .style('margin', 'auto')
    .style('width', '90%')
    .style('text-align', 'center')

  const sliderDiv = d3.select('#chart-1')
    .append('div')
    .attr('id', 'slider-div')
    .style('margin', '1% auto')
    .style('max-width', '1000px')
    .style('width', '75%')

  const yearLabelStart = d3.select('#slider-div')
    .append('h3')
    .text(startYear)
    .style('float', 'left')
    .style('margin', '0')

  const yearLabelEnd = d3.select('#slider-div')
    .append('h3')
    .text(endYear)
    .style('float', 'right')
    .style('margin', '0')

  const inputDiv = d3.select('#slider-div')
    .append('div')
    .attr('id', 'input-div')
    .style('margin', 'auto')
    .style('width', '75%')

  const slider = d3.select('#input-div')
    .append('input')
    .attr('type', 'range')
    .attr('id', 'slider')
    .attr('min', startYear)
    .attr('max', endYear)
    .attr('step', 1)
    .attr('value', 2017)
    .style('margin', '0')
    .style('width', '100%')
    .style('background-color', 'white')
    .style('border', '1px solid white')

   const svg = d3.select('#chart-1')
    .append('svg')
    .attr('width', w + 'px')
    .attr('height', h + 'px')

  const filterData2017 = data.filter(d => {
    return d.date > new Date('2016, 12, 31') && d.date < new Date('2017, 12, 31')
  })

  const xMinMax = d3.extent(filterData2017, d => d.date)
  const xScale = d3.scaleTime()
    .domain([xMinMax[0], xMinMax[1]])
    .range([0 + pad.left, w - pad.right])

  const yMin = d3.min(filterData2017, d => d.recMin)
  const yMax = d3.max(filterData2017, d => d.recMax)
  const yScale = d3.scaleLinear()
    .domain([-25, 115])
    .range([h - pad.bottom, 0 + pad.top])

  const months = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
  const xBand = d3.scaleBand()
    .domain(months)
    .range([0 + pad.left, w - pad.right])
    .paddingInner(0.05)
    .paddingOuter(0.025)

  const areaLineG = svg.append('g')
    .attr('class', 'chart-paths')

  const maxLineGen = d3.line()
    .defined(d => d.recMax)
    .curve(d3.curveStep)
    .x(d => xScale(d.date))
    .y(d => yScale(d.recMax))

  const maxLine = areaLineG.append('path')
    .datum(filterData2017)
    .attr('class', 'crimson')
    .attr('d', maxLineGen)
    .style('fill', 'none')
    .style('opacity', 1.0)
    .style('stroke', 'crimson')
    .style('stroke-width', h/280)

  const minLineGen = d3.line()
    .defined(d => d.recMin)
    .curve(d3.curveStep)
    .x(d => xScale(d.date))
    .y(d => yScale(d.recMin))

  const minLine = areaLineG.append('path')
    .datum(filterData2017)
    .attr('class', 'dodgerBlue')
    .attr('d', minLineGen)
    .style('fill', 'none')
    .style('opacity', 1.0)
    .style('stroke', 'dodgerBlue')
    .style('stroke-width', h/280)

  const avgAreaGen = d3.area()
    .defined(d => d.avgMin && d.avgMax)
    .curve(d3.curveStep)
    .x(d => xScale(d.date))
    .y0(d => yScale(d.avgMin))
    .y1(d => yScale(d.avgMax))

  const avgArea = areaLineG.append('path')
    .datum(filterData2017)
    .attr('class', 'gray')
    .attr('d', avgAreaGen)
    .style('fill', 'lightGray')
    .style('opacity', 0.75)
    .style('stroke', 'black')
    .style('stroke-width', h/750)

  const dayAreaGen = d3.area()
    .defined(d => d.dayMin && d.dayMax)
    .curve(d3.curveStep)
    .x(d => xScale(d.date))
    .y0(d => yScale(d.dayMin))
    .y1(d => yScale(d.dayMax))

  const dayArea = areaLineG.append('path')
    .datum(filterData2017)
    .attr('class', 'orange')
    .attr('d', dayAreaGen)
    .style('fill', 'darkOrange')
    .style('opacity', 0.66)
    .style('stroke', 'black')
    .style('stroke-width', h/500)

  const maxLabel = areaLineG.append('text')
    .attr('x', xScale(new Date('2017, 4, 24')) )
    .attr('y', yScale(102.5) )
    .attr('fill', 'crimson')
    .attr('font-size', w/50)
    .attr('font-weight', 'bold')
    .attr('text-anchor', 'end')
    .text('Record daily high')

  const dailyLabel = areaLineG.append('text')
    .attr('x', xScale(new Date('2017, 4, 24')) )
    .attr('y', yScale(92.5) )
    .attr('fill', 'darkOrange')
    .attr('font-size', w/50)
    .attr('font-weight', 'bold')
    .attr('text-anchor', 'end')
    .text('Daily high/low')

  const avgLabel = areaLineG.append('text')
    .attr('x', xScale(new Date('2017, 4, 24')) )
    .attr('y', yScale(10) )
    .attr('fill', 'darkGray')
    .attr('font-size', w/50)
    .attr('font-weight', 'bold')
    .attr('text-anchor', 'end')
    .text('Avg. daily high/low')

  const minLabel = areaLineG.append('text')
    .attr('x', xScale(new Date('2017, 4, 24')) )
    .attr('y', yScale(0) )
    .attr('fill', 'dodgerBlue')
    .attr('font-size', w/50)
    .attr('font-weight', 'bold')
    .attr('text-anchor', 'end')
    .text('Record low')

  const rainLabel = areaLineG.append('text')
    .attr('x', xScale(new Date('2017, 6, 30')) )
    .attr('y', yScale(-14) )
    .attr('fill', 'teal')
    .attr('font-size', w/50)
    .attr('font-weight', 'bold')
    .attr('text-anchor', 'middle')
    .text('Daily precipitation')

  const monthG = svg.append('g')
    .attr('class', 'month-labels')

  const monthGG = monthG.selectAll('g')
    .data(d3.range(1,13,1))
    .enter()
    .append('g')

  monthGG.append('line')
    .filter(d => d !== 1)
    .attr('class', 'vertical')
    .attr('x1', d => xScale(new Date('2017, ' + d + ', 1')))
    .attr('y1', yScale.range()[1])
    .attr('x2', d => xScale(new Date('2017, ' + d + ', 1')))
    .attr('y2', h - pad.bottom)
    .attr('stroke', 'dimGray')
    .attr('stroke-dasharray', '5,5')
    .style('stroke-width', h/800)

  monthGG.append('text')
    .attr('class', 'month')
    .attr('x', d => xScale(new Date('2017, ' + d + ', 1')) + xBand.bandwidth()/2)
    .attr('y', yScale.range()[1] + 1)
    .attr('font-size', w/55 + 'px')
    .attr('text-anchor', 'middle')
    .text(d => new Date('2017, ' + (d) + ', 1').toString().split(' ')[1])

  const xLinePos = w/23
  const xTextPos = w/26
  const customYAxis = svg.append('g')
    .attr('class', 'yAxis')

  const yLineAxis2 = customYAxis.append('line')
    .attr('x1', xLinePos)
    .attr('y1', yScale(yMax))
    .attr('x2', xLinePos)
    .attr('y2', yScale(yMin))
    .attr('stroke', 'black')
    .attr('stroke-width', h/500)

  const axisMaxLine = customYAxis.append('line')
    .attr('x1', xLinePos - w/200)
    .attr('y1', yScale(yMax))
    .attr('x2', xLinePos + w/200)
    .attr('y2', yScale(yMax))
    .style('stroke', 'crimson')
    .attr('stroke-width', h/400)
  const axisMinText = customYAxis.append('text')
    .attr('x', xTextPos)
    .attr('y', yScale(yMax - 1.25))
    .attr('fill', 'crimson')
    .attr('font-size', h/40)
    .attr('text-anchor', 'end')
    .text(yMax + '°F')

  const axisMinLine = customYAxis.append('line')
    .attr('x1', xLinePos - w/200)
    .attr('y1', yScale(yMin))
    .attr('x2', xLinePos + w/200)
    .attr('y2', yScale(yMin))
    .style('stroke', 'dodgerBlue')
    .attr('stroke-width', h/400)
  const axisMinText2 = customYAxis.append('text')
    .attr('x', xTextPos)
    .attr('y', yScale(yMin - 1.25))
    .attr('fill', 'dodgerBlue')
    .attr('font-size', h/40)
    .attr('text-anchor', 'end')
    .text(yMin + '°F')

  for (let ww = 10 ; ww <= 100; ww+=20) {
    customYAxis.append('line')
      .attr('x1', xLinePos - w/200)
      .attr('y1', yScale(ww) )
      .attr('x2', xLinePos + w/200)
      .attr('y2', yScale(ww) )
      .attr('stroke-width', h/400)

    customYAxis.append('text')
      .attr('x', xTextPos)
      .attr('y', yScale(ww))
      .attr('font-size', h/40)
      .attr('text-anchor', 'end')
      .text(ww + '°F')
  }

  const xAxis = svg.append('g')
    .attr('class', 'xAxis')
    .attr('transform', 'translate('+ 0 + ',' + (h - pad.bottom) + ')')
    .style('font-size', w/75 + 'px')
    .style('text-anchor', 'middle')
    .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat('%b-%d')).ticks(10))

  const rainChart = svg.append('g')
    .attr('class', 'rain-chart')

  const yRainMinMax = d3.extent(data, d => +d.cRain)
  const yScaleRain = d3.scaleLinear()
    .domain([0, yRainMinMax[1]])
    .range([yScale(yScale.domain()[0]), yScale(yMin)])

  const rainRects = rainChart.selectAll('rect.rain-bars')
    .data(filterData2017, d => d.date)
    .enter()
    .append('rect')
    .attr('class', 'rain-bars')
    .attr('x', d => xScale(d.date))
    .attr('y', d => d.cRain === 'T' ? yScaleRain(0) : yScaleRain(+d.cRain))
    .attr('width', w/475)
    .attr('height', d => yScaleRain.range()[0] - (d.cRain === '0' ? yScaleRain(0.0001) : d.cRain === 'T' ? yScaleRain(0.001) : yScaleRain(+d.cRain)))
    .attr('fill', 'teal')
    .attr('opacity', 1.0)

  rainRects.append('title')
    .text(d => d.date.toUTCString() + ': ' + d.cRain + '"')

  const customRainAxis = svg.append('g')
    .attr('class', 'my-rainAxis-')

  const yLineAxis = customRainAxis.append('line')
    .attr('x1', xLinePos)
    .attr('y1', yScaleRain(2) )
    .attr('x2', xLinePos)
    .attr('y2', yScaleRain(yRainMinMax[0]) )
    .attr('stroke', 'black')
    .attr('stroke-width', h/500)

  for (let m = 0; m <= 2; m++) {
    customRainAxis.append('line')
      .attr('x1', xLinePos - w/200)
      .attr('y1', yScaleRain(m))
      .attr('x2', xLinePos + w/200)
      .attr('y2', yScaleRain(m))
      .attr('stroke', m === 1 ? 'teal' : 'black')
      .attr('stroke-width', h/400)

    customYAxis.append('text')
      .attr('x', xTextPos)
      .attr('y', yScaleRain(m - 0.1))
      .attr('fill', 'teal')
      .attr('font-size', h/35)
      .attr('text-anchor', 'end')
      .text(m === 0 || m === 2 ? '' : m + '"')
  }

  for (let n = 1; n <= 2; n++) {
    rainChart.append('line')
      .attr('class', 'rain-gridlines')
      .attr('x1', xScale(new Date('2016, 12, 31')))
      .attr('y1', yScaleRain(n))
      .attr('x2', xScale(new Date('2017, 12, 31')))
      .attr('y2', yScaleRain(n))
      .attr('stroke', 'white')
      .style('stroke-width', h/250)
      .attr('opacity', 1.0)
      .attr('pointer-events', 'none')
  }

  let chartHover = svg.append('g')
    .attr('class', 'hover')

  let hoverRects = chartHover.selectAll('rect.hover')
    .data(filterData2017)
    .enter()
    .append('rect')
    .attr('class', 'hover')
    .attr('x', d => xScale(d.date))
    .attr('y', d => yScale(yMax))
    .attr('width', w/475)
    .attr('height', yScale(yScale.domain()[0]) - yScale(yMax)) //top
    .attr('fill', 'black')
    .attr('cursor', 'crosshair')
    .attr('opacity', 0.0)

  hoverRects.append('title')
    .text(d => d.date.toUTCString())

  let hovered = (dd,i) => {
    let thisDay = dd.date.toUTCString().split(',')[1]
    let date = chartHover.append('text')
      .attr('class', 'hoverCirc')
      .attr('x', xScale(dd.date))
      .attr('y', yScale(yScale.domain()[1] - 5))
      .attr('text-anchor', 'middle')
      .attr('font-size', w/75)
      .attr('font-weight', 'bold')
      .text(thisDay.slice(0,3))

    let recMax = chartHover.append('circle')
      .attr('class', 'hoverCirc')
      .attr('cx', xScale(dd.date))
      .attr('cy', yScale(dd.recMax))
      .attr('r', w/105)
      .attr('fill', 'crimson')
      .attr('stroke', 'black')
      .attr('stroke-width', w/1500)
      .attr('opacity', 0.75)
      .attr('pointer-events', 'none')

    let recMin = chartHover.append('circle')
      .attr('class', 'hoverCirc')
      .attr('cx', xScale(dd.date))
      .attr('cy', yScale(dd.recMin))
      .attr('r', w/105)
      .attr('fill', 'dodgerBlue')
      .attr('stroke', 'black')
      .attr('stroke-width', w/1500)
      .attr('opacity', 0.75)
      .attr('pointer-events', 'none')

    let dayMax = chartHover.append('circle')
      .attr('class', 'hoverCirc')
      .attr('cx', xScale(dd.date))
      .attr('cy', yScale(dd.dayMax))
      .attr('r', w/105)
      .attr('fill', 'darkOrange')
      .attr('stroke', 'black')
      .attr('stroke-width', w/1500)
      .attr('opacity', dd.dayMax === 0 ? 0.0 : 0.75)
      .attr('pointer-events', 'none')

    let dayMin = chartHover.append('circle')
      .attr('class', 'hoverCirc')
      .attr('cx', xScale(dd.date))
      .attr('cy', yScale(dd.dayMin))
      .attr('r', w/105)
      .attr('fill', 'darkOrange')
      .attr('stroke', 'black')
      .attr('stroke-width', w/1500)
      .attr('opacity', dd.dayMax === 0 ? 0.0 : 0.75)
      .attr('pointer-events', 'none')

    recMax = chartHover.append('text')
      .attr('class', 'hoverCirc')
      .attr('x', xScale(dd.date))
      .attr('y', yScale(dd.recMax - 1.5))
      .attr('fill', 'black')
      .attr('font-size', w/75)
      .attr('font-weight', 'bold')
      .attr('text-anchor', 'middle')
      .attr('pointer-events', 'none')
      .text(dd.recMax)

    recMin = chartHover.append('text')
      .attr('class', 'hoverCirc')
      .attr('x', xScale(dd.date))
      .attr('y', yScale(dd.recMin - 1.5))
      .attr('fill', 'black')
      .attr('font-size', w/75)
      .attr('font-weight', 'bold')
      .attr('text-anchor', 'middle')
      .attr('pointer-events', 'none')
      .text(dd.recMin)

    dayMax = chartHover.append('text')
      .attr('class', 'hoverCirc')
      .attr('x', xScale(dd.date))
      .attr('y', yScale(dd.dayMax - 1.5))
      .attr('fill', 'black')
      .attr('font-size', w/75)
      .attr('font-weight', 'bold')
      .attr('text-anchor', 'middle')
      .attr('opacity', dd.dayMax === 0 ? 0.0 : 0.75)
      .attr('pointer-events', 'none')
      .text(dd.dayMax)

    dayMin = chartHover.append('text')
      .attr('class', 'hoverCirc')
      .attr('x', xScale(dd.date))
      .attr('y', yScale(dd.dayMin - 1.5))
      .attr('fill', 'black')
      .attr('font-size', w/75)
      .attr('font-weight', 'bold')
      .attr('text-anchor', 'middle')
      .attr('opacity', dd.dayMax === 0 ? 0.0 : 0.75)
      .attr('pointer-events', 'none')
      .text(dd.dayMin)

    let rainText = +dd.cRain
    let rainInch = chartHover.append('text')
      .attr('class', 'hoverCirc')
      .attr('x', xScale(dd.date) - w/110)
      .attr('y', dd.cRain === 'T' ?  yScaleRain(0 + 0.1) : yScaleRain(+dd.cRain + 0.05))
      .attr('fill', 'teal')
      .attr('font-size', w/70)
      .attr('font-weight', 'bolder')
      .attr('stroke', 'white')
      .attr('stroke-width', w/1750)
      .attr('text-anchor', 'start')
      .attr('text-anchor', dd.cRain === 'T' ?  'start' : 'start')
      .attr('pointer-events', 'none')
      .text(dd.cRain === 'T' ?  'Trace' :
            dd.cRain === '' ? '' :
            dd.cRain === '0' ? rainText.toFixed(1) + '"' : rainText + '"')
  }

  hoverRects.on('mouseover', (d,i) => {
    hovered(d,i)
  })
  .on('mouseout', d => {
    d3.selectAll('.hoverCirc')
      .remove()
  })

  d3.select('#slider').on('change', function () {
    let value = +d3.select(this).node().value
    currentYr.text(value)

    let filterData = data.filter(d => d.date > new Date( (value - 1) + ', 12, 31') && d.date < new Date(value + ', 12, 31'))

    let xMinMax = d3.extent(filterData, d => d.date)
    xScale.domain([xMinMax[0], xMinMax[1]])
    xAxis.call(d3.axisBottom(xScale).tickFormat(d3.timeFormat('%b-%d')).ticks(10))

    d3.selectAll('path.dodgerBlue')
      .datum(filterData)
      .transition()
      .duration(1000)
      .attr('class', 'dodgerBlue')
      .attr('d', minLineGen)
      .style('fill', 'none')
      .style('opacity', 1.0)
      .style('stroke', 'dodgerBlue')
      .style('stroke-width', h/280)

    d3.selectAll('path.crimson')
      .datum(filterData)
      .transition()
      .duration(1000)
      .attr('class', 'crimson')
      .attr('d', maxLineGen)
      .style('fill', 'none')
      .style('opacity', 1.0)
      .style('stroke', 'crimson')
      .style('stroke-width', h/280)

    d3.selectAll('path.gray')
      .datum(filterData)
      .transition()
      .duration(1000)
      .attr('class', 'gray')
      .attr('d', avgAreaGen)
      .style('fill', 'lightGray')
      .style('opacity', 0.75)
      .style('stroke', 'black')
      .style('stroke-width', h/750)

    d3.selectAll('path.orange')
      .datum(filterData)
      .transition()
      .duration(1000)
      .attr('class', 'orange')
      .attr('d', dayAreaGen)
      .style('fill', 'darkOrange')
      .style('opacity', 0.66)
      .style('stroke', 'black')
      .style('stroke-width', h/500)

    let oldBars = rainChart.selectAll('rect')
      .data(filterData, d => d.date)

    oldBars.exit()
      .remove()

    let newBars = oldBars.enter()
      .append('rect')
      .attr('class', 'rain-bars')
      .attr('x', d => xScale(d.date))
      .attr('y', d => d.cRain === 'T' ? yScaleRain(0) : yScaleRain(+d.cRain))
      .attr('width', w/475)
      .attr('height', d => yScaleRain.range()[0] - (d.cRain === '0' ? yScaleRain(0.0001) : d.cRain === 'T' ? yScaleRain(0.001) : yScaleRain(+d.cRain)))
      .attr('fill', 'teal')
      .attr('opacity', 1.0)

    newBars.append('title')
      .text(d => d.date.toUTCString() + ': ' + d.cRain + '"' )

    let allBars = newBars.merge(oldBars)
      .transition()
      .duration(750)
      .on('start', function() {
        d3.select(this)
          .attr('y', d => yScaleRain(0))
          .attr('height', 0)
      })
      .transition()
      .duration(500)
      .ease(d3.easeBackOut)
      .attr('y', d => d.cRain === 'T' ? yScaleRain(0) : yScaleRain(+d.cRain))
      .attr('height', d => yScaleRain.range()[0] - (d.cRain === '0' ? yScaleRain(0.0001) : d.cRain === 'T' ? yScaleRain(0.001) : yScaleRain(+d.cRain)))

    for (let n = 1; n <= 2; n++) {
      rainChart.append('line')
        .attr('class', 'rain-gridlines')
        .attr('x1', xScale(new Date((value - 1) + ', 12, 31')))
        .attr('y1', yScaleRain(n))
        .attr('x2', xScale(new Date(value + ', 12, 31')))
        .attr('y2', yScaleRain(n))
        .attr('stroke', 'white')
        .style('stroke-width', h/250)
        .attr('opacity', 1.0)
        .attr('pointer-events', 'none')
    }

    let oldHover = chartHover.selectAll('rect')
      .data(filterData, d => d.date)

    oldHover.exit()
      .remove()

    let newHover = oldHover.enter()
      .append('rect')
      .attr('class', 'hover')
      .attr('x', d => xScale(d.date))
      .attr('y', d => yScale(yMax))
      .attr('width', w/475)
      .attr('height', yScale(yScale.domain()[0]) - yScale(yMax)) //top
      .attr('fill', 'black')
      .attr('cursor', 'crosshair')
      .attr('opacity', 0.0)

    newHover.append('title')
      .text(d => d.date.toUTCString())

    newHover.on('mouseover', (d,i) => {
      hovered(d,i)
    })
    .on('mouseout', d => {
      d3.selectAll('.hoverCirc')
        .remove()
    })

    monthG.selectAll('line')
      .data(d3.range(1,13,1))
      .filter(d => d !== 1)
      .attr('x1', d => xScale(new Date(value + ', ' + d + ', 1')))
      .attr('x2', (d, i) => xScale(new Date(value + ', ' + d + ', 1')))

    monthG.selectAll('text')
      .data(d3.range(1,13,1))
      .attr('x', d => xScale(new Date(value + ', ' + d + ', 1')) + xBand.bandwidth()/2)
  })
}

const resize = () => {
  d3.selectAll('div#chart-1').remove()
  d3.selectAll('svg').remove()
  drawCharts()
}

d3.select(window).on('resize', resize);
</script>