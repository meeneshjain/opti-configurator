import { Component, OnInit } from '@angular/core';
import { CommonData } from "../../models/CommonData";
import { ToastrService } from 'ngx-toastr';
import { ModelbomService } from '../../services/Modelbom.service';
import { ActivatedRoute, Router } from '@angular/router'

@Component({
  selector: 'app-modelbom',
  templateUrl: './modelbom.component.html',
  styleUrls: ['./modelbom.component.scss']
})
export class ModelbomComponent implements OnInit {
  public commonData = new CommonData();
  public view_route_link = '/modelbom/view';
  public input_file: File = null;
  language = JSON.parse(sessionStorage.getItem('current_lang'));
  public modelbom_data: any = [];
  public image_data: any = [];
  public lookupfor: string = '';
  public counter = 0;
  public currentrowindex: number;
  public isExplodeButtonVisible: boolean = true;
  public isVerifyButtonVisible: boolean = true;
  public isUpdateButtonVisible: boolean = true;
  public isSaveButtonVisible: boolean = true;
  public isDeleteButtonVisible: boolean = true;
  constructor(private router: ActivatedRoute, private route: Router, private service: ModelbomService, private toastr: ToastrService) { }

  companyName: string;
  page_main_title = this.language.ModelBom
  public username: string = "";
  serviceData: any;
  ngOnInit() {
    this.username = sessionStorage.getItem('loggedInUser');
    this.companyName = sessionStorage.getItem('selectedComp');
    this.image_data = [
      ""
    ];
  }
  onAddRow() {
    this.counter = 0;
    if (this.modelbom_data.length > 0) {
      this.counter = this.modelbom_data.length
    }
    this.counter++;

    this.modelbom_data.push({
      rowindex: this.counter,
      ModelId: this.modelbom_data.modal_id,
      description:this.modelbom_data.feature_desc,
      readytouse:"N",
      type: 1,
      type_value: "",
      display_name: "",
      uom: '',
      quantity: 0,
      min_selected: '',
      max_selected: '',
      propagate_qty: 'N',
      price_source: '',
      mandatory: 'N',
      unique_identifer: 'N',
      isDisplayNameDisabled: true,
      isTypeDisabled: true,
      hide: false,
      CompanyDBId: this.companyName,
      CreatedUser: this.username
    });
  };

  onDeleteRow(rowindex) {
    if (this.modelbom_data.length > 0) {
      for (let i = 0; i < this.modelbom_data.length; ++i) {
        if (this.modelbom_data[i].rowindex === rowindex) {
          this.modelbom_data.splice(i, 1);
          i = i - 1;
        }
        else {
          this.modelbom_data[i].rowindex = i + 1;
        }
      }
    }
  }

  on_bom_type_change(selectedvalue, rowindex) {
    this.currentrowindex = rowindex
    for (let i = 0; i < this.modelbom_data.length; ++i) {
      if (this.modelbom_data[i].rowindex === this.currentrowindex) {
        if (selectedvalue == 3) {
          this.modelbom_data[i].isDisplayNameDisabled = false
          this.modelbom_data[i].isTypeDisabled = false
          this.modelbom_data[i].hide = true
          this.modelbom_data[i].type = 3


        }
        else {
          this.modelbom_data[i].isDisplayNameDisabled = true
          this.modelbom_data[i].isTypeDisabled = true
          this.modelbom_data[i].hide = false
          if (selectedvalue == 2) {
            this.modelbom_data[i].type = 2
          }
          else {
            this.modelbom_data[i].type = 1
            this.lookupfor = 'feature_lookup';
          }
        }


      }
    }
    this.getModelFeatureDetails(this.modelbom_data.modal_id, "Detail", selectedvalue);

  }

