import { Injectable } from '@angular/core';import { parse } from 'querystring';

import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject, BehaviorSubject } from 'rxjs';
import { CommonData } from "src/app/models/CommonData";


@Injectable({
  providedIn: 'root'
})
export class CommonService {
  public config_params:any;
  common_params = new CommonData();
  constructor(private httpclient: HttpClient) {
    this.config_params = JSON.parse(sessionStorage.getItem('system_config'));
   }
  config_parameter;

  // Declaration
  private commonData = new Subject<any>();
  commonData$ = this.commonData.asObservable();

  // Methods
  public ShareData(data: any) {
    this.commonData.next(data);
  }
 
 
  async get_config() {

<<<<<<< HEAD
    let service_call = await fetch(this.common_params.get_current_url() + "/assets/data/json/config.json");
=======
    let service_call = await fetch( this.common_params.get_current_url() +  "/assets/data/json/config.json");
>>>>>>> 0a74576e89d2d17e69e1cb7067904845cfe41e92
    let data = await service_call.json();
    
    sessionStorage.setItem('system_config', JSON.stringify(data));
  }

  async set_language(language) {

<<<<<<< HEAD
    let service_call = await fetch(this.common_params.get_current_url() + "/assets/data/json/i18n/" + language + ".json");
=======
    let service_call = await fetch( this.common_params.get_current_url() + "/assets/data/json/i18n/" + language + ".json");
>>>>>>> 0a74576e89d2d17e69e1cb7067904845cfe41e92
    let data = await service_call.json();
    sessionStorage.setItem('current_lang', JSON.stringify(data));
  }


   /* public get_config(){
    let service_call = this.httpclient.get("../../assets/data/json/config.json");
   
    service_call.subscribe( data => {
        sessionStorage.setItem('system_config', JSON.stringify(data));
      });
  } */


  /* public set_language(language){
    let service_call = this.httpclient.get("../../assets/data/json/i18n/" + language +".json");
    service_call.subscribe(data => {
      sessionStorage.setItem('current_lang', JSON.stringify(data));
    });
  } */

  //This will get he service according to user settings done on Admin Portal
  getMenuRecord(): Observable<any>{
    let jObject = { Menus: JSON.stringify([{ CompanyDBID: this.config_params.admin_db_name ,Product: this.config_params.product_code ,UserCode:  sessionStorage.getItem('loggedInUser') }]) }
    return this.httpclient.post(sessionStorage.getItem('psURL') + "/api/login/GetMenuRecord", jObject, this.common_params.httpOptions);
  }

   //This will get he service according to user settings done on Admin Portal
   getPermissionDetails(): Observable<any>{
    let jObject = { Permission: JSON.stringify([{ CompanyDBID: this.config_params.admin_db_name ,Product: this.config_params.product_code ,UserCode:  sessionStorage.getItem('loggedInUser') , MenuId:  sessionStorage.getItem('currentMenu') }]) }
    return this.httpclient.post(sessionStorage.getItem('psURL') + "/api/login/GetPermissionDetails", jObject, this.common_params.httpOptions);
  }
}
