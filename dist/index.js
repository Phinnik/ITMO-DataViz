let sexSalaryData, raceEduData, a;
// TODO: this

const colors = {
    badSalary: '#f54747',
    goodSalary: '#47ffac',

}

d3.csv('../data/adult.csv', function (row) {
    return {
        age: +row.age,
        workclass: row.workclass,
        fnlwgt: +row.fnlwgt,
        education: row.education,
        education_num: +row.education_num,
        marital_status: row.marital_status,
        occupation: row.occupation,
        relationship: row.relationship,
        race: row.race,
        sex: row.sex,
        capital_gain: +row.capital_gain,
        capital_loss: +row.capital_loss,
        hours_per_week: +row.hours_per_week,
        native_country: row.native_country,
        income: row.income
    }
}).then(function (data) {
    drawSexSalary(data);
    drawEduRace(data);
    drawEduSalary(data);
    drawAgeGsDist(data);
    drawOccupationSalaryBubble(data);
});

function drawSexSalary(data) {
    bar_colors = {
        goodSalary: colors.goodSalary,
        badSalary: colors.badSalary,
        goodSalaryInfo: "#1d8254",
        badSalaryInfo: "",

    }

    // data preprocessing
    let stats = {
        salaryGoodFemale: 0,
        salaryBadFemale: 0,
        salaryGoodMale: 0,
        salaryBadMale: 0
    };

    data.forEach(function (row) {
        if (row.sex === 'Female' && row.income === '>50K') {
            stats.salaryGoodFemale += 1 // row.fnlwgt;
        } else if (row.sex === 'Female' && row.income === '<=50K') {
            stats.salaryBadFemale += 1 // row.fnlwgt;
        } else if (row.sex === 'Male' && row.income === '>50K') {
            stats.salaryGoodMale += 1 // row.fnlwgt;
        } else if (row.sex === 'Male' && row.income === '<=50K') {
            stats.salaryBadMale += 1 // row.fnlwgt;
        }
    });

    const svg = d3.select('#sex_salary_bar_svg');
    const svgHeight = +svg.attr('height');
    const svgWidth = +svg.attr('width');

    const margin = {top: 30, right: 20, bottom: 20, left: 60};
    const innerWidth = svgWidth - margin.left - margin.right;
    const innerHeight = svgHeight - margin.top - margin.bottom;

    const yScale = d3.scaleLinear()
        .domain([0, Math.max(stats.salaryGoodMale + stats.salaryBadMale,
            stats.salaryGoodFemale + stats.salaryBadFemale)])
        .rangeRound([innerHeight - margin.bottom, margin.top]);

    const xScale = d3.scaleBand()
        .domain(['Male', 'Female'])
        .range([0, innerWidth - margin.right])
        .paddingInner(0.05)
        .paddingOuter(0.1);


    const barG = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

    barG.append('text')
        .text('Salary by sex')
        .attr('fill', 'white')


    barG.append('g')
        .attr('transform', `translate(0, ${innerHeight - margin.bottom})`)
        .call(d3.axisBottom(xScale));

    yAxis = d3.axisLeft(yScale);

    barG.append('g')
        .call(yAxis);

    // good salary male
    barG.append('rect')
        .attr('height', yScale(0) - yScale(stats.salaryGoodMale))
        .attr('width', xScale.bandwidth('Male'))
        .attr('x', xScale('Male'))
        .attr('y', yScale(stats.salaryBadMale) - (yScale(0) - yScale(stats.salaryGoodMale)))
        .style('fill', colors.goodSalary);
    // .on('mouseover', function () {
    //     d3.select(this)
    //         .style('fill', bar_colors.goodSalaryInfo);
    //
    //     barG.append('text')
    //         .text(`${stats.salaryBadMale}`)
    //         .attr('x', xScale('Male'))
    //         .attr('y', yScale(stats.salaryBadMale) - (yScale(0) - yScale(stats.salaryGoodMale)) + 20)
    //         .attr('id', 'bar_info_text');
    //
    // })
    // .on('mouseout', function () {
    //     d3.select(this)
    //         .style('fill', bar_colors.goodSalary);
    //
    //     d3.select('#bar_info_text').remove();
    // });


    // bad salary male
    barG.append('rect')
        .attr('height', yScale(0) - yScale(stats.salaryBadMale))
        .attr('width', xScale.bandwidth('Male'))
        .attr('x', xScale('Male'))
        .attr('y', yScale(stats.salaryBadMale))
        .style('fill', colors.badSalary);


    // bad salary female
    barG.append('rect')
        .attr('height', yScale(0) - yScale(stats.salaryBadFemale))
        .attr('width', xScale.bandwidth('Female'))
        .attr('x', xScale('Female'))
        .attr('y', yScale(stats.salaryBadFemale))
        .style('fill', colors.badSalary);

    // good salary female
    barG.append('rect')
        .attr('height', yScale(0) - yScale(stats.salaryGoodFemale))
        .attr('width', xScale.bandwidth('Female'))
        .attr('x', xScale('Female'))
        .attr('y', yScale(stats.salaryBadFemale) - (yScale(0) - yScale(stats.salaryGoodFemale)))
        .style('fill', colors.goodSalary);

    const legendG = svg.append('g')
        .attr('transform', 'translate(450, 50)')

    legendG.append('text')
        .text('good salary')
        .attr('transform', `translate(20, 0)`)
        .style('font-size', '0.8em')

    legendG.append('text')
        .text('bad salary')
        .attr('transform', `translate(20, 20)`)
        .style('font-size', '0.8em')

    legendG.append('rect')
        .attr('fill', colors.goodSalary)
        .attr('x', 0)
        .attr('y', -9)
        .attr('height', 10)
        .attr('width', 10)
        .style('font-size', '0.8em')

    legendG.append('rect')
        .attr('fill', colors.badSalary)
        .attr('x', 0)
        .attr('y', 11)
        .attr('height', 10)
        .attr('width', 10)
        .style('font-size', '0.8em')
}

