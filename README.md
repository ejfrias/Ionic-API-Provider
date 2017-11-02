# Ionic-API-Provider
Custom provider to help Ionic communicate with your server via HTTP requests


## How to use
Move the api.ts file on your-app-path/src/providers/
Then add this custom provider to your /src/app/app.modules.ts
```
...
import { API } from '../providers/api';

@NgModule({
	declarations: [
		...
	],
	imports: [
		...
	],
	bootstrap: [IonicApp],
	entryComponents: [CCF],
	providers: [
    API,
    ...
  ]
});
...
```

Finally, this is how to call the api (sample ussage in a page)
```
...
import { API } from '../../providers/api'; //dont forget to import the provider first

...
export class Page {
  constructor (public api: API) {
    let page = 'add-shirt';
    let params = {
      color: 'red',
      size: 'small',
      gender: 'female'
    };
    
    this.api.ajaxRequest(page, params).then(response => {
      console.log(response); //response data should be in json format
    });
  }
}
```
