import * as d3 from 'd3';
import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  public map: L.map;

  constructor() { }


  ngOnInit() {

    this.map = L.map('map', {
      center: [36.8282, -95.5795],
      zoom: 4
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);

    //    var marker = L.marker([51.5, -0.09]).addTo(this.map);
    //    marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
    const svg = d3.select(this.map.getPanes().overlayPane).append('svg');
    const g = svg.append('g').attr('class', 'leaflet-zoom-hide');

    const that = this;
    d3.json('assets/us-states.json')

      .then((collection) => {
        const transform = d3.geoTransform({ point: projectPoint });
        const path = d3.geoPath().projection(transform);

        const feature = g.selectAll('path')
          .data(collection.features)
          .enter().append('path');

        this.map.on('viewreset', reset);
        reset();

        // Reposition the SVG to cover the features.
        function reset() {
          const bounds = path.bounds(collection),
            topLeft = bounds[0],
            bottomRight = bounds[1];

          svg.attr('width', bottomRight[0] - topLeft[0])
            .attr('height', bottomRight[1] - topLeft[1])
            .style('left', topLeft[0] + 'px')
            .style('top', topLeft[1] + 'px');

          g.attr('transform', 'translate(' + -topLeft[0] + ',' + -topLeft[1] + ')');

          feature.attr('d', path);
        }

        // Use Leaflet to implement a D3 geometric transformation.
        function projectPoint(x, y) {
          const point = that.map.latLngToLayerPoint(new L.LatLng(y, x));
          console.log(this)
          this.stream.point(point.x, point.y);
        }
      })
      .catch((error) => {
        if (error) { throw error; }
      });

  }
}
