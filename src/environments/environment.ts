import { isDevMode } from '@angular/core';

export class environment {

    static API_URL: string = isDevMode()? 'http://localhost:3000' :'https://groupmeetapp-backend.azurewebsites.net/';
    static production: Boolean = !isDevMode();
};
