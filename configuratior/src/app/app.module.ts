// pre defined library 
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { RouterModule, Routes } from '@angular/router';
import { StorageServiceModule } from 'angular-webstorage-service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GridModule } from '@progress/kendo-angular-grid';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { UploadModule } from '@progress/kendo-angular-upload';
import { ButtonsModule } from '@progress/kendo-angular-buttons';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  suppressScrollY:false
};

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { ToastrModule } from 'ngx-toastr';


//pipes
import { FilterPipe } from './filter.pipe';
import { LookupFilterPipe } from './filter.pipe';

// user defined components
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './components/common/header/header.component';
import { SidebarComponent } from './components/common/sidebar/sidebar.component';
import { FooterComponent } from './components/common/footer/footer.component';
import { LookupComponent } from './components/common/lookup/lookup.component';
import { NotfoundComponent } from './components/common/notfound/notfound.component';
import { ModelComponent } from './components/feature/model/model.component';
import { ItemcodegenerationComponent } from './components/itemcodegeneration/itemcodegeneration.component';
import { ViewFeatureModelComponent } from "./components/feature/model/view.model.component";
import { ViewItemCodeGenerationComponent } from "./components/itemcodegeneration/viewitemcodegeneration.component";
import { BomComponent } from './components/feature/bom/bom.component';
import { ViewFeatureBOMComponent } from './components/feature/bom/view.bom.component';
import { ModelbomComponent } from './components/modelbom/modelbom.component';
import { ViewModelBomComponent } from "./components/modelbom/viewmodelbom.component";
import { TreeViewComponent } from "./components/common/tree.view";
import { FormElementTreeViewComponent } from "./components/common/output.tree.view";
import { CustomDialogsComponent } from './components/common/custom-dialogs/custom-dialogs.component';
import { RulewbComponent } from './components/rulewb/rulewb.component';
import { RuleWbViewComponent } from './components/rulewb/rulewb.view.component';
import { OutputComponent } from './components/output/output.component';
import { flattenStyles } from '@angular/platform-browser/src/dom/dom_renderer';
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';
import { BlankhandlerPipe } from './components/common/custom-pipes/blankhandler.pipe';
import { DialogsModule } from '@progress/kendo-angular-dialog';






// routing & navigation
const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'feature/model/add', component: ModelComponent },
  { path: 'feature/model/view', component: ViewFeatureModelComponent },
  { path: 'feature/model/edit/:id', component: ModelComponent },
  { path: 'feature/bom/add', component: BomComponent },
  { path: 'feature/bom/edit/:id', component: BomComponent },
  { path: 'feature/bom/view', component: ViewFeatureBOMComponent },
  
  { path: 'item-code-genration/add', component: ItemcodegenerationComponent },
  { path: 'item-code-genration/edit/:id', component: ItemcodegenerationComponent },
  { path: 'item-code-generation/view', component: ViewItemCodeGenerationComponent },
  { path: 'item-code-generation', component: ViewItemCodeGenerationComponent },

  { path: 'modelbom/add', component: ModelbomComponent },
  { path: 'modelbom/edit/:id', component: ModelbomComponent },
  { path: 'modelbom/view', component: ViewModelBomComponent },

  { path: 'rulewb/add', component: RulewbComponent },
  { path: 'rulewb/edit/:id', component: RulewbComponent },
  { path: 'rulewb/view', component: RuleWbViewComponent },

  { path: 'output/view', component: OutputComponent },
  { path: 'output/view/:id', component: OutputComponent },
  { path: 'output/view/new', component: OutputComponent },

  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: NotfoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    LookupComponent,
    NotfoundComponent,
    ModelComponent,
    ItemcodegenerationComponent,
    ViewFeatureModelComponent,
    ViewItemCodeGenerationComponent,
    ModelbomComponent,
    ViewModelBomComponent,
    BomComponent,
    ModelbomComponent,
    BomComponent,
    ModelbomComponent,
    ViewModelBomComponent,
    BomComponent,
    ModelbomComponent,
    ViewFeatureBOMComponent,
    ViewModelBomComponent, 
    FilterPipe,
    TreeViewComponent,
    FormElementTreeViewComponent,
    CustomDialogsComponent,
    LookupFilterPipe,
    RulewbComponent,
    RuleWbViewComponent,
    OutputComponent,
    BlankhandlerPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes,{useHash: true}),
    HttpClientModule,
    StorageServiceModule,
    ModalModule.forRoot(),
    InputsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    GridModule,
    DropDownsModule,
    ReactiveFormsModule,
    HttpClientJsonpModule,
    UploadModule,
    ButtonsModule,
    PerfectScrollbarModule,
    BsDropdownModule.forRoot(),
    DateInputsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    PDFExportModule,
    DialogsModule
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
