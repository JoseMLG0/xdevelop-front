import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private api: string = environment.userApi;

  constructor(private http: HttpClient) { }

  createUser(data: FormData){
    return this.http.post(this.api, data); 
  }

  updateUser(id:number, data: FormData){
    return this.http.put(this.api+id, data); 
  }

  deleteUser(id:number){
    return this.http.delete(this.api+id); 
  }

  getAll(): Observable<any>{
    return this.http.get(this.api); 
  }
}
