import {
  async,
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import { FormsModule }  from '@angular/forms';
import { By } from '@angular/platform-browser';
import {
  ComponentLoaderFactory,
  DropdownConfig,
  DropdownModule,
  PositioningService,
  TooltipConfig,
  TooltipModule
} from 'ng2-bootstrap';

import { Filter } from './filter';
import { FilterComponent } from './filter.component';
import { FilterConfig } from './filter-config';
import { FilterField } from './filter-field';
import { FilterFieldsComponent } from './filter-fields.component';
import { FilterResultsComponent } from './filter-results.component';

describe('Filter component - ', () => {
  let comp: FilterComponent;
  let fixture: ComponentFixture<FilterComponent>;
  let config: FilterConfig;

  beforeEach(() => {
    config = {
      fields: [{
        id: 'name',
        title:  'Name',
        placeholder: 'Filter by Name...',
        type: 'text'
      },{
        id: 'age',
        title:  'Age',
        placeholder: 'Filter by Age...',
        type: 'text'
      },{
        id: 'address',
        title:  'Address',
        placeholder: 'Filter by Address...',
        type: 'text'
      },{
        id: 'birthMonth',
        title:  'Birth Month',
        placeholder: 'Filter by Birth Month...',
        type: 'select',
        queries: [{
          id: 'month1',
          value: 'January'
        },{
          id: 'month2',
          value: 'February'
        },{
          id: 'month3',
          value: 'March'
        },{
          id: 'month4',
          value: 'April'
        },{
          id: 'month5',
          value: 'May'
        },{
          id: 'month6',
          value: 'June'
        },{
          id: 'month7',
          value: 'July'
        },{
          id: 'month8',
          value: 'August'
        },{
          id: 'month9',
          value: 'September'
        },{
          id: 'month10',
          value: 'October'
        },{
          id: 'month11',
          value: 'November'
        },{
          id: 'month12',
          value: 'December'
        }]
      }] as FilterField[],
      appliedFilters: [],
      resultsCount: 5
    } as FilterConfig;
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, DropdownModule, TooltipModule],
      declarations: [FilterComponent, FilterFieldsComponent, FilterResultsComponent],
      providers: [ComponentLoaderFactory, DropdownConfig, PositioningService, TooltipConfig]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(FilterComponent);
        comp = fixture.componentInstance;
        comp.config = config;
        fixture.detectChanges();
      });
  }));

  it('should have correct number of filter fields', function () {
    let fields = fixture.debugElement.queryAll(By.css('.filter-field'));
    expect(fields.length).toBe(4);
  });

  it('should have correct number of results', function () {
    let results = fixture.debugElement.query(By.css('h5'));
    expect(results).toBeNull();

    config.appliedFilters = [{
      field: {
        id: 'address',
        title: 'Address'
      },
      value: 'New York'
    }] as Filter[];
    config.resultsCount = 10;
    fixture.detectChanges();

    results = fixture.debugElement.query(By.css('h5'));
    expect(results).not.toBeNull();
    expect(results.nativeElement.textContent.trim().slice(0, '10 Results'.length)).toBe('10 Results');
  });

  it('should show active filters and clear filters button when there are filters', function () {
    let activeFilters = fixture.debugElement.queryAll(By.css('.active-filter'));
    let clearFilters = fixture.debugElement.query(By.css('.clear-filters'));
    expect(activeFilters.length).toBe(0);
    expect(clearFilters).toBeNull();

    config.appliedFilters = [{
      field: {
        id: 'address',
        title: 'Address'
      },
      value: 'New York'
    }] as Filter[];
    fixture.detectChanges();

    activeFilters = fixture.debugElement.queryAll(By.css('.active-filter'));
    clearFilters = fixture.debugElement.query(By.css('.clear-filters'));
    expect(activeFilters.length).toBe(1);
    expect(clearFilters).not.toBeNull();
  });

  it ('should add a dropdown select when a select type is chosen', function() {
    let filterSelect = fixture.debugElement.query(By.css('.filter-select'));
    let fields = fixture.debugElement.queryAll(By.css('.filter-field'));

    expect(filterSelect).toBeNull();
    fields[3].triggerEventHandler('click', {});
    fixture.detectChanges();

    filterSelect = fixture.debugElement.query(By.css('.filter-select'));
    expect(filterSelect).not.toBeNull();

    let items = filterSelect.queryAll(By.css('li'));
    expect(items.length).toBe(config.fields[3].queries.length + 1); // +1 for the null value
  });

  it ('should clear a filter when the close button is clicked', function () {
    let closeButtons = fixture.debugElement.queryAll(By.css('.pficon-close'));
    expect(closeButtons.length).toBe(0);

    config.appliedFilters = [{
      field: {
        id: 'address',
        title: 'Address'
      },
      value: 'New York'
    }] as Filter[];
    fixture.detectChanges();

    closeButtons = fixture.debugElement.queryAll(By.css('.pficon-close'));
    expect(closeButtons.length).toBe(1);

    closeButtons[0].triggerEventHandler('click', {});
    fixture.detectChanges();

    closeButtons = fixture.debugElement.queryAll(By.css('.pficon-close'));
    expect(closeButtons.length).toBe(0);
  });

  it ('should clear all filters when the clear all filters button is clicked', function () {
    let activeFilters = fixture.debugElement.queryAll(By.css('.active-filter'));
    let clearButton = fixture.debugElement.query(By.css('.clear-filters'));
    expect(activeFilters.length).toBe(0);
    expect(clearButton).toBeNull();

    config.appliedFilters = [{
      field: {
        id: 'address',
        title: 'Address'
      },
      value: 'New York'
    }] as Filter[];
    fixture.detectChanges();

    activeFilters = fixture.debugElement.queryAll(By.css('.active-filter'));
    clearButton = fixture.debugElement.query(By.css('.clear-filters'));
    expect(activeFilters.length).toBe(1);
    expect(clearButton).not.toBeNull();

    clearButton.triggerEventHandler('click', {});
    fixture.detectChanges();

    activeFilters = fixture.debugElement.queryAll(By.css('.active-filter'));
    clearButton = fixture.debugElement.query(By.css('.clear-filters'));
    expect(activeFilters.length).toBe(0);
    expect(clearButton).toBeNull();
  });
});
