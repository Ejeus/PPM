import { FuelType } from '../_models/FuelType';
import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { pp_Tank } from '../_models/pp_Tank';
import { pp_Nozzle } from '../_models/pp_Nozzle';
import { UserService } from '../_services';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { PetrolPumpService } from '../_services/petrolpump.service';
import { ToasterService } from 'angular2-toaster';
import { Router } from '@angular/router';
import { FormsModule, FormBuilder, FormGroup, Validators, NgControl } from '@angular/forms'
import { Tank } from '../_models/Tank';
import { DatePipe } from '../../../node_modules/@angular/common';
import { UserIdName } from '../_models/UserIdName';

@Component({
  selector: 'nozzleform',
  templateUrl: './nozzleform.component.html',
  styleUrls: ['./nozzleform.component.css']
})
export class NozzleformComponent implements OnInit {

  nozzle: pp_Nozzle = new pp_Nozzle();
  tank: Tank[];
  IsEditDialog: boolean;
  nozzleform: FormGroup;
  fuelTypes: FuelType[];
  newUserIdName: UserIdName[];
  validation_messages = {    
    'Email': [
      { type: 'required', message: 'Email is required' },
      { type: 'email', message: 'Enter a valid email' }
    ],    
    'Password': [
      { type: 'required', message: 'Password is required' },
      { type: 'minlength', message: 'Password must be at least 8 characters long' },
      { type: 'pattern', message: 'Only Alphabets, Numbers, @, &, !, -, _ and . are allowed.' }
    ],
    'UserId': [
      { type: 'required', message: 'UserId is required' },
      { type: 'minlength', message: 'UserId must be at least 5 characters long' }
    ],
    'FuelTypeID': [
      { type: 'required', message: 'Product is required' }
    ],
    'NozzleName': [
      { type: 'required', message: 'Nozzle Name is required' }
    ],
    'ReadingType': [
      { type: 'required', message: 'Reading Type is required' }
    ],
    'Phone': [
      { type: 'required', message: 'Phone is required' },
      { type: 'minlength', message: 'Phone must be at least 10 characters long' },
      { type: 'maxlength', message: 'Phone can be 12 characters long' },
      { type: 'pattern', message: 'Only Numbers are allowed.' }
    ],
    'CreditLimit': [      
      { type: 'pattern', message: 'Only Numbers are allowed.' }
    ]    
  }
  constructor(private toasterService: ToasterService, private router: Router, private userService: UserService, @Inject(MAT_DIALOG_DATA) public data, private pumpService: PetrolPumpService,
    private dialogRef: MatDialogRef<NozzleformComponent>, private _formBuilder: FormBuilder,public datepipe: DatePipe) { }

  ngOnInit() {
    this.nozzle = this.data.nozzle;
    if (this.nozzle.IsEditModal) {
      this.IsEditDialog = true;
    }
    else {
      this.IsEditDialog = false;
    }
    this.getTanksByID(this.nozzle.PetrolPumpCode);
    this.getFuelTypeByID(this.nozzle.PetrolPumpCode);
    this.getIdAndNameForAllUser(this.nozzle.PetrolPumpCode);
    this.nozzleform = this._formBuilder.group({
      ID: [this.nozzle.ID],
      PetrolPumpCode: [this.nozzle.PetrolPumpCode],
      NozzleCode: [this.nozzle.NozzleCode],
      TankID: [this.nozzle.TankID],
      OpeningReading: [this.nozzle.OpeningReading],
      IsEditModal: [this.nozzle.IsEditModal],
      FuelTypeID: [this.nozzle.FuelTypeID],
      NozzleName:[this.nozzle.NozzleName,Validators.compose([Validators.required])],
      ReadingDate:[this.nozzle.ReadingDate],
      AssignedTo:[this.nozzle.AssignedTo]
    });
    let latest_date =this.datepipe.transform(this.nozzle.ReadingDate, 'yyyy-MM-dd');
    this.nozzleform.get('ReadingDate').setValue(latest_date);
    //this.nozzle.pp_Nozzles.length==0 && this.nozzle.pp_Nozzles.push(new pp_Nozzle());
  }
  // getAllFuelType()
  // {
  //   this.userService.getAllFuelType().subscribe(data=>{      
  //     this.fuelTypes=data;
  //   });
  // }

  onChange() {
    //this.getTanksByID(this.nozzle.PetrolPumpCode);
    this.getTanksByIDAndFuelType(this.nozzle.PetrolPumpCode,this.nozzleform.controls['FuelTypeID'].value)
    this.DisableControlsByRole();
  }


  DisableControlsByRole() {
    
    if (this.nozzleform.controls['FuelTypeID'].value == '5') { // 2 for Creditor
      this.nozzleform.controls['TankID'].setValue(0);
      this.nozzleform.controls['TankID'].disable();
      
    }
    else {
      this.nozzleform.controls['TankID'].enable();
    }
  }
  getTanksByIDAndFuelType(petrolPumpCode: string, fuelTypeID:number) {
    this.userService.getTanksByIDAndFuelType(petrolPumpCode,fuelTypeID).subscribe(data => {
      this.tank = data;
    });
  }
  getTanksByID(petrolPumpCode: string) {
    this.userService.getTanksByID(petrolPumpCode).subscribe(data => {
      this.tank = data;
    });
  }

  getFuelTypeByID(petrolPumpCode: string) {
    this.userService.getFuelTypeByID(petrolPumpCode).subscribe(data => {
      this.fuelTypes = data;
      this.fuelTypes = this.fuelTypes.filter(item=>item.Name != 'Lubes - Motor Oil'
      && item.Name != 'Lubes - Gear Oil' && item.Name != 'Lubes - Transmission Fluid' 
      && item.Name != 'Lubes - White Grease' && item.Name != 'Lubes - Electronic Grease');
    });
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

  createNozzle()
  {
    this.pumpService.addUpdatePumpNozzle(this.nozzleform.value).subscribe(res=>{
      this.toasterService.pop('success','',"Saved successfully");
      this.dialogRef.close();
      this.router.navigate(['/pumpDetails',this.nozzle.PetrolPumpCode]);
    })
  }
  // addNozzle()
  // {
  //   this.tank.pp_Nozzles.push(new pp_Nozzle());
  // }
  // removeNozzle(i:number)
  // {
  //   this.tank.pp_Nozzles.splice(i,1);
  // }
}
