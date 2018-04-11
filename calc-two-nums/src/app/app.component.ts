import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Http, Headers, RequestOptions, Response, RequestOptionsArgs } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'app';
  value1 = null;
  value2 = null;
  value1valid: boolean = false;
  value2valid: boolean = false;
  borderColorVal1 = "inherit";
  borderColorVal2 = "inherit";
  fontWeightVal1 = "normal";
  fontWeightVal2 = "normal";
  inputValid: boolean = true;
  calculatedResults: any;

  constructor(private http: Http) {
    this.getCalculatedResults().subscribe((data) => {
      this.calculatedResults = data;
    },
      error => {
        console.log("Data Fetching Failed");
      });
  }
  public restrictNumberVal1(event: any) {

    var value = event.target.value;

    if (Number(value) && value >= 0) {
      this.borderColorVal1 = "inherit";
      this.fontWeightVal1 = "normal";
      this.value1valid = true;
    } else {
      this.borderColorVal1 = "red";
      this.fontWeightVal1 = "bold";
      this.value1valid = false;
    }

    this.validateSubmitButton();
  }

  public restrictNumberVal2(event: any) {
    var value = event.target.value;
    if (Number(value) && value >= 0) {
      this.borderColorVal2 = "inherit";
      this.fontWeightVal2 = "normal";
      this.value2valid = true;
    } else {
      this.borderColorVal2 = "red";
      this.fontWeightVal2 = "bold";
      this.value2valid = false;
    }
    this.validateSubmitButton();
  }

  validateSubmitButton() {
    if (this.value1valid && this.value2valid) {
      this.inputValid = false;
    } else {
      this.inputValid = true;
    }
  }

  postData() {
    this.insertResults().subscribe((data) => {
      console.log("data inserted");
    },
      error => {
        console.log("Error while inserting data");
      })
    this.value1 = null,
      this.value2 = null
  }

  getCalculatedResults() {
    const url = "http://localhost:3000/getData"
    return this.http.get(url)
      .map(
        (res: Response) => {
          return res.json();
        })
      .catch(this._handlerError);
  }

  insertResults() {
    const url = "http://localhost:3000/saveData"
    let data = {
      "value1": this.value1,
      "value2": this.value2,
      "result": Number(this.value1) * Number(this.value2)
    }
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let optionsArgs: RequestOptionsArgs = {
      headers: headers
    };
    let options = new RequestOptions(optionsArgs);
    return this.http.post(url, data, options).map(
      (res: Response) => res
    )
      .catch(this._handlerError);
  }

  _handlerError(err: any) {
    console.log(err); // log this somewhere and format the message well for devs
    return Observable.throw(err); // our opportunity customize this error
  }
}
