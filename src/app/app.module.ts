import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { GoogleMapModule } from './modules/google-map/google-map.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, FormsModule, GoogleMapModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
