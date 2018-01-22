# Ionic-API-Provider
Custom provider to help Ionic communicate with your server via HTTP requests


## How to use
Move the api.ts file on your-app-path/src/providers/

Then import this API provider and the HttpClientModule to /src/app/app.modules.ts
```javascript
...
import { HttpClientModule } from '@angular/common/http';
import { API } from '../providers/api';

@NgModule({
	declarations: [
		...
	],
	imports: [
		...,
		HttpClientModule
	],
	bootstrap: [IonicApp],
	entryComponents: [MyApp],
	providers: [
		API,
		...
	]
});
...
```

Finally, this is how you call the api (sample ussage in a page)
```javascript
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

		this.api.ajaxRequest(ENDPOINT + page, params).subscribe(response => {
			console.log(response); //response data should be in json format
		});
	}
}
```
