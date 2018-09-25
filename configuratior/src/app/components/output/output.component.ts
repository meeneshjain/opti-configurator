import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonData } from "../../models/CommonData";
import { ToastrService } from 'ngx-toastr';
import { OutputService } from '../../services/output.service';
import { ActivatedRoute, Router } from '@angular/router';

//import { LookupComponent } from '../common/lookup/lookup.component';

@Component({
  //providers:[LookupComponent],
  selector: 'app-output',
  templateUrl: './output.component.html',
  styleUrls: ['./output.component.scss']
})
export class OutputComponent implements OnInit {
  @ViewChild("modelcode") _el: ElementRef;
  public commonData = new CommonData();
  language = JSON.parse(sessionStorage.getItem('current_lang'));
  public page_main_title = this.language.output_window;
  public common_output_data: any = [];
  public feature_accessory_list: any[];
  public step1_data: any = [];
  public step2_data: any = [];
  public step3_data: any = [];
  public step4_data: any = [];
  public FeatureChildData = [];
  public feature_itm_list_table = [];
  public accessory_itm_list_table = [];
  public feature_itm_list_temp_table = [];
  public parentfeatureid: string = "";
  public feature_discount_percent: number = 0;
  //public step2_data_all_data={};
  public doctype: any = "";
  public lookupfor: string = '';
  public view_route_link: any = "/home";
  public accessory_table_head = ["#", this.language.code, this.language.Name];
  public feature_itm_list_table_head = [this.language.Model_FeatureName, this.language.item, this.language.description, this.language.quantity, this.language.price, this.language.price_extn];
  public itm_list_table_head = [this.language.item, this.language.description, this.language.quantity, this.language.price, this.language.price_extn];
  public model_discount_table_head = [this.language.discount_per, this.feature_discount_percent];
  public final_selection_header = ["#", this.language.serial, this.language.item, this.language.quantity, this.language.price, this.language.price_extn, "X"];
  public feature_item_tax: number = 0
  public feature_item_total: number = 0
  public acc_item_tax: number = 0
  public acc_total: number = 0
  public acc_grand_total: number = 0
  public isModelVisible: boolean = false;

  public feature_tax_total = [
    { "key": "Tax", "value": this.feature_item_tax },
    { "key": "Total", "value": this.feature_item_total },
  ];
  public item_tax_total = [
    { "key": "Tax", "value": this.acc_item_tax },
    { "key": "Total", "value": this.acc_total },
    { "key": "Grand Total", "value": this.acc_grand_total }
  ];
  public new_item_list = ["item 1", "item 2", "item 3", "item 4", "item 5"];

  public Accessory_table_hidden_elements = [false, false, false, true];
  public order_creation_table_head = [this.language.hash, this.language.item, this.language.quantity, this.language.price, this.language.price_extn];
  feature_child_data: any = [];
  
 
  Object = Object;
  console = console;
  constructor(private ActivatedRouter: ActivatedRoute, private route: Router, private OutputService: OutputService, private toastr: ToastrService) { }
  serviceData: any;
  public contact_persons: any;
  public sales_employee: any = [];
  public ship_to: any;
  public bill_to: any;
  public ship_data: any = [];
  public bill_data: any = [];
  public owner_list: any = [];
  public customerBillTo: any;
  public document: any;
  public customerShipTo: any;
  public isNextButtonVisible: boolean = false;
  public person: any;
  public salesemployee: any;

  public document_date = '';
  ngOnInit() {
    this.commonData.checkSession();
    this.common_output_data.username = sessionStorage.getItem('loggedInUser');
    this.common_output_data.companyName = sessionStorage.getItem('selectedComp');
    this.doctype = this.commonData.document_type;
    this.feature_accessory_list = []
    this.step2_data.quantity = 0;
    this._el.nativeElement.focus();
    // this.feature_accessory_list = [
    //   { "id": "1", "key": "A1", "name": "Accessory 1" },
    //   { "id": "2", "key": "A2", "name": "Accessory 2" },
    // ];

  }