function drawEduRace(data) {


    const svg = d3.select('#race_edu_pie_chart_svg');
    const svgHeight = svg.attr('height');
    const svgWidth = svg.attr('width');
    const margin = {top: 80, right: 90, bottom: 10, left: 50};

    const innerHeight = svgHeight - margin.top - margin.bottom;
    const innerWidth = svgWidth - margin.left - margin.right;


    const whiteBlackAngle = 0.2;
    const innerWhiteRadius = 50;
    const innerBlackRadius = 50;
    const outerWhiteRadius = Math.min(innerHeight, innerWidth) / 2 - 10;
    const outerBlackRadius = Math.min(innerHeight, innerWidth) / 2;


    const pieG = svg.append('g')
        .attr('transform', `translate(${margin.left + innerWidth / 2}, ${margin.top + innerHeight / 2})`);


    const partColors = [
        "#FF1F1F",
        "#FF99F5",
        "#FFEC5C",
        "#0EBE86",
        "#E2FFCE",
    ]

    // data preparation
    const whiteEduStats = [
        {level: 0, title: 'dropout', count: 0},
        {level: 1, title: 'school', count: 0},
        {level: 2, title: 'college', count: 0},
        {level: 3, title: 'graduates', count: 0},
        {level: 4, title: 'postgraduates', count: 0},
    ]

    const blackEduStats = [
        {level: 0, title: 'dropout', count: 0},
        {level: 1, title: 'school', count: 0},
        {level: 2, title: 'college', count: 0},
        {level: 3, title: 'graduates', count: 0},
        {level: 4, title: 'postgraduates', count: 0},
    ]

    data.forEach(function (row) {
        if (row.race === 'White') {
            if (1 <= row.education_num && row.education_num <= 3) {
                whiteEduStats[0].count += 1;
            } else if (4 <= row.education_num && row.education_num <= 9) {
                whiteEduStats[1].count += 1;
            } else if (10 <= row.education_num && row.education_num <= 12) {
                whiteEduStats[2].count += 1;
            } else if (13 <= row.education_num && row.education_num <= 14) {
                whiteEduStats[3].count += 1;
            } else {
                whiteEduStats[4].count += 1;
            }
        } else {
            if (1 <= row.education_num && row.education_num <= 3) {
                blackEduStats[0].count += 1;
            } else if (4 <= row.education_num && row.education_num <= 9) {
                blackEduStats[1].count += 1;
            } else if (10 <= row.education_num && row.education_num <= 12) {
                blackEduStats[2].count += 1;
            } else if (13 <= row.education_num && row.education_num <= 14) {
                blackEduStats[3].count += 1;
            } else {
                blackEduStats[4].count += 1;
            }
        }
    });

    const whiteAmount = d3.sum(whiteEduStats, d => d.count);
    const blackAmount = d3.sum(blackEduStats, d => d.count);
    const whitePortion = whiteAmount / (whiteAmount + blackAmount)
    const blackPortion = blackAmount / (whiteAmount + blackAmount)

    // Colors scale
    const color = d3.scaleOrdinal()
        .domain([0, 1, 2, 3, 4])
        .range(partColors)
        .unknown(undefined);

    // pie info
    const pie = d3.pie()
        .value(d => d.count)
        .sort((a, b) => a < b);

    const whitePie = pie
        .startAngle(whiteBlackAngle)
        .endAngle(2 * Math.PI * whitePortion - whiteBlackAngle)(whiteEduStats);

    const blackPie = pie
        .startAngle(2 * Math.PI * whitePortion)
        .endAngle(2 * Math.PI)(blackEduStats);

    pieG.append('rect')

    // plotting pies
    // white
    pieG.selectAll('anything')
        .data(whitePie)
        .enter()
        .append('path')
        .attr('d', d3.arc()
            .innerRadius(innerWhiteRadius)
            .outerRadius(outerWhiteRadius)
        )
        .attr('fill', d => color(d.index))
        .attr('class', 'race_edu_part');

    pieG.selectAll('anything')
        .data(blackPie)
        .enter()
        .append('path')
        .attr('d', d3.arc()
            .innerRadius(innerBlackRadius)
            .outerRadius(outerBlackRadius)
        )
        .attr('fill', d => color(d.index))
        .attr('class', 'race_edu_part');

    // title
    const titleG = svg.append('g')
        .attr('transform', 'translate(60, 30)')
        .append('text')
        .text('Education level by race');

    // legend
    const legendMargin = 20;
    const squareSize = 10;


    const legendG = svg.append('g')
        .attr('transform', `translate(${svgWidth - 170}, 30)`);

    for (let i = 0; i < blackEduStats.length; i++) {
        legendG.append('rect')
            .attr('transform', `translate(${0}, ${i * legendMargin - squareSize})`)
            .attr('height', squareSize)
            .attr('width', squareSize)
            .attr('fill', color(i));

        legendG.append('text')
            .attr('transform', `translate(${squareSize * 2}, ${i * legendMargin})`)
            .style('font-size', '0.9em')
            .text(` - ${blackEduStats[i].title}`)
    }

    const labelWhite = svg.append('g')
        .attr('transform', `translate(400, 350)`)
        .append('text')
        .text('White race')
        .style('font-size', '0.8em');


    const labelBlack = svg.append('g')
        .attr('transform', `translate(90, 130)`)
        .append('text')
        .text('Other race')
        .style('font-size', '0.8em');
}

