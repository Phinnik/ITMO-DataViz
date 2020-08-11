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
    rawData = data;
    drawSexSalary(data);
    drawEduRace(data);
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
    const outerBlackRadius = Math.min(innerHeight, innerWidth) / 2 ;




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

    for (let i = 0; i < blackEduStats.length; i ++) {
        legendG.append('rect')
            .attr('transform', `translate(${0}, ${i * legendMargin - squareSize})`)
            .attr('height', squareSize)
            .attr('width', squareSize)
            .attr('fill', color(i));

        legendG.append('text')
            .attr('transform', `translate(${squareSize*2}, ${i * legendMargin})`)
            .style('font-size', '0.9em')
            .text(` - ${blackEduStats[i].title}`)
    }

    const labelWhite = svg.append('g')
        .attr('transform', `translate(400, 350)`)
        .append('text')
        .text('White race')
        .style('font-size', '0.8em');

    console.log(whiteAmount);

    const labelBlack = svg.append('g')
        .attr('transform', `translate(90, 130)`)
        .append('text')
        .text('Other race')
        .style('font-size', '0.8em');

    console.log(blackAmount);

    console.log(whitePie);
    console.log(blackPie);

    console.log(whitePortion);
    console.log(blackPortion);
    console.log(blackPortion + whitePortion);

    console.log(legendG);

    // a = colorScaleWhite;
}