  openFeatureLookUp() {
    this.serviceData = []
    this.lookupfor = 'feature_lookup';
    this.OutputService.getFeatureList().subscribe(
      data => {
        if (data.length > 0) {
          this.serviceData = data;
        }
        else {
          this.lookupfor = "";
          this.serviceData = [];
          this.toastr.error('', this.language.NoDataAvailable, this.commonData.toast_config);
          return;
        }
      }
    )
  }

  openChildFeatureLookUp(feature_id, feature_code) {
    this.serviceData = []
    this.parentfeatureid = feature_id
    this.lookupfor = 'feature_Detail_Output_lookup';
    this.OutputService.getFeatureDetails(feature_id).subscribe(
      data => {
        if (data.AllFeatures.length > 0) {
          this.serviceData = data.AllFeatures
    this.step1_data.document = "sales_quote";
    if (this.step1_data.document == "sales_quote") {
      this.document_date = this.language.valid_date;
      this.step1_data.document_name = "Sales Quote";
    }
    else {
      this.document_date = this.language.delivery_date;
      this.step1_data.document_name = "Sales Order";
    }
    this.feature_accessory_list = [
      { "id": "1", "key": "A1", "name": "Accessory 1" },
      { "id": "2", "key": "A2", "name": "Accessory 2" },
    ];

    var todaysDate = new Date();
    //var mindate =new Date(todaysDate) ;
    let formated_posting_date = new Date(todaysDate.getFullYear(), todaysDate.getMonth(), todaysDate.getDate());
    //let formated_posting_date =(todaysDate.getMonth()+1)+"/"+todaysDate.getDate()+"/"+todaysDate.getFullYear();
    this.step1_data.posting_date = formated_posting_date;
    this.isNextButtonVisible = false;
  }
   })
  }

  openCustomerLookUp() {

    this.serviceData = [];
    this.OutputService.getCustomerLookupData(this.common_output_data.companyName).subscribe(
      data => {
        if (data.length > 0) {
          this.lookupfor = 'output_customer';
          this.serviceData = data;
        }
        else {
          this.lookupfor = "";
          this.serviceData = [];
          this.toastr.error('', this.language.NoDataAvailable, this.commonData.toast_config);
          return;
        }
      }
    )

  }

  openSalesEmpLookup() { }

  openTaxCodes() { }

  onContactPersonChange(contact) {
    this.person = contact;
    this.step1_data.person_name = this.person;
  }
  
  openModalList() {
    this.serviceData = []
    this.OutputService.GetModelList().subscribe(
      data => {
        if (data.length > 0) {
          this.lookupfor = 'ModelBom_lookup';
          this.serviceData = data;
        }
        else {
          this.lookupfor = "";
          this.serviceData = [];
          this.toastr.error('', this.language.NoDataAvailable, this.commonData.toast_config);
          return;
        }
      }
    )
  }

  onSalesPersonChange(selectedSalesEmp) {
    this.console.log(selectedSalesEmp);
    this.salesemployee = selectedSalesEmp;
    this.step1_data.sales_employee = selectedSalesEmp;
  }


  getLookupValue($event) {
    if (this.lookupfor == 'ModelBom_lookup') {
      this.step2_data.model_id = $event[0];
      this.step2_data.model_code = $event[1];
      this.isModelVisible = true
    }
    else if (this.lookupfor == 'feature_lookup') {
      this.step2_data.feature_id = $event[0];
      this.step2_data.feature_code = $event[1];
      this.getFeatureDetails($event[0], $event[1]);
    }
    else if (this.lookupfor == 'feature_Detail_Output_lookup') {
      for (let i = 0; i < this.feature_child_data.length; ++i) {
        if (this.feature_child_data[i].featureparentid == this.parentfeatureid) {
          this.feature_child_data[i].featurechildcode = $event[1];
        }

      }
      this.getFeatureDetails($event[0], $event[1]);
    }
    else if (this.lookupfor == 'Price_lookup') {
      // this.getPriceDetails($event[0], "Header", this.currentrowindex);
    }
    else if (this.lookupfor == 'rule_section_lookup') {
      // this.rule_data = $event;
    }
    else if (this.lookupfor == 'Item_Detail_lookup') {
      this.serviceData = []
    }
   else if (this.lookupfor == 'output_customer') {
      this.step1_data.customer = $event[0];
      this.step1_data.customer_name = $event[1];

      if (this.step1_data.customer != undefined) {
        this.isNextButtonVisible = true;
        //get contact person
        this.fillContactPerson();
        this.fillShipTo();
        this.fillBillTo();
        this.fillOwners();
      }
      else {
        this.isNextButtonVisible = false;
      }
    }
    // this.getItemDetails($event[0]);
  }

