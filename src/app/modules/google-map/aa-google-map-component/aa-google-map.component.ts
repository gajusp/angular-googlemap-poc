import {
  Component,
  OnChanges,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  ViewChild
} from "@angular/core";

declare var google: any;

@Component({
  selector: "aa-google-map",
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./aa-google-map.component.html"
})
export class AAGoogleMapComponent implements OnChanges, OnInit {
  private aaMap = {};
  private zoomLevel = 9;
  private directionsService;
  private directionsDisplay;
  private aaContextMenu;

  @ViewChild("aaGoogleMap") gmapElement: any;

  // Default Position LatLng | String | google.maps.Place
  @Input() defaultPos: any = { lat: -34.397, lng: 150.644 };

  // LatLng | String | google.maps.Place
  @Input() origin: any;

  // LatLng | String | google.maps.Place
  @Input() destination: any;

  /**
   * Map option for direction
   * The DirectionsRequest object literal contains the following fields:
      {
        origin: LatLng | String | google.maps.Place,
        destination: LatLng | String | google.maps.Place,
        travelMode: TravelMode,
        transitOptions: TransitOptions,
        drivingOptions: DrivingOptions,
        unitSystem: UnitSystem,
        waypoints[]: DirectionsWaypoint,
        optimizeWaypoints: Boolean,
        provideRouteAlternatives: Boolean,
        avoidFerries: Boolean,
        avoidHighways: Boolean,
        avoidTolls: Boolean,
        region: String
      }
   */
  // Options - for direction routing
  @Input() travelMode: String = "DRIVING";
  @Input() transitOptions: any = {
    departureTime: new Date(1337675679473),
    modes: ["BUS"],
    routingPreference: "FEWER_TRANSFERS"
  };
  @Input() drivingOptions: any = {
    departureTime: new Date(),
    trafficModel: "bestguess"
  };
  @Input() waypoints: any = [];
  @Input() optimizeWaypoints = true;
  @Input() provideRouteAlternatives = false;
  @Input() avoidHighways = false;
  @Input() avoidTolls = false;

  ngOnInit() {
    let mapProp = {
      center: new google.maps.LatLng(this.defaultPos.lat, this.defaultPos.lng),
      zoom: this.zoomLevel,
      // mapTypeId: google.maps.MapTypeId.ROADMAP
      mapTypeId: google.maps.MapTypeId.HYBRID
      // mapTypeId: google.maps.MapTypeId.SATELLITE
      // mapTypeId: google.maps.MapTypeId.TERRAIN
    };
    this.directionsService = new google.maps.DirectionsService();
    this.directionsDisplay = new google.maps.DirectionsRenderer();
    this.onUpdateDefaultPosition(mapProp);
  }

  ngAfterViewInit() {}

  ngOnChanges(obj: any) {
    // Update the default position of map
    if (obj.defaultPos && obj.defaultPos.currentValue) {
      let mapProp = {
        center: new google.maps.LatLng(
          this.defaultPos.lat,
          this.defaultPos.lng
        ),
        zoom: this.zoomLevel,
        mapTypeId: google.maps.MapTypeId.HYBRID
      };
      this.onUpdateDefaultPosition(mapProp);
      this.onLoadMarkerPopup(mapProp);
    }

    // render the route line on map
    if (
      obj.origin &&
      obj.destination &&
      obj.origin.currentValue &&
      obj.destination.currentValue
    ) {
      this.origin = obj.origin.currentValue;
      this.destination = obj.destination.currentValue;
      this.setRoutDirection();
    }

    // Travel Model
    if (obj.travelMode && obj.travelMode.currentValue !== "DRIVING") {
      this.travelMode = obj.travelMode.currentValue;
      this.setTravelMode();
    }

    // Traffic Model
    if (
      obj.drivingOptions &&
      obj.drivingOptions.trafficModel &&
      obj.drivingOptions.trafficModel.currentValue !== "bestguess"
    ) {
      this.drivingOptions.trafficModel =
        obj.drivingOptions.trafficModel.currentValue;
      // this.setTrafficMode();
    }

    // Travel Model
    if (obj.avoidHighways) {
      this.avoidHighways = obj.avoidHighways.currentValue;
      this.setAvoidMotowaysTolls();
    }

    if (obj.avoidTolls) {
      this.avoidTolls = obj.avoidTolls.currentValue;
      this.setAvoidMotowaysTolls();
    }
  }

