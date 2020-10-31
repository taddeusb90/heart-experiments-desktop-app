import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslateModule } from '@ngx-translate/core';
import { CompareSessionsComponent } from './compare-sessions.component';

describe('CompareSessionsComponent', () => {
  let component: CompareSessionsComponent, fixture: ComponentFixture<CompareSessionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CompareSessionsComponent],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompareSessionsComponent);
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