  getFeatureDetails(feature_id, feature_code) {
    this.serviceData = []
    this.OutputService.getFeatureDetails(feature_id).subscribe(
      data => {
        if (data.AllFeatures.length > 0) {
          this.FeatureChildData = data.AllFeatures;
          if (data.ItemDataForFeature.length > 0) {
            this.getItemDataForFeature(data.ItemDataForFeature);
            this.feature_itm_list_temp_table.push(data.ItemDataForFeature);
          }
          if (data.FeaturesWithAccessoryYes.length > 0) {
            this.getAccessory(data.FeaturesWithAccessoryYes)
          }
          if (this.feature_child_data.length > 0) {
            let isExist = 0;
            for (let i = 0; i < this.feature_child_data.length; ++i) {
              if (this.feature_child_data[i].featureparentid == feature_id) {
                isExist = 1;
              }
            }
            if (isExist == 0) {
              this.feature_child_data.push({
                index: this.feature_child_data.length + 1,
                featureparentcode: feature_code,
                featureparentid: feature_id,
                featurechildcode: ""
              });




            }
          }
          else {
            this.feature_child_data.push({
              index: this.feature_child_data.length + 1,
              featureparentcode: feature_code,
              featureparentid: feature_id,
              featurechildcode: ""
            });
          }
          this.accesory_price_calculate();
          this.feature_price_calculate();
        }
        else {
          this.lookupfor = "";
          this.serviceData = [];
          // this.getAccessory();
          // this.toastr.error('', this.language.NoDataAvailable, this.commonData.toast_config);
          return;
        }
      }
    )
  }

  on_input_change(inputid, value) {
    if (inputid == "quantity") {
      if(value<0){
        this.toastr.error('', this.language.negativequantityvalid, this.commonData.toast_config);
        this.step2_data.quantity = 0;
        return;
      }
      var rgexp = /^\d+$/;
      if (rgexp.test(value)==false) {
        this.toastr.error('', this.language.decimalquantityvalid, this.commonData.toast_config);
        this.step2_data.quantity = 0;
        return;
      }
      else {
        this.step2_data.quantity = value
      }


    }
  }

  getAccessory(accesorydata: any) {
    if (accesorydata.length > 0) {
      if (this.feature_accessory_list.length > 0) {
        let isExist = 0;
        for (let i = 0; i < accesorydata.length; ++i) {
          for (let j = 0; j < this.feature_accessory_list.length; ++j) {
            if (this.feature_accessory_list[j].id == accesorydata[i].id) {
              isExist = 1;
            }
          }
          if (isExist == 0) {
            this.feature_accessory_list.push({
              id: accesorydata[i].OPTM_CHILDFEATUREID,
              key: accesorydata[i].OPTM_FEATURECODE,
              name: accesorydata[i].OPTM_DISPLAYNAME,
              checked: false
            });
          }
        }
      }
      else {
        for (let i = 0; i < accesorydata.length; ++i) {
          this.feature_accessory_list.push({
            id: accesorydata[i].OPTM_CHILDFEATUREID,
            key: accesorydata[i].OPTM_FEATURECODE,
            name: accesorydata[i].OPTM_DISPLAYNAME,
            checked: false
          });
        }
      }

    }

  }

