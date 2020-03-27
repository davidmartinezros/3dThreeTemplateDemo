import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { App3dThreeTemplateModule, RenderService } from 'app3d-three-template';
import { AppComponent } from './app.component';
import { MyRenderService } from './my-service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    App3dThreeTemplateModule
  ],
  providers: [
    { provide: RenderService, useClass: MyRenderService }
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
