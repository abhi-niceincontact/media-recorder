import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordedClipsComponent } from './recorded-clips.component';

describe('RecordedClipsComponent', () => {
  let component: RecordedClipsComponent;
  let fixture: ComponentFixture<RecordedClipsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordedClipsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordedClipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