  getItemDataForFeature(ItemData) {
    if (ItemData.length > 0) {
      if (this.feature_itm_list_table.length > 0) {
        let isExist = 0;
        for (let i = 0; i < ItemData.length; ++i) {
          for (let j = 0; j < this.feature_itm_list_table.length; ++j) {
            if (this.feature_itm_list_table[j].id == ItemData[i].id) {
              isExist = 1;
            }
          }
          if (isExist == 0) {
            this.feature_itm_list_table.push({
              FeatureId: ItemData[i].OPTM_FEATUREID,
              featureName: ItemData[i].OPTM_DISPLAYNAME,
              Item: ItemData[i].OPTM_ITEMKEY,
              Description: ItemData[i].OPTM_FEATUREDESC,
              quantity: ItemData[i].OPTM_QUANTITY,
              price: 0,
              pricextn: 0
            });
          }
        }
      }
      else {
        for (let i = 0; i < ItemData.length; ++i) {
          this.feature_itm_list_table.push({
            FeatureId: ItemData[i].OPTM_FEATUREID,
            featureName: ItemData[i].OPTM_DISPLAYNAME,
            Item: ItemData[i].OPTM_ITEMKEY,
            Description: ItemData[i].OPTM_FEATUREDESC,
            quantity: ItemData[i].OPTM_QUANTITY,
            price: 0,
            pricextn: 0
          });
        }
      }

    }
    this.feature_price_calculate();
  }

  feature_price_calculate() {
    // if (this.feature_itm_list_table.length > 0) {
    let itotal = 0;
    let isumofpriceitem = 0;
    let itax = 0;
    let idiscount = 0;

    for (let iacc = 0; iacc < this.feature_itm_list_table.length; ++iacc) {
      isumofpriceitem = isumofpriceitem + (this.feature_itm_list_table[iacc].quantity * this.feature_itm_list_table[iacc].price);
    }
    if (isumofpriceitem > 0) {
      itax = (isumofpriceitem * this.feature_item_tax) / 100
    }
    if (isumofpriceitem > 0) {
      idiscount = (isumofpriceitem * this.feature_discount_percent) / 100
    }
    itotal = isumofpriceitem + itax + idiscount
    this.feature_item_total = itotal
    this.acc_grand_total = this.feature_item_total + this.acc_total

    this.feature_tax_total[0].value = this.feature_item_tax
    this.feature_tax_total[1].value = this.feature_item_total
    this.item_tax_total[2].value = this.acc_grand_total
    // }
  }

  accesory_price_calculate() {
    // if (this.accessory_itm_list_table.length > 0) {
    let itotal = 0;
    let isumofpriceitem = 0;
    let itax = 0;
    let idiscount = 0;

    for (let iacc = 0; iacc < this.accessory_itm_list_table.length; ++iacc) {
      isumofpriceitem = isumofpriceitem + (this.accessory_itm_list_table[iacc].quantity * this.accessory_itm_list_table[iacc].price);
    }
    if (isumofpriceitem > 0) {
      itax = (isumofpriceitem * this.acc_item_tax) / 100
    }
    if (isumofpriceitem > 0) {
      idiscount = (isumofpriceitem * this.feature_discount_percent) / 100
    }
    itotal = isumofpriceitem + itax + idiscount
    this.acc_total = itotal

    this.acc_grand_total = this.feature_item_total + this.acc_total

    this.item_tax_total[0].value = this.acc_item_tax
    this.item_tax_total[1].value = this.acc_total
    this.item_tax_total[2].value = this.acc_grand_total


    //  }
  }

  onAccessoryChange(value, row) {
    for (let i = 0; i < this.feature_accessory_list.length; ++i) {
      if (this.feature_accessory_list[i].id == row.id) {
        this.feature_accessory_list[i].checked = value;
        if (this.feature_accessory_list[i].checked == true) {
          this.OutputService.GetItemDataForSelectedAccessorry(this.feature_accessory_list[i].id).subscribe(data => {
            if (data.length > 0) {
              for (let i = 0; i < data.length; ++i) {
                let isExist = 0;
                for (let iacc = 0; iacc < this.accessory_itm_list_table.length; ++iacc) {
                  if (this.accessory_itm_list_table[iacc].Item == data[i].OPTM_ITEMKEY && this.accessory_itm_list_table[iacc].FeatureId == data[i].OPTM_FEATUREID) {
                    isExist = 1;
                  }
                }
                if (isExist == 0) {
                  this.accessory_itm_list_table.push({
                    FeatureId: data[i].OPTM_FEATUREID,
                    Item: data[i].OPTM_ITEMKEY,
                    Description: data[i].OPTM_DISPLAYNAME,
                    quantity: data[i].OPTM_QUANTITY,
                    price: 0,
                    pricextn: 0
                  });
                }
              }


            }

          })

        }
        else {
          if (this.accessory_itm_list_table.length > 0) {
            for (let iacc = 0; iacc < this.accessory_itm_list_table.length; ++iacc) {
              if (this.accessory_itm_list_table[iacc].FeatureId == this.feature_accessory_list[i].id) {
                this.accessory_itm_list_table.splice(iacc, 1)
                iacc = iacc - 1;
              }


            }
          }
          //this.accessory_itm_list_table[iacc]
        }
      }
    }
    this.accesory_price_calculate();
    this.feature_price_calculate();

  }

