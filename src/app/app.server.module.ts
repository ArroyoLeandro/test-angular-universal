import { NgModule } from '@angular/core';
import {
  ServerModule,
  ServerTransferStateModule,
} from "@angular/platform-server";

import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { UniversalRelativeInterceptor } from 'src/universal-relative.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

@NgModule({
  imports: [AppModule, ServerModule, ServerTransferStateModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UniversalRelativeInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {}