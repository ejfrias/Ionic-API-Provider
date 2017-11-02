import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, RequestMethod } from '@angular/http';
import 'rxjs/add/operator/map';


@Injectable()
export class API {

	public apiPath: string = 'https://www.your-server.com/api.php?q=';
	public ajaxType: string = 'Post'; //use post request in production
	public appVersion: string = '1.0.1';
	public app: number = 0;
	public params: Object = {};

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

		//merge the parameters and the provided data
		if( data != '' ){
			params = Object.assign({}, data, params);
		}

		//convert parameters into a string
		params = Object.keys(params).map(function(key) {
			return key + '=' + encodeURIComponent(params[key]);
		}).join('&');

		//set necessary HTTP options
		let requestOptions: RequestOptions = new RequestOptions({
			withCredentials: true,
			method: RequestMethod[this.ajaxType],
			headers: new Headers({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}),
			body: params
		});

		//attach parameters to the url if we are on localhost
		if( this.ajaxType == 'Get' ){
			requestUrl = this.apiPath + page + '&' + params;
		}
		
		//send request
		return new Promise(resolve => {
			this.http.request(requestUrl, requestOptions).map(response => response.json()).subscribe(data => {
				resolve(data);
			});
		});
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
		if( data != '' ){
			for( let key in this.params ){
				data.set(key, params[key]);
			}
			params = data;
		}

		let requestOptions: RequestOptions = new RequestOptions({
			withCredentials: true,
			headers: new Headers({ 'Accept': 'application/json' }),
			body: params
		});

		//send request using post
		return new Promise(resolve => {
			this.http.post(requestUrl, params, requestOptions).map(response => response.json()).subscribe(data => {
				resolve(data);
			});
		});
	}
}
