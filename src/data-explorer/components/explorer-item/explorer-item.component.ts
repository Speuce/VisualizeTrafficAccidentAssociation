import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataServiceService } from '../../services/data-service.service';

@Component({
  selector: 'app-explorer-item',
  template: `
    <div style="display: flex; flex-wrap: wrap; width: 100%; flex-direction: row">
      <mat-form-field appearance="fill">
        <mat-label>Accident Severity</mat-label>
        <mat-select [(value)]="selectedSeverity" (selectionChange)="reLoadData()">
          <mat-option value="All">All</mat-option>
          <mat-option value="Serious">Serious</mat-option>
          <mat-option value="Fatal">Fatal</mat-option>
        </mat-select>
      </mat-form-field>
      <div *ngFor="let option of selectedOptions; index as i" style="margin: 0 10px;">
        <mat-form-field appearance="fill">
          <mat-label>Dimension {{ i + 1 }}</mat-label>
          <mat-select [value]="option[0]" (selectionChange)="selectKey(i, $event.value)">
            <mat-option *ngFor="let val of availableKeys(i)" [value]="val">{{ val }}</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Value {{ i + 1 }}</mat-label>
          <mat-select
            [disabled]="!option[0]"
            [value]="option[1]"
            (selectionChange)="selectValue(i, $event.value)"
          >
            <mat-option
              *ngFor="let val of dataService.getPossibleValues(selectedSeverity, option[0])"
              [value]="val"
              >{{ val }}</mat-option
            >
          </mat-select>
        </mat-form-field>
      </div>
    </div>
    <div class="mat-elevation-z2">
      <table mat-table matSort [dataSource]="tableDisplay">
        <!-- Position Column -->
        <ng-container matColumnDef="LHS">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>LHS</th>
          <td mat-cell *matCellDef="let rule">{{ rule.LHS }}</td>
        </ng-container>

        <ng-container matColumnDef="RHS">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>RHS</th>
          <td mat-cell *matCellDef="let rule">{{ rule.RHS }}</td>
        </ng-container>

        <ng-container matColumnDef="conf">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Confidence</th>
          <td mat-cell *matCellDef="let rule">{{ rule.conf }}</td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
      </table>

      <mat-paginator
        [pageSizeOptions]="[5, 10, 20]"
        showFirstLastButtons
        aria-label="Select page of periodic elements"
      >
      </mat-paginator>
    </div>
  `,
  styles: [
    `
      table {
        width: 100%;
      }
    `,
  ],
})
export class ExplorerItemComponent implements OnInit, AfterViewInit {
  selectedSeverity: string = 'All';

  displayedColumns: string[] = ['LHS', 'RHS', 'conf'];

  selectedOptions: [string, string][] = [['', '']];

  tableDisplay: MatTableDataSource<any> = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  @ViewChild(MatSort) sort: MatSort | undefined;

  constructor(public dataService: DataServiceService) {}

  ngOnInit(): void {
    this.reLoadData();
    this.tableDisplay.filterPredicate = (data: AssociationRule, filter: string) =>
      filter.split(',').every((x) => data.LHS.includes(x));
  }

  ngAfterViewInit() {
    // @ts-ignore
    this.tableDisplay.paginator = this.paginator;
    // @ts-ignore
    this.tableDisplay.sort = this.sort;
  }

  selectedOptionsEntries() {
    return this.selectedOptions.entries();
  }

  selectKey(index: number, key: string) {
    this.selectedOptions[index][0] = key;
    this.selectedOptions[index][1] = '';
    this.selectedOptions.splice(index + 1);
    this.updateFilter();
  }

  selectValue(index: number, value: string) {
    this.selectedOptions[index][1] = value;
    this.selectedOptions.splice(index + 1);
    if (index === this.selectedOptions.length - 1) {
      this.selectedOptions.push(['', '']);
      this.updateFilter();
    }
  }

  reLoadData() {
    this.dataService.getRules(this.selectedSeverity).subscribe((textblock) => {
      this.selectedOptions = [['', '']];
      this.updateFilter();
      const newData: AssociationRule[] = [];
      const text = textblock as string;
      text
        .split('\n')
        .slice(0, -1)
        .forEach((line) => {
          const split1 = line.split('->');
          const split2 = split1[1].split(',');
          const confidence = parseFloat(split2[split2.length - 1].split(' ')[3].substring(0, 4));
          split2.splice(split2.length - 1);
          newData.push({
            LHS: split1[0],
            RHS: split2.join(','),
            conf: confidence,
          });
        });
      this.tableDisplay.data = newData;
    });
  }

  availableKeys(index: number) {
    return this.dataService.getKeys(this.selectedSeverity).filter(
      (key) =>
        // eslint-disable-next-line
        index === 0 ||
        key === this.selectedOptions[index][0] ||
        (!this.selectedOptions.slice(0, index).some((option) => option[0] === key) &&
          this.tableDisplay.filteredData.some((rule) => rule.LHS.includes(key)))
    );
  }

  updateFilter() {
    const filterString = this.selectedOptions.map((arr) => arr.join(':')).join(',');
    console.log(filterString);
    this.tableDisplay.filter = filterString;
  }
}

export interface AssociationRule {
  LHS: string;
  RHS: string;
  conf: number;
}