  on_accessory_input_change(inputid, value, rowid, item) {
    for (let i = 0; i < this.accessory_itm_list_table.length; ++i) {
      if (rowid == this.accessory_itm_list_table[i].FeatureId && item == this.accessory_itm_list_table[i].Item) {
        if (inputid == "quantity") {
          if (value < 0) {
            this.toastr.error('', this.language.negativequantityvalid, this.commonData.toast_config);
            this.accessory_itm_list_table[i].quantity = 0;
            return;
          }
          this.accessory_itm_list_table[i].quantity = value
        }
        else if (inputid == "price") {
          if (value < 0) {
            this.toastr.error('', this.language.pricevalid, this.commonData.toast_config);
            this.accessory_itm_list_table[i].price = 0;
            return;
          }
          var rgexp = /^\d+$/;
          if (rgexp.test(value)==false) {
            this.toastr.error('', this.language.decimalquantityvalid, this.commonData.toast_config);
            this.accessory_itm_list_table[i].quantity = 0;
            return;
          }
          this.accessory_itm_list_table[i].price = value
        }
        else {
          if (value < 0) {
            this.toastr.error('', this.language.pricevalidextn, this.commonData.toast_config);
            this.accessory_itm_list_table[i].pricextn = 0;
            return;
          }
          this.accessory_itm_list_table[i].pricextn = value
        }

        this.accesory_price_calculate();


      }

    }
  }

  on_feature_input_change(inputid, value, rowid, item) {
    for (let i = 0; i < this.feature_itm_list_table.length; ++i) {
      if (rowid == this.feature_itm_list_table[i].FeatureId && item == this.feature_itm_list_table[i].Item) {
        if (inputid == "quantity") {
          if (value < 0) {
            this.toastr.error('', this.language.negativequantityvalid, this.commonData.toast_config);
            this.feature_itm_list_table[i].quantity = 0;
            return;
          }
          var rgexp = /^\d+$/;
          if (rgexp.test(value)==false) {
            this.toastr.error('', this.language.decimalquantityvalid, this.commonData.toast_config);
            this.feature_itm_list_table[i].quantity = 0;
            return;
          }
          this.feature_itm_list_table[i].quantity = value
        }
        else if (inputid == "price") {
          if (value < 0) {
            this.toastr.error('', this.language.pricevalid, this.commonData.toast_config);
            this.accessory_itm_list_table[i].price = 0;
            return;
          }
          this.feature_itm_list_table[i].price = value
        }
        else {
          if (value < 0) {
            this.toastr.error('', this.language.pricevalidextn, this.commonData.toast_config);
            this.accessory_itm_list_table[i].pricextn = 0;
            return;
          }
          this.feature_itm_list_table[i].pricextn = value
        }

        this.feature_price_calculate();

      }

    }
  }

  selectall(value) {
    for (let i = 0; i < this.feature_accessory_list.length; ++i) {
      this.feature_accessory_list[i].checked = value;
      if (value == true) {
        this.OutputService.GetItemDataForSelectedAccessorry(this.feature_accessory_list[i].id).subscribe(data => {
          if (data.length > 0) {
            for (let i = 0; i < data.length; ++i) {
              let isExist = 0;
              for (let iacc = 0; iacc < this.accessory_itm_list_table.length; ++iacc) {
                if (this.accessory_itm_list_table[iacc].Item == data[i].OPTM_ITEMKEY && this.accessory_itm_list_table[iacc].FeatureId == data[i].OPTM_FEATUREID) {
                  isExist = 1;
                }
              }
              if (isExist == 0) {
                this.accessory_itm_list_table.push({
                  FeatureId: data[i].OPTM_FEATUREID,
                  Item: data[i].OPTM_ITEMKEY,
                  Description: data[i].OPTM_DISPLAYNAME,
                  quantity: data[i].OPTM_QUANTITY,
                  price: 0,
                  pricextn: 0
                });
              }
            }


          }

        })
      }
      else {
        if (this.accessory_itm_list_table.length > 0) {
          for (let iacc = 0; iacc < this.accessory_itm_list_table.length; ++iacc) {
            if (this.accessory_itm_list_table[iacc].FeatureId == this.feature_accessory_list[i].id) {
              this.accessory_itm_list_table.splice(iacc, 1)
              iacc = iacc - 1;
            }


          }
        }

      }
    }
    this.accesory_price_calculate();
    this.feature_price_calculate();

  }

