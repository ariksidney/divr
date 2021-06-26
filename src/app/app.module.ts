import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireFunctionsModule, REGION } from '@angular/fire/functions';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RegisterComponent } from './components/register/register.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { DiveCourseComponent } from './components/dive-course/dive-course.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatListModule } from '@angular/material/list';
import { LayoutModule } from '@angular/cdk/layout';
import { DiveChartComponent } from './components/dive-chart/dive-chart.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { ListComponent } from './components/dive-overview/list/list.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatStepperModule } from '@angular/material/stepper';
import { MapComponent } from './components/dive-course/map/map.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { UploadComponent } from './components/upload-stepper/upload/upload.component';
import { FileDropDirective } from './directives/file-drop.directive';
import { UploadStepperComponent } from './components/upload-stepper/upload-stepper.component';
import { DiveCheckComponent } from './components/upload-stepper/dive-check/dive-check.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ChangePasswordComponent } from './components/profile/change-password/change-password.component'
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import {MatDialogModule} from '@angular/material/dialog'; 
import { MatPaginatorModule } from '@angular/material/paginator';
import { EditDiveComponent } from './components/dive-course/edit-dive/edit-dive.component';
import { DeleteDiveDialogComponent } from './components/dive-course/delete-dive-dialog/delete-dive-dialog.component';
import { AngularFireAuthGuard } from '@angular/fire/auth-guard';
import { ServiceWorkerModule } from '@angular/service-worker';
import { DiveDetailsComponent } from './components/dive-course/dive-details/dive-details.component';
import { FilterComponent } from './components/dive-overview/filter/filter.component';
import {GoogleMapsModule} from '@angular/google-maps';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    RegisterComponent,
    NavigationComponent,
    DiveCourseComponent,
    DiveChartComponent,
    ListComponent,
    MapComponent,
    UploadComponent,
    FileDropDirective,
    UploadStepperComponent,
    DiveCheckComponent,
    ProfileComponent,
    ChangePasswordComponent,
    EditDiveComponent,
    DeleteDiveDialogComponent,
    DiveDetailsComponent,
    FilterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatGridListModule,
    MatListModule,
    LayoutModule,
    MatTabsModule,
    MatExpansionModule,
    MatStepperModule,
    MatProgressBarModule,
    MatBottomSheetModule,
    MatDialogModule,
    MatPaginatorModule,
    HttpClientModule,
    HttpClientJsonpModule,
    GoogleMapsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence(),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireFunctionsModule,
    MatMenuModule,
    MatIconModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [AngularFireAuthGuard, { provide: REGION, useValue: 'europe-west1' }],
  entryComponents: [ChangePasswordComponent, EditDiveComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
