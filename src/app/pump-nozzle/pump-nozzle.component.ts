

import { UserService } from "../_services/user.service";
import { Component, OnInit, Input } from "@angular/core";
import { FormDataService } from "../_services/pumpRegister.service";
import { Router } from "@angular/router";
import { pp_Tank } from "../_models/pp_Tank";
import { pp_Nozzle } from "../_models/pp_Nozzle";
import { MatDialog } from "@angular/material";
import { TankformComponent } from "../tankform/tankform.component";
import { FuelType } from "../_models/FuelType";
import { Tank } from '../_models/Tank';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NozzleformComponent } from "../nozzleform/nozzleform.component";
import { ToasterService } from 'angular2-toaster';
import { UserIdName } from "../_models/UserIdName";

@Component({
  selector: "pump-nozzle",
  templateUrl: "./pump-nozzle.component.html",
  styleUrls: ["./pump-nozzle.component.css"]
})
export class PumpNozzleComponent implements OnInit {
  @Input() pumpNozzle: pp_Nozzle[]; 
  fuelTypes:FuelType[];
  tank: Tank[];
  newUserIdName: UserIdName[];
  public isCollapsed = false;
  @Input() pumpCode:string;
  constructor(
    public dialog: MatDialog, private userService:UserService,private router:Router, private toasterService: ToasterService
  ) {}

  ngOnInit() {  
    //this.getAllFuelType();
    //this.getAllProducts();
    this.getTanksByID(this.pumpCode);
    this.getIdAndNameForAllUser(this.pumpCode);
  }  

  getAllFuelType()
  {
    this.userService.getAllFuelType().subscribe(data=>{      
      this.fuelTypes=data;
    });
  }
  getTanksByID(petrolPumpCode: string) {
    this.userService.getTanksByID(petrolPumpCode).subscribe(data => {
      this.tank = data;
    });
  }

  getAllProducts()
  {
    this.userService.getAllProducts().subscribe(data=>{      
      this.fuelTypes=data;
    });
  }

  getTankFuelType(fuelTypeID:number){    
    var fuelType=this.fuelTypes.find(c=>c.ID==fuelTypeID);
    return fuelType ? fuelType.Name:'';
  }

  getTankName(tankID:number){    
    var tankName=this.tank.find(c=>c.ID==tankID);
    return tankName ? tankName.Name:'';
  }

  getUserName(userIDPara:number){   
    var user=this.newUserIdName.find(c=>c.ID==userIDPara);
    return user ? user.UserId:'';
  }

  editNozzle(nozzle: pp_Nozzle) {
    nozzle.IsEditModal = true;
    const dialogRef=this.dialog.open(NozzleformComponent,{
      data: {nozzle}
    });
    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
     });
  }
  DeleteNozzle(nozzle: pp_Nozzle) {
    if (confirm("Do you want to delete this Nozzle?")) {
      this.userService.deleteNozzle(nozzle).subscribe((res: any) => {
        this.toasterService.pop('success', '', res.Result.toString());
        this.router.navigate(['/pumpDetails', this.pumpCode]);
      },
        (err) => {

        });
    }
  }
  getIdAndNameForAllUser(petrolPumpCode: string) {
    this.userService.getUserListByID(petrolPumpCode).subscribe(data => {
      this.newUserIdName = data;
      // this.fuelTypes = this.fuelTypes.filter(item=>item.Name != 'Lubes - Motor Oil'
      // && item.Name != 'Lubes - Gear Oil' && item.Name != 'Lubes - Transmission Fluid' 
      // && item.Name != 'Lubes - White Grease' && item.Name != 'Lubes - Electronic Grease');
    });
  //  this.newUserIdName = this.user.map(item => {
  //    return { ID: item.ID, Name: item.UserId };
  //  });
  //  return this.newUserIdName;
 }
}
