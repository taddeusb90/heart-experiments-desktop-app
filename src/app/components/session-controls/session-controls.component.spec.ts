import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionControlsComponent } from './session-controls.component';

describe('SessionControlsComponent', () => {
  let component: SessionControlsComponent;
  let fixture: ComponentFixture<SessionControlsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SessionControlsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