function drawEduSalary(data) {
    const svg = d3.select('#edu_salary_scatter_svg');
    const svgHeight = svg.attr('height');
    const svgWidth = svg.attr('width');
    const margin = {top: 80, right: 150, bottom: 50, left: 70};

    const innerHeight = svgHeight - margin.top - margin.bottom;
    const innerWidth = svgWidth - margin.left - margin.right;

    // data preprocessing
    const gsEduStats = [
        {level: 0, title: 'dropout', count: 0},
        {level: 1, title: 'school', count: 0},
        {level: 2, title: 'college', count: 0},
        {level: 3, title: 'graduates', count: 0},
        {level: 4, title: 'postgraduates', count: 0},
    ]

    const bsEduStats = [
        {level: 0, title: 'dropout', count: 0},
        {level: 1, title: 'school', count: 0},
        {level: 2, title: 'college', count: 0},
        {level: 3, title: 'graduates', count: 0},
        {level: 4, title: 'postgraduates', count: 0},
    ]

    data.forEach(function (row) {
        if (row.income === '>50K') {
            if (1 <= row.education_num && row.education_num <= 3) {
                gsEduStats[0].count += 1;
            } else if (4 <= row.education_num && row.education_num <= 9) {
                gsEduStats[1].count += 1;
            } else if (10 <= row.education_num && row.education_num <= 12) {
                gsEduStats[2].count += 1;
            } else if (13 <= row.education_num && row.education_num <= 14) {
                gsEduStats[3].count += 1;
            } else {
                gsEduStats[4].count += 1;
            }
        } else {
            if (1 <= row.education_num && row.education_num <= 3) {
                bsEduStats[0].count += 1;
            } else if (4 <= row.education_num && row.education_num <= 9) {
                bsEduStats[1].count += 1;
            } else if (10 <= row.education_num && row.education_num <= 12) {
                bsEduStats[2].count += 1;
            } else if (13 <= row.education_num && row.education_num <= 14) {
                bsEduStats[3].count += 1;
            } else {
                bsEduStats[4].count += 1;
            }
        }
    });

    const gsPortionArray = [];
    const bsPortionArray = [];

    for (let i = 0; i < gsEduStats.length; i++) {
        const eduCount = gsEduStats[i].count + bsEduStats[i].count;
        const gsPortion = gsEduStats[i].count / eduCount;
        const bsPortion = bsEduStats[i].count / eduCount;

        gsPortionArray.push(gsPortion);
        bsPortionArray.push(bsPortion);
    }

    const grafG = svg.append('g')
        .attr('transform', `translate( ${margin.left}, ${margin.top})`);

    const xScale = d3.scaleLinear()
        .domain([0, 4])
        .rangeRound([0, innerWidth]);

    grafG.append('g')
        .attr('transform', `translate( ${0}, ${innerHeight})`)
        .call(d3.axisBottom(xScale)
            .ticks(5)
            .tickFormat(d => gsEduStats[d].title));

    const yScale = d3.scaleLinear()
        .domain([0, 1])
        .range([innerHeight, 0])

    grafG.append('g')
        .attr('transform', `translate( ${0}, ${0})`)
        .call(d3.axisLeft(yScale));

    grafG.append('path')
        .datum(gsPortionArray)
        .attr('fill', 'none')
        .attr('stroke', colors.goodSalary)
        .attr("d", d3.line()
            .x((d, i) => xScale(i))
            .y(d => yScale(d))
        );

    grafG.append('path')
        .datum(bsPortionArray)
        .attr('fill', 'none')
        .attr('stroke', colors.badSalary)
        .attr('stroke-width', 2)
        .attr("d", d3.line()
            .x((d, i) => xScale(i))
            .y(d => yScale(d))
        );


    for (let i = 0; i < gsPortionArray.length; i++) {
        grafG.append('rect')
            .attr('x', xScale(i) - 10 / 2)
            .attr('y', yScale(gsPortionArray[i]) - 10 / 2)
            .attr('height', 10)
            .attr('width', 10)
            .attr('fill', colors.goodSalary)

        grafG.append('rect')
            .attr('x', xScale(i) - 10 / 2)
            .attr('y', yScale(bsPortionArray[i]) - 10 / 2)
            .attr('height', 10)
            .attr('width', 10)
            .attr('fill', colors.badSalary)
    }

    const legendG = svg.append('g')
        .attr('transform', 'translate(450, 50)')

    legendG.append('text')
        .text('good salary')
        .attr('transform', `translate(20, 0)`)
        .style('font-size', '0.8em')

    legendG.append('text')
        .text('bad salary')
        .attr('transform', `translate(20, 20)`)
        .style('font-size', '0.8em')

    legendG.append('rect')
        .attr('fill', colors.goodSalary)
        .attr('x', 0)
        .attr('y', -9)
        .attr('height', 10)
        .attr('width', 10)
        .style('font-size', '0.8em')

    legendG.append('rect')
        .attr('fill', colors.badSalary)
        .attr('x', 0)
        .attr('y', 11)
        .attr('height', 10)
        .attr('width', 10)
        .style('font-size', '0.8em')

    const titleG = svg.append('g')
        .attr('transform', `translate(60, 30)`)
        .append('text')
        .text('Salary portion by education level')
}

