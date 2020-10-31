import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslateModule } from '@ngx-translate/core';
import { ViewSessionComponent } from './view-session.component';

describe('SessionComponent', () => {
  let component: ViewSessionComponent, fixture: ComponentFixture<ViewSessionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ViewSessionComponent],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title in a h1 tag', async(() => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('PAGES.HOME.TITLE');
  }));
});
