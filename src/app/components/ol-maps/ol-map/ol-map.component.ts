import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DOCUMENT, isPlatformBrowser,isPlatformServer } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';


// import 'ol/ol.css';
import Map from 'ol/Map';
import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';

import {
  defaults as defaultControls,
  Control
} from 'ol/control';

export const DEFAULT_HEIGHT = '500px';
export const DEFAULT_WIDTH = '500px';

import * as Proj from 'ol/proj';



export const DEFAULT_LAT = -34.603490361131385;
export const DEFAULT_LON = -58.382037891217465;

export const DEFAULT_MARKERS = [{lat: DEFAULT_LAT, lon: DEFAULT_LON}];


import VectorLayer from 'ol/layer/Vector';
import { StoresService } from 'src/app/services/stores/stores.service';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-ol-map',
  templateUrl: './ol-map.component.html',
  styleUrls: ['./ol-map.component.css']
})
export class OlMapComponent implements AfterViewInit {
  @Input() lat: number = DEFAULT_LAT;
  @Input() lon: number = DEFAULT_LON;
  @Input() markers: any[] = DEFAULT_MARKERS;
  @Input() zoom: number;
  @Input() width: string | number = DEFAULT_WIDTH;
  @Input() height: string | number = DEFAULT_HEIGHT;

  @Output() centroMap =  new EventEmitter<any>();
  target: string = 'map-' + Math.random().toString(36).substring(2);

  map: Map;

  selectPointerMove: any;

  marker: any;
  iconMarker:string = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAMAAAC7IEhfAAAAyVBMVEUAAADnTDznTDvnTDvnTDvAOCrnTDznSzvnTDvAOCvnTDznTDznTDvnTDzAOCrnTDvnTDvnTDvnTDznTDvAOSrnTDznTDzTQjLSQjPnTDzpTDvnSzvAOCrnTDvAOSvAOCvnSzvnTDzAOCvnSzznTDznTDvnTDy/OCvnTDznTDvnTDznSzvmSzvAOCvnTDzAOCvnTDvmTDvAOCq+OCrpTDzkSzrbRjbWRDTMPi+8NinrTT3EOy3gSDjTQjPPQDLHPS/DOiu5NCjHPC5jSfbDAAAAMHRSTlMAKPgE4hr8CfPy4NzUt7SxlnpaVlRPIhYPLgLt6ebOysXAwLmej4iGgGtpYkpAPCBw95QiAAAB50lEQVQ4y42T13aDMAxAbVb2TrO6927lwQhktf//UZWVQ1sIJLnwwBEXWZYwy1Lh/buG5TXu+rzC9nByDQCCbrg+KdUmLUsgW08IqzUp9rgDf5Ds8CJv1KS3mNL3fbGlOdr1Kh1AtFgs15vke7kQGpDO7pYGtJgfbRSxiXxaf7AjgsFfy1/WPu0r73WpwGiu1Fn78bF9JpWKUBTQzYlNQIK5lDcuQ9wbKeeBiTWz3vgUv44TpS4njJhcKpXEuMzpOCN+VE2FmPA9jbxjSrOf6kdG7FvYmkBJ6aYRV0oVYIusfkZ8xeHpUMna+LeYmlShxkG+Zv8GyohLf6aRzzRj9t+YVgWaX1IO08hQyi9tapxmB3huxJUp8q/EVYzB89wQr0y/FwqrHLqoDWsoLsxQr1iWNxp1iCnlRbt9IdELwfDGcrSMKJbGxLx4LenTFsszFSYehwl6aCZhTNPnO6LdBYOGYBVFqwAfDF27+CQIvLUGrTU9lpyFBw9yeA+sCNsRkJ5WQjg2K+QFcrywEjoCBHVpe3VYGZyk9NQCLxXte/jHvc1K4XXKSNQ520PPtIhcr8f2MXPShNiavTyn4jM7wK0g75YdYgTE6KA465nN9GbsILwhoMHZETx53hM7Brtet9lRDAYFwR80rG+sfAnbpQAAAABJRU5ErkJggg=='
  private mapEl: HTMLElement;

  isBrowser : boolean = false;


  constructor(
    private elementRef: ElementRef,
    @Inject(PLATFORM_ID) private platformID,
    private storesServices: StoresService,
    private translate: TranslateService,
    private router: Router
  ) {
    this.isBrowser = isPlatformBrowser(platformID)
  }


  ngAfterViewInit(){
    if(this.isBrowser){

    this.mapEl = this.elementRef.nativeElement.querySelector('#' + this.target);
    this.setSize()
    this.map = new Map({
      layers: [
        new TileLayer({
          source: new OSM(),
        }) ],
      target: this.target,
      view: new View({
        center: Proj.fromLonLat([this.lon, this.lat]),
        zoom: this.zoom
      }),
      controls: defaultControls({attribution: false, zoom: false}).extend([])
    });

    let _this = this;
      let proy = Proj;
      this.map.on('singleclick', function(e) {

        let feature: any = _this.map.forEachFeatureAtPixel(e.pixel, function(feature, layer) {
          return feature;
        });

        if (feature) {

          var coordinate = e.coordinate;

          _this.selectMarker(feature.customData);
        }

      });

      this.map.on('pointerdrag', function() {

        _this.centroMap.emit(proy.transform(_this.map.getView().getCenter(),'EPSG:3857', 'EPSG:4326'));

      });
      
    }

  }

  private setSize() : void {
    if (this.isBrowser&&this.mapEl) {
      const styles = this.mapEl.style;
      styles.height = coerceCssPixelValue(this.height) || DEFAULT_HEIGHT;
      styles.width = coerceCssPixelValue(this.width) || DEFAULT_WIDTH;
    }
  }

  public setMarker(vector: VectorLayer) : void {
    this.map.addLayer(vector);
  }

  public setControl(control: Control) : void {
    this.map.addControl(control);
  }

  public setZoom(number: number) : void {
    var view = this.map.getView();
    var zoom = view.getZoom();
    view.setZoom(zoom + number);
    this.map.setView(view);
  }

  public setView(lat : number, lng: number) : void {
    let view: View = new View({
      center: Proj.fromLonLat([lng, lat]),
      zoom: this.zoom
    });
    this.map.setView(view);
  }

  selectMarker(item){
    this.router.navigate([`/${item.id_store}`])
  }


}


const cssUnitsPattern = /([A-Za-z%]+)$/;

function coerceCssPixelValue(value: any): string {
  if (value == null) {
    return '';
  }

  return cssUnitsPattern.test(value) ? value : `${value}px`;
}
