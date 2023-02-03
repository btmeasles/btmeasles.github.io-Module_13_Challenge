function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstName = sampleNames[0];
    buildCharts(firstName);
    buildMetadata(firstName);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
   
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    PANEL.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Deliverable 1: 1. Create the buildChart function.
function buildCharts(sample) {
  // Deliverable 1: 2. Use d3.json to load the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data);
    // Deliverable 1: 3. Create a variable that holds the samples array. 
    var samples = data.samples
    // Deliverable 1: 4. Create a variable that filters the samples for the object with the desired sample number.
    var sampleArray = samples.filter(sampleObj => sampleObj.id == sample)
    // Deliverable 3: 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var sampleResult = sampleArray[0]
    // Deliverable 1: 5. Create a variable that holds the first sample in the array.
    var firstSample = samples[0]
    // Deliverable 3: 2. Create a variable that holds the first sample in the metadata array.
    var firstMetadata = data.metadata[0]
    // Deliverable 1: 6. Create variables that hold the otu_ids, otu_labels, and sample_values.   
    var otuIds = sampleResult.otu_ids
    var otuLables = sampleResult.otu_labels
    var otuSampleValues = sampleResult.sample_values
    // Deliverable 1: 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order 
    // so the otu_ids with the most bacteria are last. 
    var xticks = otuSampleValues.sort((a,b) => b-a).slice(0,10).reverse()
    console.log(xticks)
    var yticks = otuIds.slice(0,10).reverse().map(otuIds => `OTU ${otuIds}`)
    console.log(yticks)
    var barText = otuLables.slice(0,10).reverse()
    // var ytickLabels = yticks.forEach()
    // console.log(ytickLabels)
    // var yticks = otuIds.sort((a,b) => a.otuIds - b.otuIds).slice(0,10).reverse()
    // console.log(yticks)
    // Deliverable 1: 8. Create the trace for the bar chart. 
    var barData = [{
      x: xticks,
      y: yticks,
      type: 'bar',
      marker: {
        color: 'rgba(44, 173, 138, 0.8)',
        width: 3
      },
      orientation: 'h',
      text: barText
    }];

    // Deliverable 1: 9. Create the layout for the bar chart. 
    var barLayout = {
      title:"Top 10 Bacterial Cultures Found",
      xaxis: {title: "# of Samples"},
      yaxis: { title: "Bacterial ID"},
      paper_bgcolor: "aliceblue",
      font: {color: "darkblue"}
    }
    // Deliverable 1: 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot('bar', barData, barLayout);
    // Deliverable 2: 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x:otuIds,
      y:otuSampleValues,
      mode: 'markers',
      text: otuLables,
      marker: {
        color: otuIds,
        size: otuSampleValues,
        colorscale: [
          ['0.0', 'rgb(165,0,38)'],
          ['0.111111111111', 'rgb(215,48,39)'],
          ['0.222222222222', 'rgb(244,109,67)'],
          ['0.333333333333', 'rgb(253,174,97)'],
          ['0.444444444444', 'rgb(254,224,144)'],
          ['0.555555555556', 'rgb(224,243,248)'],
          ['0.666666666667', 'rgb(171,217,233)'],
          ['0.777777777778', 'rgb(116,173,209)'],
          ['0.888888888889', 'rgb(69,117,180)'],
          ['1.0', 'rgb(49,54,149)']
        ]
      }
    }]
    // Deliverable 2: 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {
        title: "OTU ID"
      },
      margin: {
        l: 75,
        r: 75,
        t: 50,
        b: 50
      },
      paper_bgcolor: "aliceblue",
      font: {color: "darkblue"}
    }
    // Deliverable 2: 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout)
    // Deliverable 3: 3. Create a variable that holds the washing frequency.
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0]
    var washFreq = result.wfreq;
    // Deliverable 3: 4. Create the trace for the gauge chart.
    var gaugeData = [{
      domain: {x:[0,1],y:[0,1]},
      value: washFreq,
      title: {text: 
        `<em>Belly Button Washing Frequency</em><br>Scrubs per Week`},
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: {range: [null, 10], tickwidth:5, tickcolor:'black'},
        bar: { color: "whitesmoke" },
        bgcolor: "white",
        borderwidth: 2,
        bordercolor: "gray",
        steps: [
          {range: [0,2], color: "navy"},
          {range: [2,4], color: "mediumblue"},
          {range: [4,6], color: "blue"},
          {range: [6,8], color: "cornflowerblue"},
          {range: [8,10], color: "lightsteelblue"}
      ]},

    }]
    // Deliverable 3: 5. Create the layout for the gauge chart.
    var gaugeLayout = {
      width: 460,
      height: 450,
      margin: { t: 50, r: 50, l: 50, b: 50 },
      paper_bgcolor: "aliceblue",
      font: {color: "darkblue"}
    };
    // Deliverable 3: 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout)
  });
}
