import { pp_Tank } from '../_models/pp_Tank';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params, NavigationEnd } from '@angular/router';
import { PetrolPumpService } from '../_services/petrolpump.service';
import { pp_PetrolPump } from '../_models/pp_PetrolPump';
import { pp_User } from '../_models/pp_User';
import { pp_PumpProduct } from '../_models/pp_PumpProduct';
import { TankformComponent } from '../tankform/tankform.component';
import { NozzleformComponent } from '../nozzleform/nozzleform.component';
import { MatDialog } from '@angular/material';
import { UserformComponent } from '../userform/userform.component';
import { ProductDialogFormComponent } from '../productDialog/productDialog.component';
import { pp_Nozzle } from '../_models/pp_Nozzle';
import { UserIdName } from '../_models/UserIdName';
import { pp_Payment } from '../_models/pp_Payment';
import { PaymentDialogFormComponent } from '../paymentDialog/paymentDialog.component';
import { PumpStatus } from '../_models/PumpStatus';
import { debug } from 'util';
import { UserService } from '../_services';
import { AlertService } from '../_services/alert.service';
import { UserDetail } from '../_models/userDetail';
import { CreditorformComponent } from '../creditorform/creditorform.component';
import { InventoryDialogFormComponent } from '../inventoryDialog/inventoryDialog.component';
import { pp_Inventory } from '../_models/pp_Inventory';

@Component({
  selector: 'pump-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashBoardComponent implements OnInit {

  public petrolPumpInfo: pp_PetrolPump;
  public pumpUsers: pp_User[] = new Array<pp_User>();
  public pumpTanks: pp_Tank[] = new Array<pp_Tank>();
  public pumpNozzles: pp_Nozzle[] = new Array<pp_Nozzle>();
  public pumpProduct: pp_PumpProduct[] = new Array<pp_PumpProduct>();
  public pumpProductWithLubesPrise: pp_PumpProduct[] = new Array<pp_PumpProduct>();
  public pumpProductPriceAdjust: pp_PumpProduct[] = new Array<pp_PumpProduct>();
  public pumpPayment: pp_Payment[] = new Array<pp_Payment>();
  public pumpStatus: PumpStatus;
  

  navigationSubscription;
  public petrolPumpCode: string;
  constructor(public dialog: MatDialog, private activatedRoute: ActivatedRoute, private router: Router, private petrolPumpService: PetrolPumpService,private userService: UserService,private alertService: AlertService) {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.petrolPumpCode = params['pumpcode'];
    });
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.ngOnInit();
      }
    });
  }

  ngOnInit() {
    if (this.petrolPumpCode && this.petrolPumpCode != '') {
      //this.getUserInfo();
      this.getPumpInfo(this.petrolPumpCode);
      this.getPumpStatus(this.petrolPumpCode);      
    }
  }

  
  onLinkClick(event) {
  }
  getPumpInfo(pumpCode) {
    this.petrolPumpService.getPetrolPumpDashboard(pumpCode).subscribe(res => {
      this.petrolPumpInfo = res.pp_PetrolPump;
      this.pumpUsers = res.pp_Users;
      this.pumpTanks = res.pp_Tanks;
      this.pumpProduct = res.pp_PumpProduct;
      this.pumpProductWithLubesPrise = res.pp_PumpProductWithLubesPrise;
      //this.pumpProduct = this.pumpProduct.filter(c=>c.CategoryID != 3);
      //this.pumpProductPriceAdjust = this.pumpProduct.filter(c=>c.CategoryID == 1);
      this.pumpNozzles = res.pp_Nozzles;
      this.pumpPayment = res.pp_Payment;
    });
  }
  getPumpStatus(pumpCode) {
    this.petrolPumpService.getPumpStatus(pumpCode).subscribe(res => {
      this.pumpStatus = res;
    });
  }

  openAddTankDialog() {
    let tank: pp_Tank = new pp_Tank();
    tank.PetrolPumpCode = this.petrolPumpCode;
    const dialogRef = this.dialog.open(TankformComponent, {
      data: { tank }
    });
  }
  openAddNozzleDialog() {
    let nozzle: pp_Nozzle = new pp_Nozzle();
    nozzle.PetrolPumpCode = this.petrolPumpCode;
    const dialogRef = this.dialog.open(NozzleformComponent, {
      data: { nozzle }
    });
  }

  openAddUserDialog() {
    let user: pp_User = new pp_User();
    user.PetrolPumpCode = this.petrolPumpCode;
    user.IsEditModal = false;
    const dialogRef = this.dialog.open(CreditorformComponent, {
      data: { user },
      disableClose: true
    });
  }

  openAddProductDialog() {
    let pumpProductNew: pp_PumpProduct = new pp_PumpProduct();
    pumpProductNew.PetrolPumpCode = this.petrolPumpCode;
    pumpProductNew.IsEditModal = false;
    const dialogRef = this.dialog.open(ProductDialogFormComponent, {
      data: { pumpProductNew },
      disableClose: true
    });
  }
  openAddPaymentTypeDialog() {
    let pumpPaymentNew: pp_Payment = new pp_Payment();
    pumpPaymentNew.PetrolPumpCode = this.petrolPumpCode;
    pumpPaymentNew.IsEditModal = false;
    const dialogRef = this.dialog.open(PaymentDialogFormComponent, {
      data: { pumpPaymentNew },
      disableClose: true
    });
  }
  openAddInventoryDialog() {
    let pumpInventoryNew: pp_Inventory = new pp_Inventory();
    pumpInventoryNew.PetrolPumpCode = this.petrolPumpCode;
    pumpInventoryNew.IsEditModal = false;
    const dialogRef = this.dialog.open(InventoryDialogFormComponent, {
      data: { pumpInventoryNew },
      disableClose: true
    });
  }
}
