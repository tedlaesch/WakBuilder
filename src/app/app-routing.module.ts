import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ItemListComponent } from './item-list/item-list.component';
import { AboutComponent } from './about/about.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const appRoutes: Routes = [
  { path: 'item', component: ItemListComponent },
  { path: 'about', component: AboutComponent},
  { path: '',   redirectTo: '/item', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [],
  imports: [
     RouterModule.forRoot(
      appRoutes,
      { enableTracing: true }
     )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
