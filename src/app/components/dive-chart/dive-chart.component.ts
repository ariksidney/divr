import { Component, NgZone, OnDestroy, Input, AfterViewInit } from '@angular/core';
import * as am4charts from '@amcharts/amcharts4/charts';

@Component({
  selector: 'app-dive-chart',
  templateUrl: './dive-chart.component.html',
  styleUrls: ['./dive-chart.component.scss']
})
export class DiveChartComponent implements AfterViewInit, OnDestroy {

  private chart: am4charts.XYChart;

  @Input()
  private data: [];

  constructor(private zone: NgZone) { }

  ngAfterViewInit() {

    this.zone.runOutsideAngular(() => {
      Promise.all([
        import("@amcharts/amcharts4/core"),
        import("@amcharts/amcharts4/charts"),
        import("@amcharts/amcharts4/themes/animated"),
        import('@amcharts/amcharts4/themes/dark')
      ]).then((modules) => {
        const am4core = modules[0];
        const am4charts = modules[1];
        const am4themes_animated = modules[2].default;
        const am4themes_dark = modules[3].default;

        am4core.useTheme(am4themes_animated);
        am4core.useTheme(am4themes_dark);

        const chart = am4core.create('chartdiv', am4charts.XYChart);
        chart.logo.disabled = true;
        chart.paddingRight = 0;
        chart.paddingLeft = 0;
        chart.marginLeft = 0;
        chart.marginRight = 0
        chart.data = this.data;

        const xAxis = chart.xAxes.push(new am4charts.DurationAxis());
        xAxis.baseUnit = "second";
        xAxis.strictMinMax = true;
        xAxis.title.text = 'Duration';
        xAxis.endLocation = 0.5;

        const yAxis = chart.yAxes.push(new am4charts.ValueAxis());
        yAxis.renderer.inversed = true;
        yAxis.renderer.paddingLeft = -10;
        yAxis.renderer.labels.template.adapter.add("text", function (text) {
          return text + "m";
        });

        const diveSeries = chart.series.push(new am4charts.LineSeries());
        diveSeries.dataFields.valueY = 'value';
        diveSeries.dataFields.valueX = 'duration';
        diveSeries.name = 'Depth';
        diveSeries.strokeWidth = 2;
        diveSeries.minBulletDistance = 10;
        diveSeries.bullets.push(new am4charts.CircleBullet());
        diveSeries.tooltipText = '{name}: {valueY}m';
        diveSeries.legendSettings.valueText = '{valueY}m';
        diveSeries.fill = am4core.color("#1f8ef1");
        diveSeries.fillOpacity = 0.4;

        const fillModifier = new am4core.LinearGradientModifier();
        fillModifier.opacities = [1, 0];
        fillModifier.offsets = [0, 1];
        fillModifier.gradient.rotation = 90;

        chart.seriesContainer.background.fillModifier = fillModifier;

        chart.cursor = new am4charts.XYCursor();
        chart.cursor.xAxis = xAxis;
        chart.cursor.snapToSeries = diveSeries;

        const scrollbarX = new am4charts.XYChartScrollbar();
        scrollbarX.series.push(diveSeries);
        chart.scrollbarX = scrollbarX;
        chart.scrollbarX.parent = chart.bottomAxesContainer;

        chart.legend = new am4charts.Legend();
        this.chart = chart;
      }).catch((e) => {
        console.error("Error when creating chart", e);
      })
    });
  }

  ngOnDestroy(): void {
    this.zone.runOutsideAngular(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });
  }
}
