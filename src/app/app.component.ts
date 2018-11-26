import { Component, ViewChild, HostListener } from "@angular/core";
import { forkJoin } from "rxjs/observable/forkJoin";
import { Observable } from "rxjs";

declare var google: any;

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  title = "google-map-demo";

  fromSource = "Kharadi";
  toDestination = "Hadapsar";
  counter = 0;
  private origin: any;
  private destination: any;
  private defaultPos = { lat: -34.397, lng: 150.644 };
  private travelMode = "DRIVING";
  private drivingOptions = {
    departureTime: new Date(),
    trafficModel: "bestguess"
  };
  private avoidMotoways = false;
  private avoidTolls = false;

  ngOnInit() {
    let pos = { lat: -34.397, lng: 150.644 };
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position =>
          (this.defaultPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
      );
    }
  }

  onShowRoute(isReverse) {
    this.counter = 0;
    this.getGeoLocation(this.fromSource);
    this.getGeoLocation(this.toDestination);
    if (isReverse) {
      let tempLoc = this.destination;
      this.destination = this.origin;
      this.origin = tempLoc;
      let tempStr = this.toDestination;
      this.toDestination = this.fromSource;
      this.fromSource = tempStr;
    }
    // forkJoin([tempOrgn, tempDestn]).subscribe(results => {
    //   debugger;
    //   this.origin = results[0]; //"los angeles, ca";
    //   this.destination = results[1]; //"chicago, il";
    // });
  }

  onTravelChange(event) {
    this.travelMode = event.target.value || "";
  }

  onTrafficChange(event) {
    this.drivingOptions = {
      departureTime: new Date(),
      trafficModel: event.target.value || "bestguess"
    };
  }

  onChangeAvoidMotorways(event: any) {
    this.avoidMotoways = event;
  }

  onChangeAvoidTolls(event: any) {
    this.avoidTolls = event;
  }

  getGeoLocation(locationStr): Observable<Object> {
    let geocoder = new google.maps.Geocoder();
    return geocoder.geocode({ address: locationStr }, (results, status) => {
      if (status == "OK") {
        if (this.counter === 0) {
          this.origin = {
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng()
          };
        } else {
          this.destination = {
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng()
          };
        }
        this.counter++;
        console.log("geolocation lat lng ----------------------- ", results);
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });
  }

  /**
   * [onMessageReceived description]
   * This function is used for receiving the post message from index main file
   */
  @HostListener("window:message", ["$event"])
  onMessageReceived(event: any) {
    if (event.data.action === "mapScriptLoaded") {
      console.log(
        " === Google Map Script loaded sucessfully...!!!",
        event.data
      );
    }
  }
}
