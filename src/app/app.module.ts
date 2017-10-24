import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { WebglComponent } from './webgl/webgl.component';
import { MultipleObjectsComponent } from './multiple-objects/multiple-objects.component';

@NgModule({
  declarations: [
    AppComponent,
    WebglComponent,
    MultipleObjectsComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
