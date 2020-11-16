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
      var firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
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
      console.log(metadata);
  
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
  // 1. Create the buildCharts function.
  function buildCharts(sample) {
    // 2. Use d3.json to load and retrieve the samples.json file 
      d3.json("samples.json").then((data) => {
      // 3. Create a variable that holds the samples array. 
      var dataArray = data.samples;
    
      // 4. Create a variable that filters the samples for the object with the desired sample number.
      var filterArray = dataArray.filter(sampleObj => sampleObj.id == sample);
      //console.log(filterArray);
  
      // 1. Create a variable that filters the metadata array for the object with the desired sample number.
      //d3.json("samples.json").then((data) => {
       // var metadata = metadata;
        var resultArray = data.metadata.filter(sampleObj => sampleObj.id == sample);
  
      //  5. Create a variable that holds the first sample in the array.
      var samples = filterArray[0];
      console.log(samples);
      
      // 2. Create a variable that holds the first sample in the metadata array.
      var result = resultArray[0];
      console.log(result);
      // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
     
      var otu_ids = samples.otu_ids;
      //console.log(otu_ids);
      var otu_labels = samples.otu_labels;
      //console.log(otu_labels);
      var sample_values = samples.sample_values;
  
      // 3. Create a variable that holds the washing frequency.
       var  wash_freq = parseFloat(result.wfreq);
  
      //var wash_freq = metadata.filter(sampleObj => sampleObj.id == sample);
  
      // 7. Create the yticks for the bar chart.
      // Hint: Get the the top 10 otu_ids and map them in descending order  
      //  so the otu_ids with the most bacteria are last. 
  
      //var yticks = otu_ids.slice(0,10).reverse();
      var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
      console.log(yticks);
      // 8. Create the trace for the bar chart. 
     var barData = [{
       x : sample_values.slice(0,10).reverse(),
       y : yticks,
       text: otu_labels.slice(0,10).reverse(),
       orientation:'h',
       type:'bar'
     }];
      // 9. Create the layout for the bar chart. 
      var barLayout = {
      title : "Top 10 Bacteria Cultures Found",
      margin: {t:40,l:160}
      };
   
      // 10. Use Plotly to plot the data with the layout. 
     Plotly.newPlot('bar', barData, barLayout );
   
      // Use Plotly to plot the data with the layout. 
  
      // 1. Create the trace for the bubble chart.
      var bubbleData = [{
        x : otu_ids,
        y : sample_values,
        mode: 'markers',
        text: otu_labels,
        marker: {
        size: sample_values,
        color: otu_ids 
        }
        
  
      }];
  
      // 2. Create the layout for the bubble chart.
      var bubbleLayout = {
        title : "Bacteria Cultures Per Sample",
        xlabel : "OTU_ID",
        hovermode:"closest",
        margins: {t:80,l:200},
        //text: otu_labels,
        height: 600,
        width: 1000
      };
  
      // 3. Use Plotly to plot the data with the layout.
      Plotly.newPlot('bubble', bubbleData, bubbleLayout );
      // D2: 3. Use Plotly to plot the data with the layout.
     
      
      // 4. Create the trace for the gauge chart.
      var gaugeData = [{
        
        domain: {x:[0,1], y:[0,1]},
        value: wash_freq,
        title: { text: "Belly Button Washing Frequency<span style='font-size:0.8em'><br>Scrubs per Week" },
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: {range: [null,10]},
          bar: {color: "black"},
          steps: [
            {range:[0,2], color: "red"},
            {range:[2,4], color: "orange"},
            {range:[4,6], color: "yellow"},
            {range:[6,8], color: "yellowgreen"},
            {range:[8,10], color: "green"}
          ],
        }
      } ];
      
      // 5. Create the layout for the gauge chart.
      var gaugeLayout = { 
        width: 600, height: 400, margin: { t: 100, b: 20 }
      };
  
      // 6. Use Plotly to plot the gauge data and layout.
      Plotly.newPlot("gauge", gaugeData, gaugeLayout );
    });
  }
  
  