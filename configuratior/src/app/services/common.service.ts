import { Injectable } from '@angular/core';import { parse } from 'querystring';

import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject, BehaviorSubject } from 'rxjs';
import { CommonData } from "src/app/models/CommonData";


@Injectable({
  providedIn: 'root'
})
export class CommonService {
  common_params = new CommonData();
  constructor(private httpclient: HttpClient) { }
  config_parameter;

  // Declaration
  private commonData = new Subject<any>();
  commonData$ = this.commonData.asObservable();

  // Methods
  public ShareData(data: any) {
    this.commonData.next(data);
  }
 
 
  async get_config() {

    let service_call = await fetch("../../assets/data/json/config.json");
    let data = await service_call.json();
    
    sessionStorage.setItem('system_config', JSON.stringify(data));
  }

  async set_language(language) {

    let service_call = await fetch("../../assets/data/json/i18n/" + language + ".json");
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
}
