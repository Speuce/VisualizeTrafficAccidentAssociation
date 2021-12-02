import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-explorer-page',
  template: `
    <div style="height: 20px"></div>
    <app-explorer-item></app-explorer-item>
    <div style="height: 20px"></div>
    <app-explorer-item></app-explorer-item>
  `,
  styles: [],
})
export class ExplorerPageComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
