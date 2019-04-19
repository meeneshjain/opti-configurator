import { Component, OnInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import { ItemcodegenerationService } from '../../services/itemcodegeneration.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonData, ColumnSetting } from "../../models/CommonData";
import { UIHelper } from '../../helpers/ui.helpers';
import { CommonService } from 'src/app/services/common.service';

@Component({
    selector: 'app-item-code-view-model',
    templateUrl: '../common/table.view.html',
    styleUrls: ['./itemcodegeneration.component.scss']
})


export class ViewItemCodeGenerationComponent implements OnInit {
    serviceData: any;
    public lookupfor = '';
    public selectedImage = "";
    @ViewChild("searchinput") _el: ElementRef;
    public commonData = new CommonData();
    page_main_title = 'Item Code Generation';
    table_title = this.page_main_title;
    public companyName: string = "";
    public username: string = "";
    add_route_link = '/item-code-genration/add';
    record_per_page_list: any = [10, 25, 50, 100];



    public listItems: Array<string> = this.commonData.default_limits;
    public selectedValue: number = 10;
    public skip:number = 0;

    record_per_page: any;
    search_string: any = "";
    current_page: any = 1;
    page_numbers: any = "";
    public isColumnFilter: boolean = false;
    // rows: any = "";
    public ViewData: any = [];
    public toDelete: any = {
    };
    public showLoader: boolean = true;
    show_table_footer: boolean = false;
    public CheckedData: any = [];

    //custom dialoag params
    public dialog_params: any = [];
    public show_dialog: boolean = false;
    public dialog_box_value: any;
    public row_id: any;
    public selectall: boolean = false;
    public GetItemData: any = [];
    public isMultiDelete: boolean = false;
    public showImportButton: boolean = false;

    public dataArray: any[];

    //table_head_foot = ['checkbox_here', '#', 'Code', 'Final String', 'Action'];
    language = JSON.parse(sessionStorage.getItem('current_lang'));
    table_head_foot = [this.language.checkbox_here, this.language.hash, this.language.code, this.language.finalstring, this.language.action];
    public table_hidden_elements = [false, true, false, false, false];

    constructor(private router: Router, private itemgen: ItemcodegenerationService, private toastr: ToastrService,
        private commonservice: CommonService) { }

    isMobile: boolean = false;
    isIpad: boolean = false;
    isDesktop: boolean = true;
    isPerfectSCrollBar: boolean = false;


    public columns: ColumnSetting[] = [
        {
            field: this.language.code,
            title: this.language.code,
            type: 'text',
            width: '500',
            attrType: 'link'
        }, {
            field: 'FinalString',
            title: this.language.finalstring,
            type: 'text',
            width: '500',
            attrType: 'text'
        },
    ];

    getLookupValue($event) {

    }
    getcurrentPageSize(grid_value) {
        sessionStorage.setItem('defaultRecords', grid_value);
        this.skip = 0;
        this.selectedValue = grid_value;
        this.record_per_page = sessionStorage.getItem('defaultRecords');
    }

    detectDevice() {
        let getDevice = UIHelper.isDevice();
        this.isMobile = getDevice[0];
        this.isIpad = getDevice[1];
        this.isDesktop = getDevice[2];
        if (this.isMobile == true) {
            this.isPerfectSCrollBar = true;
        } else if (this.isIpad == true) {
            this.isPerfectSCrollBar = false;
        } else {
            this.isPerfectSCrollBar = false;
        }
    }
    saveFilterState() {
        sessionStorage.setItem('isFilterEnabled', this.isColumnFilter.toString());
    }
    ngOnInit() {


        const element = document.getElementsByTagName("body")[0];
        element.className = "";
        this.showLoader = true;
        this.detectDevice();
        element.classList.add("add_item-code-view-model");
        element.classList.add("opti_body-main-module");
        element.classList.add('sidebar-toggled');



        this.commonData.checkSession();
        this.companyName = sessionStorage.getItem('selectedComp');
        this.record_per_page = sessionStorage.getItem('defaultRecords');
        if (sessionStorage.getItem('defaultRecords') !== undefined && sessionStorage.getItem('defaultRecords') != "") {
            this.selectedValue = Number(sessionStorage.getItem('defaultRecords'));
        } else {
            this.selectedValue = Number(this.commonData.default_count);
        }
        if (sessionStorage.isFilterEnabled == "true") {
            this.isColumnFilter = true;
        } else {
            this.isColumnFilter = false;
        }
        this.service_call(this.current_page, this.search_string);

        //this.CheckedData.CheckedRow=[];
        //   this.CheckedData.CompanyDBId=[];

    }
    ngAfterViewInit() {
        //  this._el.nativeElement.focus();
    }

    dataStateChanged(event){
       // console.log(event);
        event.filter = [];
        this.record_per_page = sessionStorage.getItem('defaultRecords');
        this.selectedValue = event.take;
        this.skip = event.skip;
    }

    on_selection(grid_event) {
        grid_event.selectedRows = [];
    }

    on_page_limit_change() {
        this.current_page = 1;
        this.service_call(this.current_page, this.search_string);
    }
    

    getPageValue() {
        if (this.selectedValue == null) {
            this.selectedValue = 10;
        }
        return this.selectedValue;
    }

    search_results() {
        this.current_page = 1;
        this.service_call(this.current_page, this.search_string);
    }

    log(data) {
        console.log(data);
    }

    service_call(page_number, search) {
        if (this.record_per_page !== undefined && sessionStorage.getItem('defaultRecords')) {
            if (this.record_per_page !== sessionStorage.getItem('defaultRecords')) {
                sessionStorage.setItem('defaultRecords', this.record_per_page);
            }
        } else {
            this.record_per_page = this.commonData.default_count;
            sessionStorage.setItem('defaultRecords', this.record_per_page);
        }
        var dataset = this.itemgen.viewItemGenerationData(this.companyName, search, page_number, this.record_per_page).subscribe(
            data => {

                this.showLoader = false;
                if (data != undefined && data.length > 0) {
                    if (data[0].ErrorMsg == "7001") {
                        this.commonservice.RemoveLoggedInUser().subscribe();
                        this.commonservice.signOut(this.toastr, this.router, 'Sessionout');
                        return;
                    }
                }
                this.dataArray = data;

            });
    }

    // action button values 
    show_button1: boolean = true;
    show_button2: boolean = true;

    button1_title = this.language.edit;
    button2_title = this.language.delete;

    button1_color = "btn-info";
    button2_color = "btn-danger";

    button1_icon = "fa fa-edit fa-fw";
    button2_icon = "fa fa-trash-o fa-fw";

    button_click1(data) {

        this.router.navigateByUrl('item-code-genration/edit/' + data.Code.trim());
        // button click function in here
    }
    button_click2(data) {
        this.isMultiDelete = false;
        this.dialog_params.push({ 'dialog_type': 'delete_confirmation', 'message': this.language.DeleteConfimation });
        this.show_dialog = true;
        this.row_id = data.Code;

        // var result = confirm(this.language.DeleteConfimation);

    }

    //This will take confimation box value
    get_dialog_value(userSelectionValue) {
        if (userSelectionValue == true) {
            if (this.isMultiDelete == false) {
                this.delete_row();
            }
            else {
                this.delete_multi_row();
            }
        }
        this.show_dialog = false;
    }

    //delete values
    delete_row() {
        // console.log("YES DELETE--"+this.row_id);
        this.GetItemData = []
        this.GetItemData.push({
            CompanyDBId: this.companyName,
            ItemCode: this.row_id,
            GUID: sessionStorage.getItem("GUID"),
            UsernameForLic: sessionStorage.getItem("loggedInUser")
        })

        this.itemgen.DeleteData(this.GetItemData).subscribe(
            data => {
                if (data != undefined && data.length > 0) {
                    if (data[0].ErrorMsg == "7001") {
                        this.commonservice.RemoveLoggedInUser().subscribe();
                        this.commonservice.signOut(this.toastr, this.router, 'Sessionout');
                        return;
                    }
                }

                if (data[0].IsDeleted == "0" && data[0].Message == "ReferenceExists") {
                    this.toastr.error('', this.language.Refrence + ' at: ' + data[0].ItemCode, this.commonData.toast_config);
                }
                else if (data[0].IsDeleted == "1") {
                    this.toastr.success('', this.language.DataDeleteSuccesfully, this.commonData.toast_config);
                    this.showLoader = true;
                    this.service_call(this.current_page, this.search_string);
                    this.router.navigateByUrl('item-code-generation/view');
                }
                else {
                    this.toastr.error('', this.language.DataNotDelete + ' : ', this.commonData.toast_config);
                }

            }
        )

        //    this.itemgen.getItemCodeReference(this.GetItemData).subscribe(

        //         data => {
        //             if (data == "True") {
        //                 this.toastr.error('', this.language.Refrence, this.commonData.toast_config);
        //                 return false;
        //             }
        //             else {
        //                 this.itemgen.DeleteData(this.GetItemData).subscribe(
        //                     data => {
        //                         if(data != undefined && data.length > 0){
        //                             if (data[0].ErrorMsg == "7001") {
        //                                 this.commonservice.RemoveLoggedInUser().subscribe();
        //                                 this.commonservice.signOut(this.toastr, this.router);
        //                                 return;
        //                             } 
        //                          }

        //                         if (data === "True") {
        //                             this.toastr.success('', this.language.DataDeleteSuccesfully, this.commonData.toast_config);
        //                             this.service_call(this.current_page, this.search_string);
        //                             this.router.navigateByUrl('item-code-generation/view');
        //                             return;
        //                         }
        //                         else {
        //                             this.toastr.error('', this.language.DataNotDelete, this.commonData.toast_config);
        //                             return;
        //                         }
        //                     }
        //                 )
        //             }
        //         }
        //     )
    }

    on_checkbox_checked(checkedvalue, row_data) {
        var isExist = 0;
        if (this.CheckedData.length > 0) {
            for (let i = this.CheckedData.length - 1; i >= 0; --i) {
                if (this.CheckedData[i].ItemCode == row_data.Code) {
                    isExist = 1;
                    if (checkedvalue == true) {
                        this.CheckedData.push({
                            ItemCode: row_data.Code,
                            CompanyDBId: this.companyName,
                            GUID: sessionStorage.getItem("GUID"),
                            UsernameForLic: sessionStorage.getItem("loggedInUser")
                        })
                    }
                    else {
                        this.CheckedData.splice(i, 1)
                    }
                }
            }
            if (isExist == 0) {
                this.CheckedData.push({
                    ItemCode: row_data.Code,
                    CompanyDBId: this.companyName,
                    GUID: sessionStorage.getItem("GUID"),
                    UsernameForLic: sessionStorage.getItem("loggedInUser")
                })
            }
        }
        else {
            this.CheckedData.push({
                ItemCode: row_data.Code,
                CompanyDBId: this.companyName,
                GUID: sessionStorage.getItem("GUID"),
                UsernameForLic: sessionStorage.getItem("loggedInUser")
            })
        }


    }

    on_Selectall_checkbox_checked(checkedvalue) {
        var isExist = 0;
        this.CheckedData = []
        this.selectall = false
        if (checkedvalue == true) {
            if (this.dataArray.length > 0) {
                this.selectall = true
                for (let i = 0; i < this.dataArray.length; ++i) {

                    this.CheckedData.push({
                        ItemCode: this.dataArray[i].Code,
                        CompanyDBId: this.companyName,
                        GUID: sessionStorage.getItem("GUID"),
                        UsernameForLic: sessionStorage.getItem("loggedInUser")
                    })
                }
            }
        }
        else {
            this.selectall = false
        }
    }

    delete() {
        if (this.CheckedData.length > 0) {
            this.isMultiDelete = true;
            this.dialog_params.push({ 'dialog_type': 'delete_confirmation', 'message': this.language.DeleteConfimation });
            this.show_dialog = true;
        }
        else {
            this.toastr.error('', this.language.Norowselected, this.commonData.toast_config)
        }

    }

    delete_multi_row() {
        this.showLoader = true
        this.itemgen.DeleteSelectedData(this.CheckedData).subscribe(
            data => {
              
                if (data != undefined && data.length > 0) {
                    if (data[0].ErrorMsg == "7001") {
                        this.commonservice.RemoveLoggedInUser().subscribe();
                        this.commonservice.signOut(this.toastr, this.router, 'Sessionout');
                        return;
                    }
                }

                for (var i = 0; i < data.length; i++) {
                    if (data[i].IsDeleted == "0" && data[i].Message == "ReferenceExists") {
                        this.toastr.error('', this.language.Refrence + ' at: ' + data[i].ItemCode, this.commonData.toast_config);
                        
                    }
                    else if (data[i].IsDeleted == "1") {
                        this.toastr.success('', this.language.DataDeleteSuccesfully + ' with Item Id : ' + data[i].ItemCode, this.commonData.toast_config);
                        this.CheckedData = [];
                        this.showLoader = true;
                        this.service_call(this.current_page, this.search_string);
                        this.router.navigateByUrl('item-code-generation/view');
                    }
                    else {
                        
                        this.toastr.error('', this.language.DataNotDelete + ' : ' + data[i].ItemCode, this.commonData.toast_config);
                    }
                    this.showLoader = false
                }
            }
        )
        //for (let i = 0; i < this.CheckedData.length; ++i) {
        // this.itemgen.getItemCodeReference(this.CheckedData).subscribe(
        //     data => {
        //         if (data == "True") {
        //             this.toastr.error('', this.language.ItemCodeLink, this.commonData.toast_config);
        //             return;
        //         }
        //         else {
        //             this.itemgen.DeleteSelectedData(this.CheckedData).subscribe(
        //                 data => {
        //                     if(data != undefined && data.length > 0){
        //                         if (data[0].ErrorMsg == "7001") {
        //                             this.commonservice.RemoveLoggedInUser().subscribe();
        //                             this.commonservice.signOut(this.toastr, this.router);
        //                             return;
        //                         } 
        //                      }
        //                     if (data === "True") {
        //                         this.toastr.success('', this.language.DataDeleteSuccesfully, this.commonData.toast_config);
        //                         this.service_call(this.current_page, this.search_string);
        //                         this.router.navigateByUrl('item-code-generation/view');
        //                         return;
        //                     }
        //                     else {
        //                         this.toastr.error('', this.language.DataNotDelete, this.commonData.toast_config);
        //                         return;
        //                     }
        //                 }
        //             )
        //         }
        //     }
        // )
        // }
    }


}
