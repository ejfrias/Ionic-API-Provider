import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import 'rxjs/add/operator/retry';


@Injectable()
export class API {

	public apiPath: string = 'https://www.your-server.com/api.php?q=';
	public ajaxType: string = 'Post'; //use post request in production
	public appVersion: string = '1.0.1'; //app version, to cross check the user's app version to prompt them to update when they have outdated version
	public app: number = 0; //if the user is using a native = 1 or browser = 0
	public params: Object = {}; //parameters to be sent

	constructor( public http: Http ){
		//see whether the app runs on native or just on a browser
		this.app = (this.platform.is('cordova') ? 1 : 0);

		//set request URL based on the app environment
		if( document.URL.indexOf('localhost') != -1 ){
			//for local development
			this.ajaxType = 'Get';
			this.apiPath = 'http://localhost/api.php?q=';
		}

		//define default/custom parameters
		this.params = {
			app: this.app,
			version: this.appVersion,
			deviceId: '',
			deviceVersion: '',
			devicePlatform: '',
		};
	}

	/**
	 * Send request to API server
	 * @params
	 * page string the end point or page that we are requesting
	 * data object additional parameters
	 */
	ajaxRequest( page: string, data: any = '' ){
		let params = this.params; //set parameters
		let requestUrl = this.apiPath + page; //set URL to send request
		let requestParams = new HttpParams;

		//merge the parameters and the provided data
		if( data != '' ){
			params = Object.assign({}, data, params);
		}
		
		//set parameters
		Object.keys(params).forEach(key => {
			requestParams.set(key, params[key]);
		});

		//convert parameters into a string
		params = Object.keys(params).map(function(key) {
			return key + '=' + encodeURIComponent(params[key]);
		}).join('&');
		
		//attach parameters to the url if we are on localhost
		if( this.ajaxType == 'Get' ){
			requestUrl += '&' + params;
		}

		//set necessary HTTP options
		let requestOptions: {
			headers: new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}),
			withCredentials: true,
			params: requestParams,
			body: params
		};
		
		//send request, on failure retry up to three times
		return this.http.request(this.ajaxType, requestUrl, requestOptions).retry(3);
	}

	/**
	 * Use this function when sending a request that comes with files
	 * @params
	 * page string the end point or page that we are requesting
	 * data object additional parameters
	 */
	postRequestWithFile( page: string, data: any = '' ){
		let params = ''; //set parameters
		let requestUrl = this.apiPath + page; //set URL to send request

		//merge the parameters and the provided data using the FormData.set function
		if( data == '' ){
			data = new FormData();
		}
		
		Object.keys(this.params).forEach(key => {
			data.set(key, this.params[key]);
		});
		
		params = data;

		let requestOptions: Object = {
			headers: new HttpHeaders({ 'Accept': 'application/json' }),
			withCredentials: true,
			body: params
		};

		//send request using post, on failure retry up to three times
		return this.http.post(requestUrl, params, requestOptions).retry(3);
	}
}
