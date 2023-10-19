let educationDataUrl ="https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json"
let countyDataUrl ="https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json"


let countyData
let educationData

let canvas = d3.select('#canvas')
let tooltip = d3.select('#tooltip')

let drawMap = () => {

    canvas.selectAll('path')
            .data(countyData)
            .enter()
            .append('path')
            .attr('d', d3.geoPath())
            .attr('class', 'county')
            .style('fill',(countyDataItem) => {
                let id = countyDataItem['id']
                let county = educationData.find((item) => {
                    return item['fips'] === id
                })
                let percentage = county['bachelorsOrHigher']
                if(percentage <= 10) {
                    return 'lavender'
                } else if (percentage <= 20) {
                        return 'thistle'
                } else if (percentage <= 30) {
                    return 'plum'
                } else if (percentage <= 40) {
                    return 'orchid'
                } else {
                    return 'darkviolet'
                }
            })
            .attr('data-fips', (countyDataItem) => {
                return countyDataItem['id']
            })
            .attr('data-education', (countyDataItem) => {
                let id = countyDataItem['id']
                let county = educationData.find((item) => {
                    return item['fips'] === id
                })
                let percentage = county['bachelorsOrHigher']
                return percentage
            })
            .on('mouseover', (countyDataItem) => {
                tooltip.transition()
                .style('visibility', 'visible')
                d3.select('#tooltip')
                .style("left", d3.event.pageX)
                .style("top", d3.event.pageY)

                let id = countyDataItem['id']
                let county = educationData.find((item) => {
                    return item['fips'] === id
                })
                tooltip.text(county['fips'] + ' - '
                + county['area_name'] + ', ' 
                + county['state'] + ' : '
                + county['bachelorsOrHigher'] + ' %')

                tooltip.attr('data-education', county['bachelorsOrHigher'])
            })
            .on('mouseout', (countyDataItem) => {
                tooltip.transition()
                .style('visibility', 'hidden')
            })
}

d3.json(countyDataUrl).then(
    (data, error) => {
        if(error) {
            console.log(log)
        } else {
            countyData = topojson.feature(data, data.objects.counties).features
            console.log(countyData)

            d3.json(educationDataUrl).then (
               (data, error) => {
                 if(error) {
                    console.log(error)
                } else {
                    educationData = data
                    console.log(educationData)
                    drawMap()
                } 
            }
            )
        }
    }
)