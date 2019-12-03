/**
 * /**
 * --------------------------------------------------------
 * This demo was created using amCharts V4 preview release.
 *
 * V4 is the latest installement in amCharts data viz
 * library family, to be released in the first half of
 * 2018.
 *
 * For more information and documentation visit:
 * https://www.amcharts.com/docs/v4/
 * --------------------------------------------------------
 */

// Themes begin
    am4core.useTheme(am4themes_animated);
// Themes end

// Create chart instance
    var chart = am4core.create("chartdiv", am4charts.XYChart);

/* Load external data json */
    chart.dataSource.url = "./datasets/ufo_all_freq_by_country.json";
    chart.dataSource.parser = new am4core.JSONParser();
    chart.dataSource.parser.options.emptyAs = 0;


/* Create axes */
    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "country";
    categoryAxis.renderer.minGridDistance = 30;
    categoryAxis.title.text = "Countries";


/* Create value axis */
    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = "Number of observations";


/* Create series */
    var columnSeries = chart.series.push(new am4charts.ColumnSeries());
    columnSeries.name = "Number of observations";

    columnSeries.dataFields.valueY = "observation";
    columnSeries.dataFields.categoryX = "country";

    columnSeries.columns.template.tooltipText = "[#fff font-size: 15px]{name} in {categoryX}:\n[/][#fff font-size: 20px]{valueY}[/] [#fff]{additional}[/]"
    columnSeries.columns.template.propertyFields.fillOpacity = "fillOpacity";
    columnSeries.columns.template.propertyFields.stroke = "stroke";
    columnSeries.columns.template.propertyFields.strokeWidth = "strokeWidth";
    columnSeries.columns.template.propertyFields.strokeDasharray = "columnDash";
    columnSeries.tooltip.label.textAlign = "middle";

/* Color */
    chart.colors.list = [
        am4core.color("#845EC2"),
        am4core.color("#845EC2"),
        am4core.color("#845EC2"),
        am4core.color("#845EC2"),
        am4core.color("#845EC2"),
        am4core.color("#ff0000")
    ];

//as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
    columnSeries.columns.template.adapter.add("fill", function (fill, target) {
        return chart.colors.getIndex(target.dataItem.index);
    });


// Add legend
    //chart.legend = new am4charts.Legend();

// Add cursor
    //chart.cursor = new am4charts.XYCursor();

// Add simple vertical scrollbar
    //chart.scrollbarY = new am4core.Scrollbar();

// Add horizotal scrollbar with preview
    //var scrollbarX = new am4charts.XYChartScrollbar();
    //scrollbarX.series.push(series);
    //chart.scrollbarX = scrollbarX;

/* Attach the data to the configuration */
    chart.data = chart ;
