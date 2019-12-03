/* PRE : nombreDonnee est un string valant "500", "3000" ou "all"
    * POST : renvoie les fréquences par annees du dataset correspondant
    * 		  sous forme d'un dictionnaire dont les cles sont :
    *		 - milieuAnnee = format date representant le milieu d'une annee 
    *			qui est toujours/fixe a 30 juin de l'annee
    *			par exemple, 1937-06-30T23:00:00.000Z 
    *		 - nbreObserv = le nombre d'observations notees durant l'annee	
    * VERS : utilisation des fichiers csv
    */
function getFreqApparition_and_drawLineChart(){
    
    var dates = Array();
    var entries = Array();

    d3.csv("datasets/ufo_all_freq_by_year_youri.csv", function(data){
    
        console.log(data); // regarder si data bien charges
                    
        for(var i = 0; i < data.length; i++){
            dates.push(new Date(parseInt(data[i].year), 5, 31, 0, 0, 0, 0));
            entries.push({milieuAnnee : dates[i], nbreObserv : parseInt(data[i].freq)});
        }
        
        drawLineChart(entries); 
    });
};


/* PRE : nombreDonnee est un string valant "500", "3000" ou "all"
    * POST : renvoie les fréquences par annees du dataset correspondant
    * 		  sous forme d'un dictionnaire dont les cles sont :
    *		 - milieuAnnee = format date representant le milieu d'une annee 
    *			qui est toujours/fixe a 30 juin de l'annee
    *			par exemple, 1937-06-30T23:00:00.000Z 
    *		 - nbreObserv = le nombre d'observations notees durant l'annee	
    * VERS : en utilisant le json -> fonctionne pas
    */
function getFreqApparition_and_drawLineChart_json(){
    
    var dates = Array();
    var entries = Array();

    d3.json("datasets/ufo_all_freq_by_year.json", function(data){
    
        console.log(data); // regarder si data bien charges

        'use strict';
        
        for (const [key, value] of data.entries(data)) {
            console.log(key, value);
            dates.push(new Date(parseInt(key), 5, 31, 0, 0, 0, 0));
            entries.push({milieuAnnee : dates[i], nbreObserv : value});
        }
        
        drawLineChart(entries); 
    });
};


/* PRE : data est un dictionnaire comportant les cles : 
    * 		 - milieuAnnee = format date representant le milieu d'une annee 
    *			qui est toujours/fixe a 30 juin de l'annee
    *			par exemple, 1937-06-30T23:00:00.000Z 
    *		 - nbreObserv = le nombre d'observations notees durant l'annee
    * POST : linechart est affiche
    * SOURCE : exemple "linechart.html" vu en TP
    */
