import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataServiceService {
  keys: string[][] = [[], [], []];

  values: object[] = [{}, {}, {}];

  http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
    http.get('assets/keys.txt', { responseType: 'text' as 'json' }).subscribe((data: unknown) => {
      const text = data as string;
      text
        .split('\n')
        .slice(0, -1)
        .forEach((line) => this.keys[0].push(line));
      console.log(this.keys);
    });
    http
      .get('assets/keys_serious.txt', { responseType: 'text' as 'json' })
      .subscribe((data: unknown) => {
        const text = data as string;
        text
          .split('\n')
          .slice(0, -1)
          .forEach((line) => this.keys[1].push(line));
        console.log(this.keys);
      });
    http
      .get('assets/keys_fatal.txt', { responseType: 'text' as 'json' })
      .subscribe((data: unknown) => {
        const text = data as string;
        text
          .split('\n')
          .slice(0, -1)
          .forEach((line) => this.keys[2].push(line));
        console.log(this.keys);
      });

    http.get('assets/values.txt', { responseType: 'text' as 'json' }).subscribe((data: unknown) => {
      const text = data as string;
      const index = 0;
      text
        .split('\n')
        .slice(0, -1)
        .forEach((line) => {
          const splitLine = line.split(':');
          if (splitLine[0] in this.values[index]) {
            // @ts-ignore
            this.values[index][splitLine[0]].push(splitLine[1]);
          } else {
            // @ts-ignore
            this.values[index][splitLine[0]] = [splitLine[1]];
          }
        });
      console.log(this.values);
    });

    http
      .get('assets/values_serious.txt', { responseType: 'text' as 'json' })
      .subscribe((data: unknown) => {
        const text = data as string;
        const index = 1;
        text
          .split('\n')
          .slice(0, -1)
          .forEach((line) => {
            const splitLine = line.split(':');
            if (splitLine[0] in this.values[index]) {
              // @ts-ignore
              this.values[index][splitLine[0]].push(splitLine[1]);
            } else {
              // @ts-ignore
              this.values[index][splitLine[0]] = [splitLine[1]];
            }
          });
        console.log(this.values);
      });

    http
      .get('assets/values_fatal.txt', { responseType: 'text' as 'json' })
      .subscribe((data: unknown) => {
        const text = data as string;
        const index = 2;
        text
          .split('\n')
          .slice(0, -1)
          .forEach((line) => {
            const splitLine = line.split(':');
            if (splitLine[0] in this.values[index]) {
              // @ts-ignore
              this.values[index][splitLine[0]].push(splitLine[1]);
            } else {
              // @ts-ignore
              this.values[index][splitLine[0]] = [splitLine[1]];
            }
          });
        console.log(this.values);
      });
  }

  getKeys(accident_type: string): string[] {
    const index = this.accidentIndex(accident_type);
    return this.keys[index];
  }

  getRules(accident_type: string): Observable<any> {
    return this.http.get(`assets/${accident_type.toLowerCase()}_accident_rules2.txt`, {
      responseType: 'text' as 'json',
    });
  }

  getPossibleValues(accident_type: string, key: string): string[] {
    const index = this.accidentIndex(accident_type);
    // @ts-ignore
    return this.values[index][key] ?? [];
  }

  accidentIndex(accident_type: string) {
    if (accident_type === 'Fatal') {
      return 2;
    }
    if (accident_type === 'Serious') {
      return 1;
    }
    return 0;
  }
}