  getModelFeatureDetails(feature_code, press_location, index) {
    console.log('inopen feature');


    this.service.getModelFeatureDetails(feature_code, press_location, index).subscribe(
      data => {
        if (data.length > 0) {
          if (press_location == "Header") {
            if (this.lookupfor == 'feature_lookup') {
              // this.feature_bom_data.feature_id = data;
              this.modelbom_data.feature_name = data[0].OPTM_DISPLAYNAME;
              this.modelbom_data.feature_desc = data[0].OPTM_FEATUREDESC;

            }
            else {
              // this.feature_bom_table=data;
              for (let i = 0; i < this.modelbom_data.length; ++i) {
                if (this.modelbom_data[i].rowindex === this.currentrowindex) {
                  this.modelbom_data[i].type_value = data[0].OPTM_FEATUREID.toString()
                  this.modelbom_data[i].display_name = data[0].OPTM_DISPLAYNAME

                }
              }
            }
          }
          else {
            if (index == 1) {
              this.lookupfor = 'feature_Detail_lookup';
            }
            else {
              this.lookupfor = 'Item_Detail_lookup';
            }

            this.serviceData = data;
          }
        }
      }
    )
  }





  /* file_input($event) {
    this.input_file = $event.target.files[0];

  }

  onUpload() {
    
    
    this.service.post_data_with_file(this.input_file, this.modelbom_data).subscribe(
      data => {
        console.log(data);
      }, error => {
        console.log(error);
      });
  } */

  openFeatureLookUp(status) {
    console.log('inopen feature');

    this.lookupfor = 'ModelBom_lookup';
    this.service.GetModelList().subscribe(
      data => {
        if (data.length > 0) {
          this.serviceData = data;
          console.log(this.serviceData);

        }
      }
    )
  }

  getLookupValue($event) {
    if (this.lookupfor == 'ModelBom_lookup') {
      this.modelbom_data.modal_id = $event;
      this.getModelDetails($event, "Header", 0);
    }
    else if (this.lookupfor == 'feature_Detail_lookup') {
      this.getModelFeatureDetails($event, "Header", 0);
    }
    else {
      this.lookupfor = 'Item_Detail_lookup';
      this.getItemDetails($event);

    }


  }





  getModelDetails(Model_code, press_location, index) {

    this.service.getModelDetails(Model_code, press_location, index).subscribe(
      data => {
        if (data.length > 0) {
          if (press_location == "Header") {
            if (this.lookupfor == 'ModelBom_lookup') {
              this.modelbom_data.feature_name = data[0].OPTM_DISPLAYNAME;
              this.modelbom_data.feature_desc = data[0].OPTM_FEATUREDESC;
            }
          }
         

        }
      }

    )
  }

  getItemDetails(ItemKey) {
    this.service.getItemDetails(ItemKey).subscribe(
      data => {
        if (data.length > 0) {
          for (let i = 0; i < this.modelbom_data.length; ++i) {
            if (this.modelbom_data[i].rowindex === this.currentrowindex) {
              this.modelbom_data[i].type_value = data[0].ItemKey.toString()
              this.modelbom_data[i].display_name = data[0].Description

            }
          }
        }
      })
  }

  on_typevalue_change(value, rowindex) {
    this.currentrowindex = rowindex
    for (let i = 0; i < this.modelbom_data.length; ++i) {
      if (this.modelbom_data[i].rowindex === this.currentrowindex) {
        this.modelbom_data[i].type_value = value.toString()
      }
    }
  }

  on_display_name_change(value, rowindex) {
    this.currentrowindex = rowindex
    for (let i = 0; i < this.modelbom_data.length; ++i) {
      if (this.modelbom_data[i].rowindex === this.currentrowindex) {
        this.modelbom_data[i].display_name = value
      }
    }
  }

  on_quantity_change(value, rowindex) {
    this.currentrowindex = rowindex
    for (let i = 0; i < this.modelbom_data.length; ++i) {
      if (this.modelbom_data[i].rowindex === this.currentrowindex) {
        this.modelbom_data[i].quantity = value


      }
    }

  }