  onclearselection() {
    this.serviceData = [];
    this.step2_data = [];
    this.feature_child_data = [];
    this.feature_accessory_list = [];
    this.feature_itm_list_table = [];
    this.accessory_itm_list_table = [];
    this.feature_item_tax = 0
    this.feature_item_total = 0
    this.acc_item_tax = 0
    this.acc_total = 0
    this.acc_grand_total = 0
    this.item_tax_total[0].value = 0;
    this.item_tax_total[1].value = 0;
    this.item_tax_total[2].value = 0;
    this.feature_tax_total[0].value = 0;
    this.feature_tax_total[1].value = 0;
    this.item_tax_total[2].value = 0;
    this._el.nativeElement.focus();

  }
  
  onContactPersonSelectChange(selectedValue,rowIndex){
//this.console.log(selectedValue);
  }


  //this will get the contact person
  fillContactPerson() {
    this.OutputService.fillContactPerson(this.common_output_data.companyName, this.step1_data.customer).subscribe(
      data => {
        console.log(data);
        if (data != null || data != undefined && data.length > 0) {
          if (data.ContactPerson.length > 0) {
            this.contact_persons = data.ContactPerson;
            console.log(data);
            this.person = data.ContactPerson[0].Name;
            this.console.log(this.person);
            this.step1_data.person_name = this.person;
          }
          else {
            this.contact_persons = [];
          }
          if (data.DefaultSalesPerson.length > 0) {
            this.sales_employee = data.DefaultSalesPerson;
            this.salesemployee = data.DefaultSalesPerson[0].SlpName;
            this.step1_data.sales_employee = data.DefaultSalesPerson[0].SlpName;

          }
          else {
            this.sales_employee = [];
          }
        }
        else {
          this.toastr.error('', this.language.NoDataAvailable, this.commonData.toast_config);
          return;
        }
      },
      error => {
        this.toastr.error('', this.language.server_error, this.commonData.toast_config);
        return;
      }
    )


  }
  fillShipTo() {
    this.OutputService.fillShipTo(this.common_output_data.companyName, this.step1_data.customer).subscribe(
      data => {

        if (data != null || data != undefined && data.length > 0) {

          if (data.ShipDetail.length > 0) {
            this.ship_to = data.ShipDetail;
            this.customerShipTo = data.ShipDetail[0].ShipToDef;
            this.step1_data.ship_to = data.ShipDetail[0].ShipToDef;


            this.ship_data.push({
              CompanyDBId: this.common_output_data.companyName,
              Customer: this.step1_data.customer,
              ShipTo: this.customerShipTo

            });
            this.OutputService.fillShipAddress(this.ship_data).subscribe(
              data => {
                if (data != null || data != undefined && data.length > 0) {
                  this.step1_data.ship_to_address = data.ShippingAdress[0].ShippingAdress;
                }
                else {
                  this.step1_data.ship_to_address = '';
                }
              })
          }
          else {
            this.ship_to = [];
            this.step1_data.ship_to_address = '';
          }
        }
      }
    )
  }

