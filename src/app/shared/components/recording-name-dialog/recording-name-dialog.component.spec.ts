import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordingNameDialogComponent } from './recording-name-dialog.component';

describe('RecordingNameDialogComponent', () => {
  let component: RecordingNameDialogComponent;
  let fixture: ComponentFixture<RecordingNameDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordingNameDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordingNameDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