function drawAgeGsDist(data) {

    // Function to compute density
    function kernelDensityEstimator(kernel, X) {
        return function (V) {
            return X.map(function (x) {
                return [x, d3.mean(V, function (v) {
                    return kernel(x - v);
                })];
            });
        };
    }

    function kernelEpanechnikov(k) {
        return function (v) {
            return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
        };
    }


    const svg = d3.select('#age_gs_dist_svg');
    const svgHeight = svg.attr('height');
    const svgWidth = svg.attr('width');
    const margin = {top: 80, right: 150, bottom: 50, left: 70};

    const innerHeight = svgHeight - margin.top - margin.bottom;
    const innerWidth = svgWidth - margin.left - margin.right;

    // data preprocessing

    const agesGs = [];
    const agesBs = [];

    data.forEach(d => {
        if (d.income === '>50K') {
            agesGs.push(+d.age);
        } else {
            agesBs.push(+d.age);
        }
    })

    const graphG = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const yScale = d3.scaleLinear()
        .domain([0, 0.04])
        .range([svgHeight - margin.top - margin.bottom, 0]);

    const yAxis = graphG.append('g')
        .call(d3.axisLeft(yScale));

    const xScale = d3.scaleLinear()
        .domain([0, 100])
        .range([0, svgWidth - margin.left - margin.right]);

    const xAxis = graphG.append('g')
        .call(d3.axisBottom(xScale))
        .attr('transform', `translate(0, ${svgHeight - margin.top - margin.bottom})`);

    const kde = kernelDensityEstimator(kernelEpanechnikov(5), xScale.ticks(40));

    const densityGs = kde(agesGs.map(d => d));
    const densityBs = kde(agesBs.map(d => d));


    graphG.append("path")
        .attr("class", "mypath")
        .datum(densityGs)
        .attr("fill", colors.goodSalary)
        .attr("opacity", ".8")
        .attr("stroke", "#FFF")
        .attr("stroke-width", 2)
        .attr("stroke-linejoin", "round")
        .attr("d", d3.line()
            .curve(d3.curveBasis)
            .x(d => xScale(d[0]))
            .y(d => yScale(d[1]))
        );

    graphG.append("path")
        .attr("class", "mypath")
        .datum(densityBs)
        .attr("fill", colors.badSalary)
        .attr("opacity", ".8")
        .attr("stroke", "#FFF")
        .attr("stroke-width", 2)
        .attr("stroke-linejoin", "round")
        .attr("d", d3.line()
            .curve(d3.curveBasis)
            .x(d => xScale(d[0]))
            .y(d => yScale(d[1]))
        );

    const title = svg.append('text')
        .text('Salary density by age')
        .attr('x', '70')
        .attr('y', '30')

    const legendG = svg.append('g')
        .attr('transform', 'translate(450, 50)')

    legendG.append('text')
        .text('good salary')
        .attr('transform', `translate(20, 0)`)
        .style('font-size', '0.8em')

    legendG.append('text')
        .text('bad salary')
        .attr('transform', `translate(20, 20)`)
        .style('font-size', '0.8em')

    legendG.append('rect')
        .attr('fill', colors.goodSalary)
        .attr('x', 0)
        .attr('y', -9)
        .attr('height', 10)
        .attr('width', 10)
        .style('font-size', '0.8em')

    legendG.append('rect')
        .attr('fill', colors.badSalary)
        .attr('x', 0)
        .attr('y', 11)
        .attr('height', 10)
        .attr('width', 10)
        .style('font-size', '0.8em')
}

