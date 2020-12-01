import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./compress/compress.module').then(m => m.CompressModule)
  },
  // {
  //   path: 'home',
  //   loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
  // },
  {
    path: 'home',
    loadChildren: () => import('./compress/compress.module').then(m => m.CompressModule)
  },
  // {
  //   path: 'donate',
  //   loadChildren: () => import('./donate/donate.module').then(m => m.DonateModule)
  // },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
