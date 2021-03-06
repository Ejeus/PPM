
import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { pp_User } from '../_models/pp_User';
import { UserService } from '../_services';
import { Role } from '../_models/Role';
import { UserformComponent } from '../userform/userform.component';
import { ChangePasswordComponent } from '../ChangePassword/ChangePassword.Component';
import { ToasterService } from 'angular2-toaster';
import { AlertService } from '../_services/alert.service';
import { Router, Params, ActivatedRoute, NavigationEnd } from '@angular/router';
import { CreditorformComponent } from '../creditorform/creditorform.component';
import { PetrolPumpService } from '../_services/petrolpump.service';
import {CreditorAddFundformComponent} from '../creditorFundForm/creditorFundForm.component';

@Component({
  selector: 'pump-creditor',
  templateUrl: './creditor.component.html',
  styleUrls: ['./creditor.component.css']
})
export class CreditorComponent implements OnInit {
  // @Input() pumpUsers: pp_User[];
  // @Input() pumpCode: string;

  public pumpUsers: pp_User[];
  public pumpCode: string;
  navigationSubscription;

  roles: Role[];
  constructor(private router:Router, private toasterService: ToasterService, public dialog: MatDialog, private userService: UserService,private activatedRoute: ActivatedRoute,private petrolPumpService: PetrolPumpService) {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.pumpCode = params['pumpCode'];
    });
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.ngOnInit();
      }
    });
  }
  getUserRole(roleId) {
    if(roleId == 0)
    {
      this.roles = new Array<Role>();
    }
    var userRole = this.roles.find(c => c.ID == roleId);
    return userRole ? userRole.Name : '';
  }


  ngOnInit() {
    if (this.pumpCode && this.pumpCode != '') {
      //this.getUserInfo();
      this.getPumpInfo(this.pumpCode);
    }
    //this.getAllRoles();
  }
  getPumpInfo(pumpCode) {
    this.petrolPumpService.getPetrolPumpDashboard(pumpCode).subscribe(res => {
      this.pumpUsers = res.pp_Users;
    });
  }
  editUser(user: pp_User) {
    user.IsEditModal = true;
    const dialogRef = this.dialog.open(CreditorformComponent, {
      data: { user }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }

  addFund(user: pp_User) {
    user.IsEditModal = true;
    user.PaymentTypeID = 0;
    user.CreditLimit = '';
    const dialogRef = this.dialog.open(CreditorAddFundformComponent, {
      data: { user }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }

  openAddUserDialog() {
    let user: pp_User = new pp_User();
    user.PetrolPumpCode = this.pumpCode;
    user.IsEditModal = false;
    const dialogRef = this.dialog.open(CreditorformComponent, {
      data: { user },
      disableClose: true
    });
  }

  getAllRoles() {
    this.userService.getAllRole().subscribe(data => {
      this.roles = data;
    });
  }
  removeUser(i: number) {
    this.pumpUsers.splice(i, 1);
  }

  ChangePassword(user: pp_User) {
    const dialogRef = this.dialog.open(ChangePasswordComponent, {
      data: { user }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }
  DeleteUser(user: pp_User) {
    if (confirm("Do you want to delete this user?")) {
      this.userService.deleteUser(user).subscribe((res: any) => {
        this.toasterService.pop('success', '', res.Result.toString());
        this.router.navigate(['/pumpDetails',this.pumpCode]);
      },
        (err) => {

        });
      

    }
  }
}