  on_uom_change(value, rowindex) {
    this.currentrowindex = rowindex
    for (let i = 0; i < this.modelbom_data.length; ++i) {
      if (this.modelbom_data[i].rowindex === this.currentrowindex) {
        this.modelbom_data[i].uom = value


      }
    }

  }

  on_min_selected_change(value, rowindex) {
    this.currentrowindex = rowindex
    for (let i = 0; i < this.modelbom_data.length; ++i) {
      if (this.modelbom_data[i].rowindex === this.currentrowindex) {
        this.modelbom_data[i].min_selected = value


      }
    }

  }

  on_max_selected_change(value, rowindex) {
    this.currentrowindex = rowindex
    for (let i = 0; i < this.modelbom_data.length; ++i) {
      if (this.modelbom_data[i].rowindex === this.currentrowindex) {
        this.modelbom_data[i].max_selected = value


      }
    }

  }

  on_propagate_qty_change(value, rowindex) {
    this.currentrowindex = rowindex
    for (let i = 0; i < this.modelbom_data.length; ++i) {
      if (this.modelbom_data[i].rowindex === this.currentrowindex) {
        if (value.checked == true) {
          this.modelbom_data[i].propagate_qty = "Y"
        }
        else {
          this.modelbom_data[i].propagate_qty = "N"
        }



      }
    }

  }

  on_price_source_change(value, rowindex) {
    this.currentrowindex = rowindex
    for (let i = 0; i < this.modelbom_data.length; ++i) {
      if (this.modelbom_data[i].rowindex === this.currentrowindex) {
        this.modelbom_data[i].price_source = value


      }
    }

  }

  on_mandatory_change(value, rowindex) {
    this.currentrowindex = rowindex
    for (let i = 0; i < this.modelbom_data.length; ++i) {
      if (this.modelbom_data[i].rowindex === this.currentrowindex) {
        if (value.checked == true) {
          this.modelbom_data[i].mandatory = "Y"
        }
        else {
          this.modelbom_data[i].mandatory = "N"
        }



      }
    }

  }

  on_unique_identifer_change(value, rowindex) {
    this.currentrowindex = rowindex
    for (let i = 0; i < this.modelbom_data.length; ++i) {
      if (this.modelbom_data[i].rowindex === this.currentrowindex) {
        if (value.checked == true) {
          this.modelbom_data[i].unique_identifer = "Y"
        }
        else {
          this.modelbom_data[i].unique_identifer = "N"
        }



      }
    }

  }

  
  
  

  onSave() {
    if (this.modelbom_data.length > 0) {
      for (let i = 0; i < this.modelbom_data.length; ++i) {
        if( this.modelbom_data[i].unique_identifer==false){
          this.modelbom_data[i].unique_identifer="N"
        }
        else if(this.modelbom_data[i].unique_identifer==true){
          this.modelbom_data[i].unique_identifer="Y"
        }
        else if(this.modelbom_data[i].mandatory==false){
          this.modelbom_data[i].mandatory="N"
        }
        else if(this.modelbom_data[i].mandatory==true){
          this.modelbom_data[i].mandatory="Y"
        }
        else if(this.modelbom_data[i].propagate_qty==false){
          this.modelbom_data[i].propagate_qty="N"
        }
        else if(this.modelbom_data[i].propagate_qty==true){
          this.modelbom_data[i].propagate_qty="Y"
        }
       
       
      }
    }

    this.service.SaveModelBom(this.modelbom_data).subscribe(
      data => {
        if (data === "True") {
          this.toastr.success('', this.language.DataSaved, this.commonData.toast_config);
          this.route.navigateByUrl('modelbom/view');
          return;
        }
        else {
          this.toastr.error('', this.language.DataNotSaved, this.commonData.toast_config);
          return;
        }
      }
    )
  }


  onDelete() {

  }

  onExplodeClick() {

  }

  onVerifyOutput() {

  }

}