  /**
   * Update the Position of the map as per user location
   * @param mapProp
   */
  onUpdateDefaultPosition = mapProp => {
    this.aaMap = new google.maps.Map(this.gmapElement.nativeElement, mapProp);

    // this.aaMap.setMapTypeId('terrain');
    this.aaContextMenu = google.maps.event.addListener(
      this.aaMap,
      "rightclick",
      function(mouseEvent) {
        // aaRP.aaContextMenu.show(mouseEvent.latLng)
        console.log("Context menu launcher --- ");
      }
    );
  };

  /**
   * Set the Marker point as per geo location
   * @param mapProp
   */
  onLoadMarkerPopup = mapProp => {
    let marker = new google.maps.Marker({ position: mapProp.center });
    marker.setMap(this.aaMap);
    let infowindow = new google.maps.InfoWindow({
      content: "Hey, We are here"
    });
    infowindow.open(this.aaMap, marker);
  };

  /**
   * Set Route Direction
   */
  setRoutDirection = () => {
    this.directionsDisplay.setMap(this.aaMap);

    this.directionsService.route(
      {
        origin: this.origin,
        destination: this.destination,
        travelMode: this.travelMode || "DRIVING",
        waypoints: this.waypoints,
        optimizeWaypoints: this.optimizeWaypoints
        // transitOptions: this.transitOptions,
        // drivingOptions: this.drivingOptions,
        // provideRouteAlternatives: this.provideRouteAlternatives,
        // avoidHighways: this.avoidHighways,
        // avoidTolls: this.avoidTolls
      },
      (response, status) => {
        if (status === "OK") {
          this.directionsDisplay.setDirections(response);
        } else {
          window.alert("Directions request failed due to " + status);
        }
      }
    );
  };

  /**
   * Set Travel Mode = DRIVING | WALKING | BICYCLING | TRANSIT
   */
  setTravelMode = () => {
    this.directionsService.route(
      {
        origin: this.origin || { lat: 51.505482, lng: -0.118153 },
        destination: this.destination || { lat: 51.287421, lng: -1.096622 },
        travelMode: this.travelMode
      },
      (response, status) => {
        if (status == "OK") {
          this.directionsDisplay.setDirections(response);
        } else {
          window.alert("Directions request failed due to " + status);
        }
      }
    );
  };

  /**
   * Set Driving Option
   **/
  setTrafficMode = () => {
    this.directionsService.route(
      {
        origin: this.origin,
        destination: this.destination,
        drivingOptions: this.drivingOptions
      },
      (response, status) => {
        if (status == "OK") {
          this.directionsDisplay.setDirections(response);
        } else {
          window.alert("Directions request failed due to " + status);
        }
      }
    );
  };

  /**
   * Set Avoid Motoways & Tolls
   **/
  setAvoidMotowaysTolls = () => {
    this.directionsService &&
      this.directionsService.route(
        {
          origin: this.origin,
          destination: this.destination,
          travelMode: this.travelMode || "DRIVING",
          avoidHighways: this.avoidHighways,
          avoidTolls: this.avoidTolls
        },
        (response, status) => {
          if (status == "OK") {
            this.directionsDisplay.setDirections(response);
          } else {
            window.alert("Directions request failed due to " + status);
          }
        }
      );
  };

  initContextMenu = () => {
    let contextMenuOptions = {
      menuItems: [],
      classNames: {
        menu: "context_menu",
        menuSeparator: "context_menu_separator"
      }
    };
    let menuItems = [];
    menuItems.push({
      className: "context_menu_item",
      eventName: "directions_origin_click",
      id: "directionsOriginItem",
      label: "Directions from here"
    }),
      menuItems.push({
        className: "context_menu_item",
        eventName: "directions_destination_click",
        id: "directionsDestinationItem",
        label: "Directions to here"
      }),
      menuItems.push({
        className: "context_menu_item",
        eventName: "addvia_click",
        id: "directionsViaItem",
        label: "Via here"
      }),
      menuItems.push({}),
      menuItems.push({
        className: "context_menu_item",
        eventName: "zoom_in_click",
        label: "Zoom in"
      }),
      menuItems.push({
        className: "context_menu_item",
        eventName: "zoom_out_click",
        label: "Zoom out"
      }),
      menuItems.push({}),
      menuItems.push({
        className: "context_menu_item",
        eventName: "center_map_click",
        label: "Center map here"
      });
    contextMenuOptions.menuItems = menuItems;

    // aaContextMenu = new ContextMenu(this.aaMap,contextMenuOptions),
  };
}
