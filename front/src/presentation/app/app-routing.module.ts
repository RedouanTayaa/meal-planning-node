import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicGuard } from './guards/public.guard';
import { AuthGuard } from './guards/auth.guard';
import { AppComponent } from './app.component';

const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    canActivateChild: [PublicGuard],
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
