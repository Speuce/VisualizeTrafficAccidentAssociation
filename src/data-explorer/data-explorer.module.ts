import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexModule } from '@angular/flex-layout';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { ExplorerPageComponent } from './explorer-page/explorer-page.component';
import { ExplorerItemComponent } from './components/explorer-item/explorer-item.component';

@NgModule({
  declarations: [ExplorerItemComponent, ExplorerPageComponent],
  imports: [
    CommonModule,
    FlexModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
  ],
  exports: [ExplorerPageComponent],
})
export class DataExplorerModule {}
