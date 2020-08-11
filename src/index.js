const colors = {
    badSalary: '#a91010',
    goodSalary: '#49ab20',

}

let rawData;


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
});

function drawSexSalary(data) {
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



    console.log(`innerHeight: ${innerHeight}`)
    console.log(`gsf scale: ${yScale(stats.salaryGoodFemale)}`)
    console.log(`gsf stat: ${stats.salaryGoodFemale}`)

    console.log(`bsf scale: ${yScale(stats.salaryBadFemale)}`)
    console.log(`bsf stat: ${stats.salaryBadFemale}`)

    console.log(stats.salaryBadFemale - stats.salaryGoodFemale)


}