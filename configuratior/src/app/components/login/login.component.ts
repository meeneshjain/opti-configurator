import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import { CommonData } from "../../models/CommonData";
import { CommonService } from "../../services/common.service";
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @ViewChild("username") _el: ElementRef;
  imgPath = "assets/images";
  public licenseData: any = [];
  public loginCredentials: any = [];
  public psURL: string = '';
  public showCompDropDown: boolean = false;
  public showLoginBtn: boolean = false;
  public config_params: any;
  public assignedCompanies: any;
  public selecetedComp: any;
  public disbleConnectBtn: boolean = true;
  public config_data: any = [];
  public connectBtnText = "Connect";
  public language: any = [];
  private commonData = new CommonData();
  public background = this.commonData.get_current_url() + "/assets/images/bg.jpg";
  public login = "Login..";
  public titleInfo = "Enter username and password";
  public username = "Username";
  public isUsernameBlank = "Enter Username";
  public password = "Password";
  public isPasswordBlank = "Enter Password";
  public login_btn = "Login";
  public reset_button_text = "Reset";
  public UserNotActive = 'User is not active';
  public InvalidCredentials = 'Username or password not valid';
  public CompanyRequired = 'Select Company';
  public UserNameRequired = 'Username required';
  public PasswordRequired = 'Password required';
  public default_server_error_msg = "There was some error, please try again";
  public license_failed = "License Failed";
  public isUserPermitted = "You Don't have Permission to Access this Product";
  public FailedToReadCurrency = "There was some error while fetching currency details";
  public onConnectSuccess: boolean = false;
  public page_title = this.commonData.project_name;
  public showLoginLoader:boolean = true;
  common_params = new CommonData();
  record_per_page: any = this.common_params.default_count;
  constructor(
    private auth: AuthenticationService,
    private router: Router,
    private httpClientSer: HttpClient,
    private toastr: ToastrService,
    private CommonService: CommonService
  ) { }


  ngOnInit() {
    this._el.nativeElement.focus();
    this.selecetedComp = "";
    console.log(new Date());
    // this.CommonService.get_config();
    if (sessionStorage.getItem('isLoggedIn') == 'true') {
      this.router.navigateByUrl('/home');
    } else {
      //This Function will get the url from Database to hit Admin Portal Services
      setTimeout(() => {
        this.getPSURL();
      }, 2000);
    }
  }

  ngAfterViewInit() {
    setTimeout(function () {
      console.log(new Date());
      this.config_data = JSON.parse(sessionStorage.getItem('system_config'));
      this.language = JSON.parse(sessionStorage.getItem('current_lang'));
      if (this.language == undefined && this.language != "" && this.language != 0) {
        if (this.config_data != undefined && this.config_data != "") {
          if (this.config_data['locale'] != "" && this.config_data['locale'] != undefined && this.config_data['locale'] != 0) {
            //   this.CommonService.set_language(this.config_data['locale']);
            this.language = JSON.parse(sessionStorage.getItem('current_lang'));
          }
        }
        this.connectBtnText = this.language.connect;
        this.login = this.language.login;
        this.titleInfo = this.language.titleInfo;
        this.username = this.language.username;
        this.isUsernameBlank = this.language.isUsernameBlank;
        this.password = this.language.password;
        this.isPasswordBlank = this.language.isPasswordBlank;
        this.login_btn = this.language.login;
        this.reset_button_text = this.language.reset;
        this.UserNotActive = this.language.UserNotActive;
        this.InvalidCredentials = this.language.InvalidCredentials;
        this.CompanyRequired = this.language.CompanyRequired;
        this.UserNameRequired = this.language.UserNameRequired;
        this.PasswordRequired = this.language.PasswordRequired;
        this.default_server_error_msg = this.language.server_error;
        this.license_failed = this.language.license_failed;
        this.isUserPermitted = this.language.isUserPermitted;
        this.FailedToReadCurrency = this.language.FailedToReadCurrency;
      }
    }, 2000);
  }

  enter_to_sublit(event) {
    if (event.keyCode == 13) {
      if (this.selecetedComp != undefined && this.selecetedComp != "") {
        // this.onLoginBtnPress();
        this.getLisenceData();
      } else {
        this.onConnectBtnPress();
      }
    }
  }

  //Events
  onConnectBtnPress() {
    if (this.loginCredentials.userName == undefined || this.loginCredentials.userName == null) {
      this.toastr.warning('', this.UserNameRequired, this.commonData.toast_config);
      return;
    }
    if (this.loginCredentials.password == undefined || this.loginCredentials.password == null) {
      this.toastr.warning('', this.PasswordRequired, this.commonData.toast_config);
      return;
    }
    if (this.loginCredentials.userName != undefined && this.loginCredentials.password != undefined) {
      this.showLoginLoader = true;
      this.auth.login(this.loginCredentials, this.psURL).subscribe(
        data => {
          if (data != null || data.Table.length > 0) {
            if (data.Table.length > 0) {
              if (data.Table[0].OPTM_ACTIVE == 1) {

                this.connectBtnText = (this.language.connected != undefined) ? this.language.connected : "Connected";
                //If everything is ok then we will get comapnies
                this.getCompanies();
              }
              else {
                //If user is not active
                this.showLoginLoader = false;
                this.toastr.warning('', this.UserNotActive, this.commonData.toast_config);
              }
            }
            else {
              //If no table found
              this.showLoginLoader = false;
              this.toastr.error('', this.InvalidCredentials, this.commonData.toast_config);
            }
          } else {
            //If no username & pass matches
            this.showLoginLoader = false;
            this.toastr.error('', this.InvalidCredentials, this.commonData.toast_config);
          }
        }, error=> {
          this.showLoginLoader = false;
        })
    }

  }

  onLoginBtnPress() {
    if (this.selecetedComp == undefined && this.selecetedComp == "") {
      this.toastr.warning('', this.CompanyRequired, this.commonData.toast_config);
      return;
    }
    else {
      //This will get the currency code from db
      this.getCurrencyCode(this.selecetedComp.OPTM_COMPID);

      if (this.selecetedComp.OPTM_COMPID == undefined) {
        this.toastr.warning('', this.CompanyRequired, this.commonData.toast_config);
        return;
      }
      
      sessionStorage.setItem('selectedComp', this.selecetedComp.OPTM_COMPID);
      sessionStorage.setItem('loggedInUser', this.loginCredentials.userName);
      sessionStorage.setItem('defaultRecords', this.record_per_page);
      sessionStorage.setItem('isLoggedIn', "true");

      this.CommonService.setisLoggedInData();

      sessionStorage.setItem('defaultCurrency', "$");
      // this.router.navigateByUrl('/home');
      let home_page = this.commonData.application_path + '/index.html#home';
      // let home_page = this.commonData.application_path + '/index.html#item-code-generation';

      //window.location.href = home_page;
      this.router.navigateByUrl('/home');
    }
  }

  getLisenceData(){
    this.showLoginLoader = true;
    this.auth.getLicenseData(this.selecetedComp.OPTM_COMPID, this.loginCredentials).subscribe(
      data => {
        if (data != undefined) {
          this.licenseData = data;
          this.handleLicenseDataSuccessResponse();
        } else {
         //  alert("Lisence Failed");
          this.showLoginLoader = false;
         this.toastr.error('', this.license_failed, this.commonData.toast_config);
        }
        // this.licenseData = data;

      },
      error => {
        // this.showLoader = false;
        this.showLoginLoader = false;
       //  alert("license Failed");
       this.toastr.error('', this.license_failed, this.commonData.toast_config);
      }
    );  
  }


  private handleLicenseDataSuccessResponse() {
    if (this.licenseData.length > 0) {
      if (this.licenseData[0].ErrMessage == "" || this.licenseData[0].ErrMessage == null) {
        sessionStorage.setItem("GUID", this.licenseData[0].GUID);
        sessionStorage.setItem("Token", this.licenseData[0].Token);
        this.onLoginBtnPress();

      } else {
        this.showLoginLoader = false;
         this.toastr.error('', this.licenseData[0].ErrMessage,  this.commonData.toast_config);
      }
    } else {
      this.showLoginLoader = false;
       this.toastr.error('', this.licenseData[0].ErrMessage,  this.commonData.toast_config);
    }
  }


  onUserNameBlur() {

  }
  onPasswordBlur() {

  }
  //Core Functions 
  //To get url from DB
  getPSURL() {

    //This will get the psURL
    this.auth.getPSURL().subscribe(
      data => {
        if (data != null) {
          this.psURL = data;
          //For code analysis remove in live enviorments.
          // this.psURL = "http://localhost:9500";
          //this.psURL = "http://172.16.6.140/OptiAdmin";
          //this.psURL = "http://172.16.6.122/OptiproAdmin";
          sessionStorage.setItem('psURL', this.psURL);
          this.showLoginLoader = false;
        } else {
          this.showLoginLoader = false;
          this.toastr.error('',this.default_server_error_msg, this.commonData.toast_config);
          return;
        }
      }, error => {
        this.showLoginLoader = false;
        this.toastr.error('',this.default_server_error_msg, this.commonData.toast_config);
        return;
      }
    )
  }

  //to get the companies assigned to user
  getCompanies() {
    this.auth.getCompany(this.loginCredentials, this.psURL).subscribe(
      data => {
        this.showLoginLoader = false;
        if (data != null || data != undefined) {
          this.assignedCompanies = data.Table;
          this.showLoginLoader = false;
          if (this.assignedCompanies != null) {
            //If comp found
            this.showCompDropDown = true;
            this.showLoginBtn = true;
            this.onConnectSuccess = true;
          }
          else {
            //If no companies found then will hide elements
            this.onConnectSuccess = false;
            this.showLoginBtn = false;
            this.showCompDropDown = false;
          }
        } else {
          //if No companies are retriving then we will consider that user have no company assignment
          // alert("You Don't have Permission to Access this Product");
          this.showLoginLoader = false;
          this.toastr.error('', this.isUserPermitted, this.commonData.toast_config);
        }
      }, error => {
        this.showLoginLoader = false;
        this.toastr.error('', this.default_server_error_msg, this.commonData.toast_config);
        return;
      }
    )
  }

  onResetClick() {
    this.onConnectSuccess = false;
    this.showLoginBtn = false;
    this.showCompDropDown = false;
    this.loginCredentials = [];
    this.loginCredentials.length = 0;
    this.connectBtnText = (this.language.connect != undefined) ? this.language.connect : "Connect";
  }

  //Get Currency code from backend
  getCurrencyCode(selectedCompID) {
    sessionStorage.setItem('defaultCurrency', "$");
    this.CommonService.GetCompanyDetails(selectedCompID).subscribe(
      data => {
        if (data != null || data != undefined) {
          if (data.length > 0) {
            sessionStorage.setItem('defaultCurrency', data[0].HomeCurrency);
          }
        }
      },
      error => {
        this.toastr.error('', this.FailedToReadCurrency, this.commonData.toast_config);
      }
    )
  }

}