function drawLineChart(data) {

    console.log(data); // regarder si les dates sont bien chargees

    // The inside of the element that has the id linechart is removed. Basically, if their was any element inside the linechart svg, they are scrapped off
    // This allows to remove the previous line chart if the function is called with a different dataset

    document.getElementById("linechart").innerHTML = "";

    // The margins are defined. A bigger margin is defined for the bottom and the left because space needs to be saved for the axis labels

    var margin = {top: 20, right: 20, bottom: 70, left: 60};

    // The width and height variables are declared using the dimensions of the linechart svg, but margins are substracted
    // document.getElementById("linechart").getBoundingClientRect() returns the bounding box of the linechart element

    var width = document.getElementById("linechart").getBoundingClientRect().width - margin.left - margin.right;
    var height = document.getElementById("linechart").getBoundingClientRect().height - margin.top - margin.bottom;

    // x is the scale on which the data will be represented on the horizontal axis. The scale is time, as the data for the x axis is a list of dates

    var x = d3.time.scale()
        .range([0, width]);   // The allocated space for the line goes from the start to the end of the x axis. This defines the range of the scale

    // The domain of the x axis is defined. It consists of the time span covered by the dates in the dataset

    x.domain(d3.extent(data, function(d){   // This returns the time span covered by the dates in the dataset. This is the domain of the scale
        return d.milieuAnnee;
    }));
    
    console.log(x.domain);

    // y is the scale on which the data will be represented on the vertical axis. The scale is linear, as the data for the y axis is numbers

    var y = d3.scale.linear()
        .range([height, 0]);   // The allocated space for the line goes from the start to the end of the y axis. This defines the range of the scale

    // The domain of the y axis is defined. It goes from 0 to the greatest number of nbreObserv for a given date in the dataset

    y.domain([0, d3.max(data, function(d){   // This returns the maximum (d3.max) number encountered after keeping only the number of nbreObserv from the dataset. This defines the domain of the scale
        return d.nbreObserv;
    })]);
    
    console.log(y.domain);

    // xAxis is the horizontal axis

    var xAxis = d3.svg.axis()
        .scale(x)   // The scale x defined earlier is assigned to the axis
        .orient("bottom");   // the labels of the axis ticks are shown on the bottom of the axis 

    // yAxis is the vertical axis

    var yAxis = d3.svg.axis()
        .scale(y)   // The scale y defined earlier is assigned to the axis
        .orient("left");   // the labels of the axis ticks are shown on the left of the axis
    

    // chart is a <g> element that is appended to the linechart svg declared in the HTML code
    // A <g> element is a group of elements such as circles, rectangles, lines, etc. If an operation needs to be executed on all the elements of a group, it can simply be executed on the g element instead. This is the advantage of g elements

    var chart = d3.select("#linechart")
        .append("g")   // A g element is appended to the linechart svg. It will contain all the graphical elements of the visualization
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");   // The g element is moved right by margin.left pixels and down by margin.top pixels
    
    // A g element is appended to the chart. It contains all the graphical elements of the x axis.

    chart.append("g")
            .attr("class", "x axis")   // The classes x and axis are assigned to the g element. Thus, the g element has the styles defined for x and axis classes in the CSS code
            .attr("transform", "translate(0," + height + ")")   // The origin of the line chart is at the bottom left, but the origin of a SVG element is its top left corner. Thus, the x axis needs to be moved down by height pixels in order to appear at the bottom of the chart
            .call(xAxis);   // Define that it is the x axis in the g element

    // A g element is appended to the chart. It contains all the graphical elements of the y axis.

    chart.append("g")
            .attr("class", "y axis")   // The classes y and axis are assigned to the g element. Thus, the g element has the styles defined for y and axis classes in the CSS code
            .call(yAxis);   // Define that it is the y axis in the g element

    // line is a function that infers a path from data

    var line = d3.svg.line()
        .x(function(d){   // Accessor for x coordinates
            return x(d.milieuAnnee);
        })
        .y(function(d){   // Accessor for y coordinates
            return y(d.nbreObserv);
        });

    // The visual element corresponding to the line in the chart is a path

    chart.append("path")
        .attr("d", line(data))   // The d attribute of a path defines the points through which is goes. These are defined by the path inference function line
        .attr("fill", "none")   // Coloration inside the polygon drawn by the path
        .attr("stroke", "red")   // Color of the path
        .style("stroke-width", "5px");   // Thickness of the path
    
    // A text element is appended to the chart. It contains the label of the x axis

    chart.append("text")						 
        .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 30) + ")")   // The label is translated rightwards by half the width of the chart (thus, it will appear at the middle)
        .style("text-anchor", "middle")   // The label is at the middle (without this line, it would be the origin of the text element that would be at the middle of the chart. The label would not be exactly centered)
        .text("Years");   // Label

    // A text element is appended to the chart. It contains the label of the y axis

    chart.append("text")
        .attr("transform", "rotate(-90)")   // The label is rotated by -90 degrees in order to be written along the y axis
        .attr("y", 0 - margin.left)   // The element was rotated by -90 degrees -> attention to the coordinates to translate
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")   
        .style("text-anchor", "middle")   // The label is at the middle (without this line, it would be the origin of the text element that would be at the middle of the chart. The label would not be exactly centered)
        .text("Spotted UFOs");   // Label

};


getFreqApparition_and_drawLineChart();