function drawOccupationSalaryBubble(data) {

    const occupationStats = [];

    data.forEach(function (d) {
        if (d.occupation !== '?') {
            let occupationStatsIndex = -1;
            for (let i = 0; i < occupationStats.length; i++) {
                if (occupationStats[i].occupation === d.occupation) {
                    occupationStatsIndex = i;
                }
            }
            if (occupationStatsIndex === -1) {
                occupationStats.push({occupation: d.occupation, count: 0, goodSalaryCount: 0});
                occupationStatsIndex = occupationStats.length - 1;
            }

            occupationStats[occupationStatsIndex].count++;
            if (d.income === '>50K') {
                occupationStats[occupationStatsIndex].goodSalaryCount++;
            }
        }
    });


    const goodSalaryMax = d3.max(occupationStats, d => d.goodSalaryCount);
    const countMax = d3.max(occupationStats, d => d.count);
    const proportionMax = d3.max(occupationStats, d => d.goodSalaryCount / d.count);


    const svg = d3.select('#occupation_gs_bubble_svg');
    const svgHeight = svg.attr('height');
    const svgWidth = svg.attr('width');
    const margin = {top: 80, right: 30, bottom: 50, left: 80};
    const minCircleRadius = 2;
    const maxCircleRadius = 10;

    const innerHeight = svgHeight - margin.top - margin.bottom;
    const innerWidth = svgWidth - margin.left - margin.right;

    const graphG = svg.append('g')
        .attr('transform', `translate( ${margin.left}, ${margin.top})`);

    const radiusScale = d3.scaleLinear()
        .domain([0, proportionMax])
        .range([minCircleRadius, maxCircleRadius]);

    const yScale = d3.scaleLinear()
        .domain([0, goodSalaryMax])
        .range([innerHeight, 0]);

    const yAxis = graphG.append('g')
        .call(d3.axisLeft(yScale));

    const xScale = d3.scaleLinear()
        .domain([0, countMax])
        .range([0, innerWidth]);

    const xAxis = graphG.append('g')
        .call(d3.axisBottom(xScale))
        .attr('transform', `translate(0, ${innerHeight})`);


    graphG.selectAll('anything')
        .data(occupationStats)
        .enter()
        .append('circle')
        .attr('cx', d => xScale(d.count))
        .attr('cy', d => yScale(d.goodSalaryCount))
        .attr('r', d => radiusScale(d.goodSalaryCount / d.count))
        .attr('fill', colors.goodSalary)
        .attr('stroke', 'white')
        .attr('opacity', '0.8')
        .attr('stroke-width', 2);

    svg.append('text')
        .text('people, having good salary')
        .attr('transform', `translate(${margin.left - 50}, ${margin.top + innerHeight - 40}), rotate(-90)`)
        .style('font-size', '0.8em');

    svg.append('text')
        .text('people of occupation')
        .attr('transform', `translate(${margin.left + innerWidth / 2 - 100}, ${margin.top + innerHeight + 40})`)
        .style('font-size', '0.8em');

    svg.append('text')
        .text('Good salary portion by concurrence')
        .attr('transform', `translate(60, 30)`);


    console.log(radiusScale(0.1));
    console.log([1,2,3].map(a => 1))

}
