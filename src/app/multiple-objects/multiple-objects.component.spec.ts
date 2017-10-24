import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleObjectsComponent } from './multiple-objects.component';

describe('MultipleObjectsComponent', () => {
  let component: MultipleObjectsComponent;
  let fixture: ComponentFixture<MultipleObjectsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultipleObjectsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipleObjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
