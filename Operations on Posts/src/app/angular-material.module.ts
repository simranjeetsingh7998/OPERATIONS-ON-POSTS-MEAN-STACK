import { NgModule } from '@angular/core';
import { MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,  
    MatDialogModule} from '@angular/material';

@NgModule({ // this turns it into angular module
    exports: [
        MatInputModule,
        MatCardModule,
        MatButtonModule,
        MatToolbarModule,
        MatExpansionModule,
        MatProgressSpinnerModule,
        MatPaginatorModule,
        MatDialogModule
    ]
}) 
export class AngularMaterialModule {

}