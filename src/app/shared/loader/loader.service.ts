import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoaderService {
  private requestsInFlight = 0;
  private readonly _loading$ = new BehaviorSubject<boolean>(false);
  readonly loading$ = this._loading$.asObservable();

  start(): void {
    this.requestsInFlight++;
    if (this.requestsInFlight === 1) {
      this._loading$.next(true);
    }
  }

  stop(): void {
    if (this.requestsInFlight > 0) {
      this.requestsInFlight--;
    }
    if (this.requestsInFlight === 0) {
      this._loading$.next(false);
    }
  }

  // Optional utility to force hide/show if ever needed
  reset(): void {
    this.requestsInFlight = 0;
    this._loading$.next(false);
  }
}
