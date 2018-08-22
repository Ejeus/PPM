import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { pp_PetrolPump } from '../_models/pp_PetrolPump';
import { PetrolPumpService } from '../_services/petrolpump.service';
import { ToasterService } from 'angular2-toaster';


@Component({
  selector: 'pump-info',
  templateUrl: './pump-info.component.html',
  styleUrls: ['./pump-info.component.css']
})
export class PumpInfoComponent implements OnInit {
  @Input() petrolPump: pp_PetrolPump;
  pumpInfoForm: FormGroup;
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
    'PetrolPumpName': [
      { type: 'required', message: 'Petrol Pump Name is required' },
      { type: 'minlength', message: 'Petrol Pump Name must be at least 3 characters long' },
      { type: 'pattern', message: 'Only Alphabets, Numbers, @ and & are allowed.' }
    ],
    'OwnerName': [
      { type: 'required', message: 'Owner Name is required' },
      { type: 'minlength', message: 'Owner Name must be at least 3 characters long' },
      { type: 'pattern', message: 'Only Alphabets, Numbers and spaces are allowed.' }
    ],
    'Mobile': [
      { type: 'required', message: 'Mobile is required' },
      { type: 'minlength', message: 'Mobile must be at least 10 characters long' },
      { type: 'maxlength', message: 'Mobile can be 12 characters long' },
      { type: 'pattern', message: 'Only Numbers are allowed.' }
    ],
    'PetrolPumpPincode': [
      { type: 'required', message: 'Pincode is required' },
      { type: 'minlength', message: 'Pincode must be 6 characters long' },
      { type: 'maxlength', message: 'Pincode must be 6 characters long' },
      { type: 'pattern', message: 'Only Numbers are allowed.' }
    ],
    'TIN': [
      { type: 'required', message: 'TIN is required' },
      { type: 'minlength', message: 'TIN must be 11 characters long' },
      { type: 'maxlength', message: 'TIN must be 11 characters long' },
      { type: 'pattern', message: 'Only Numbers are allowed.' }
    ],
    'CST': [
      { type: 'required', message: 'CST is required' },
      { type: 'minlength', message: 'CST must be 11 characters long' },
      { type: 'maxlength', message: 'CST must be 11 characters long' },
      { type: 'pattern', message: 'Only numbers are allowed.' }
    ],
    'LicenseStartDate':[
      {type: 'required', message: 'License Start Date is required' }
    ],
    'LicenseEndDate':[
      {type: 'required', message: 'License End Date is required' }
    ]
  }
  constructor(private toasterService: ToasterService,private _formBuilder: FormBuilder,private router: Router,private petrolPumpService: PetrolPumpService) { 
    
  }

  ngOnInit() {
    this.pumpInfoForm = this._formBuilder.group({
      PetrolPumpCode:[this.petrolPump.PetrolPumpCode],
      PetrolPumpName: [this.petrolPump.PetrolPumpName,Validators.compose([ Validators.required,Validators.minLength(3),Validators.pattern('^[a-zA-Z0-9@&]*$')])],
      PetrolPumpPincode:[this.petrolPump.PetrolPumpPincode,Validators.compose([ Validators.required,Validators.minLength(6),Validators.maxLength(6),Validators.pattern('^[0-9]*$')])],
      OwnerName: [this.petrolPump.OwnerName,Validators.compose([ Validators.required,Validators.minLength(3),Validators.pattern('^[a-zA-Z0-9\\s]*$')])],
      Logo: [this.petrolPump.Logo],
      Address: [this.petrolPump.Address],
      Mobile: [this.petrolPump.Mobile, Validators.compose([ Validators.required,Validators.minLength(10),Validators.maxLength(12),Validators.pattern('^[0-9]*$')])],
      Email: [this.petrolPump.Email,Validators.compose([Validators.required,Validators.email])],
      TIN: [this.petrolPump.TIN, Validators.compose([ Validators.minLength(11),Validators.maxLength(11),Validators.pattern('^[0-9]*$')])],
      CST: [this.petrolPump.CST, Validators.compose([ Validators.minLength(11),Validators.maxLength(11),Validators.pattern('^[0-9]*$')])],
      LicenseStartDate: [this.petrolPump.LicenseStartDate, Validators.required],
      LicenseEndDate: [this.petrolPump.LicenseEndDate, Validators.required]
})
  }
  
  savePumpInfo(){
    this.petrolPumpService.updatePetrolPumpInfo(this.pumpInfoForm.value).subscribe(res=>{
      this.toasterService.pop('success','','Pump details updated successfully.');
    });
  }
}