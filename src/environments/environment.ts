import { isDevMode } from '@angular/core';

export class environment {

    static API_URL: string = isDevMode()? 'http://localhost:3001' :'ERROR';
    static production: Boolean = !isDevMode();
};
