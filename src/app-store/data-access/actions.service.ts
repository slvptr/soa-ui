import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';

const API_BASE_URL = 'https://localhost:8443/lab2soa2-0.0.1-SNAPSHOT/api/v1';

@Injectable({ providedIn: 'root' })
export class ActionsService {
  constructor(private readonly http: HttpClient) {}

  moveStudents(fromGroup: string, toGroup: string): Observable<string> {
    return this.http.post<string>(
      `${API_BASE_URL}/${fromGroup}/move/${toGroup}`,
      {}
    );
  }

  countTransferred(): Observable<number> {
    return this.http.post<number>(`${API_BASE_URL}/count-transferred`, {});
  }
}
