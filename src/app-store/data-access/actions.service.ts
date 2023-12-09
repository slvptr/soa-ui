import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';

const API_BASE_URL = 'http://localhost:8080/second-service-1.0-SNAPSHOT/api';

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
