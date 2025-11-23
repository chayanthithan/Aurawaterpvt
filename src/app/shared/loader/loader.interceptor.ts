import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoaderService } from './loader.service';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  constructor(private loader: LoaderService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Skip loader for requests explicitly flagged to skip
    if (req.headers.get('X-Skip-Loader') === 'true') {
      return next.handle(req);
    }

    this.loader.start();
    return next.handle(req).pipe(
      finalize(() => this.loader.stop())
    );
  }
}
