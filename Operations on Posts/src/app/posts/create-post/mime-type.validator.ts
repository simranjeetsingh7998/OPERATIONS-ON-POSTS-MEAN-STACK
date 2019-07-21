import { AbstractControl } from '@angular/forms';
import { Observable, Observer, of } from 'rxjs';

//to check the format of the file and the content in that file
// all validators are functions which read in the control value and return the information that is valid or not
export const mimeType = 
    (control: AbstractControl): 
    Promise<{[key: string]: any}> | Observable<{[key: string]: any}> => {
    if(typeof(control.value) === 'string') {
        return of(null);
    }
    const file = control.value as File;
    const fileReader = new FileReader();
    const frObs = Observable.create((observer: Observer<{[key: string]: any}>) => {
        fileReader.addEventListener("loadend" , () => {  // loadend has more information about the file that onLoad
            const arr = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0, 4);  //allows us to access or to read certain patterns in the file and also in the meta data that we can then use to parse the mime type 
            let header = "";
            let isValid = false;
            for (let i = 0; i < arr.length; i++) {
                header += arr[i].toString(16); // fro converting it to the hexadecimal string
            }
            switch (header) {
                case "89504e47":
                    isValid = true;
                    break;
                case "ffd8ffe0":
                case "ffd8ffe1":
                case "ffd8ffe2":
                case "ffd8ffe3":
                case "ffd8ffe8":        
                    isValid = true;
                    break;
                default:
                    isValid = false;
                    break;    
            }
            if(isValid) {
                observer.next(null);
            }
            else {
                observer.next({ inValidMimeType: true });
            }
            observer.complete();
        });
        fileReader.readAsArrayBuffer(file);
    });
    return frObs;
};