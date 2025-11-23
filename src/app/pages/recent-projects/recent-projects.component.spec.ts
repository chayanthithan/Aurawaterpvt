import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentProjectsComponent } from './recent-projects.component';

describe('RecentProjectsComponent', () => {
  let component: RecentProjectsComponent;
  let fixture: ComponentFixture<RecentProjectsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecentProjectsComponent]
    });
    fixture = TestBed.createComponent(RecentProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
