import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EditDialogComponent } from './edit-dialog/edit-dialog.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Subscription } from 'rxjs';

export interface PeriodicElement {
  position: number;
  name: string;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
  ];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    MatTableModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    EditDialogComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'coding-assessment-atipera-angular-developer';
  
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource: PeriodicElement[] = [];
  filterControl = new FormControl('');
  filteredData: PeriodicElement[] = [];

  private subscriptions = new Subscription();

  constructor(public dialog: MatDialog) {}

  ngOnInit() {
    setTimeout(() => {
      this.dataSource = ELEMENT_DATA;
      this.filteredData = this.dataSource;
    }, 1000);

    this.subscriptions.add(
      this.filterControl.valueChanges
      .pipe(debounceTime(2000))
      .subscribe((value) => {
        this.applyFilter(value || '');
      })
    )
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }


  applyFilter(filterValue: string) {
    if (!filterValue) {
      this.filteredData = this.dataSource;
      return;
    }
    const filter = filterValue.trim().toLowerCase();
    this.filteredData = this.dataSource.filter((element) =>
      element.position.toString().includes(filter) ||
      element.name.toLowerCase().includes(filter) ||
      element.weight.toString().includes(filter) ||
      element.symbol.toLowerCase().includes(filter)
    );
  }

  editElement(element: PeriodicElement, field: keyof PeriodicElement) {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      width: '250px',
      data: { value: element[field], field: field },
    });

    this.subscriptions.add(dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        this.dataSource = this.dataSource.map((el) => {
          if (el === element) {
            return { ...el, [field]: result };
          }
          return el;
        });
        this.applyFilter(this.filterControl.value || '');
      }
    }))
  }
}
