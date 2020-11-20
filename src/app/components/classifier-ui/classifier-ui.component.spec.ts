import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassifierUiComponent } from './classifier-ui.component';

describe('ClassifierUiComponent', () => {
  let component: ClassifierUiComponent;
  let fixture: ComponentFixture<ClassifierUiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassifierUiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassifierUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