  fillBillTo() {
    this.OutputService.fillBillTo(this.common_output_data.companyName, this.step1_data.customer).subscribe(
      data => {
        if (data != null || data != undefined && data.length > 0) {
          if (data.BillToDef.length > 0) {
            this.bill_to = data.BillToDef;
            this.customerBillTo = data.BillToDef[0].BillToDef;
            this.step1_data.bill_to = data.BillToDef[0].BillToDef;

            this.bill_data.push({
              CompanyDBId: this.common_output_data.companyName,
              Customer: this.step1_data.customer,
              BillTo: this.customerBillTo

            });
            this.OutputService.fillBillAddress(this.bill_data).subscribe(
              data => {
                if (data != null || data != undefined && data.length > 0) {
                  this.step1_data.bill_to_address = data.BillingAdress[0].BillingAdress;
                }
                else {
                  this.step1_data.bill_to_address = '';
                }
              })
          }
          else {
            this.bill_to = [];
            this.step1_data.bill_to_address = '';
          }
        }

      })
  }

  fillOwners() {
    this.OutputService.fillAllOwners(this.common_output_data.companyName).subscribe(
      data => {

        if (data != null || data != undefined && data.length > 0) {
          this.owner_list = data;
        }
        else {
          this.owner_list = [];
        }
      })
  }

  onShipToChange(SelectedShipTo) {

    this.step1_data.ship_to = SelectedShipTo;

    this.ship_data = [];
    this.ship_data.push({
      CompanyDBId: this.common_output_data.companyName,
      Customer: this.step1_data.customer,
      ShipTo: SelectedShipTo

    });
    this.OutputService.fillShipAddress(this.ship_data).subscribe(
      data => {
        if (data != null || data != undefined && data.length > 0) {
          this.step1_data.ship_to_address = data.ShippingAdress[0].ShippingAdress;
        }
        else {
          this.step1_data.ship_to_address = '';
        }
      })
  }

  onBillToChange(SelectedBillTo) {
    this.step1_data.bill_to = SelectedBillTo;
    this.bill_data = [];
    this.bill_data.push({
      CompanyDBId: this.common_output_data.companyName,
      Customer: this.step1_data.customer,
      ShipTo: SelectedBillTo

    });
    this.OutputService.fillBillAddress(this.bill_data).subscribe(
      data => {
        if (data != null || data != undefined && data.length > 0) {
          this.step1_data.bill_to_address = data.BillingAdress[0].BillingAdress;
        }
        else {
          this.step1_data.bill_to_address = '';



        }
      })
  }
  onCustomerChange() {
    this.OutputService.validateInputCustomer(this.common_output_data.companyName, this.step1_data.customer).subscribe(
      data => {
        if (data === "False") {
          this.toastr.error('', this.language.invalidcustomer, this.commonData.toast_config);
          this.isNextButtonVisible = false;
          this.step1_data.customer = "";
          this.step1_data.customer_name = '';
          this.contact_persons = [];
          this.sales_employee = [];
          this.ship_to = [];
          this.step1_data.ship_to_address = '';
          this.step1_data.bill_to_address = '';
          this.bill_to = [];
          this.owner_list = [];
          return;
        }

        else {
          this.isNextButtonVisible = true;
          this.GetCustomername();
          this.fillContactPerson();
          this.fillShipTo();
          this.fillBillTo();
          this.fillOwners();
        }
      })

  }

  GetCustomername() {
    this.OutputService.GetCustomername(this.common_output_data.companyName, this.step1_data.customer).subscribe(
      data => {
        this.console.log(data);
        if (data != null || data != undefined && data.length > 0) {
          this.step1_data.customer_name = data[0].Name;
        }
        else {
          this.step1_data.customer_name = '';
        }
      }
    )
  }

  onDocumentChange() {
    if (this.step1_data.document == "sales_quote") {
      this.document_date = this.language.valid_date;
      this.step1_data.document_name = "Sales Quote";
    }
    else {
      this.document_date = this.language.delivery_date;
      this.step1_data.document_name = "Sales Order";
    }
  }

  onFinishPress(){
    let final_dataset_to_save:any = {};
    final_dataset_to_save.OPConfig_OUTPUTHDR = [];
    final_dataset_to_save.OPConfig_OUTPUTHDR = this.step1_data;

    this.OutputService.AddUpdateCustomerData(final_dataset_to_save).subscribe(
      data => {
        this.console.log(data);
        if (data != null || data != undefined && data.length > 0) {
          this.step1_data.customer_name = data[0].Name;
        }
        else {
          this.step1_data.customer_name = '';
        }
      }
    )

  }

}




