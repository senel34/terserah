import React from 'react';
import './css/bootstrap.min.css';
import './RandomRestaurant.css';
import openSocket from 'socket.io-client';

const socket = openSocket();
const header = ['Makan dimana?',
'Where to eat?',
'Dove mangiare?',
'Donde comer?',
'Où manger?',
'Ngendi arep mangan?',
'Tuang dimana?'];

class Header extends React.Component{
	constructor(props){
		super(props);
	}

	render(){
		return(
			<div className="row">
				<div className="col-sm-4"></div>
				<div className="col xs-12 col-sm-4 text-center main-title">
					<h1>Makan dimana ?</h1>
				</div>
				<div className="col-sm-4"></div>
			</div>
		);
	};
}

class RestaurantName extends React.Component{
	render(){
		if(this.props.loading){
			return(
				<div>
					<div className='loader-container'>
						<div className='loader'></div>
					</div>
					<h3 id="restaurant-name">&nbsp;</h3>
					<h4 id="restaurant-address">&nbsp;</h4>
				</div>
			);
		}
		else{
			return(
				<div>		
					<h3 id="restaurant-name">{this.props.restaurant}</h3>
					<h4 id="restaurant-address">{this.props.address}</h4>
				</div>
			);
		}
	}
}

class RestaurantDetail extends React.Component{
	
	constructor(props){
		super(props);
	}

	render(){
		/****************************
		*if restaurant detail fetched
		****************************/
		if(this.props.restaurant){
			return(
				<div>
					<img className="thumbnail" src={this.props.restaurant.thumb}></img>
					<h4>{this.props.restaurant.name}</h4>
					<h4>Cuisine : {this.props.restaurant.cuisines}</h4>
					<a id="zomato-link" target="_blank" href={this.props.restaurant.url}>View on Zomato</a>
					<img className="map-img" src={'data:image/jpeg;base64,' + this.props.restaurant.mapImg}></img>
				</div>
			);
		}
		/****************************
		*if still fetching
		****************************/
		else if(this.props.loading){
			return(
				<div>
					<h2>Fetching details</h2>
				</div>
			);
		}
		/****************************
		*initial state
		****************************/
		else{
			return(<div></div>);
		}
	}
}

class Randomizer extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			loading: false,
			restaurant: "\u00a0",
			address: "\u00a0",
			restaurant_obj: {},
			restaurant_detail: null,
			loadingDetail: false
		};
		this.getRestaurant = this.getRestaurant.bind(this);
		this.getRestaurantDetail = this.getRestaurantDetail.bind(this);
	}

	getRestaurant(){
		if(!navigator.geolocation){
			return alert('Geolocation not supported by your browser');
		}

		navigator.geolocation.getCurrentPosition((position)=>{
			this.setState({
				loading: true
			});
			socket.emit('getRandomFood', {
				latitude: position.coords.latitude,
				longitude: position.coords.longitude
			}, (restaurant)=>{
				this.setState({
					restaurant: restaurant.name,
					address: restaurant.location.address,
					loading: false,
					restaurant_obj: restaurant,
					restaurant_detail: null
				});
			});
		}, function(){
			alert("Unable to fetch location");
		});
	}

	getRestaurantDetail(){
		if(this.state.restaurant_obj){
			this.setState({
				loadingDetail: true
			});
			socket.emit('getMoreDetails', this.state.restaurant_obj, (restaurant_detail)=>{
				this.setState({
					restaurant_detail: restaurant_detail,
					loadingDetail: false
				});
			});
		}
		else{
			alert("Don't know where to eat? Just click Terserah first");
		}
	}

	render(){
		if(this.state.loading){
			return(
				<div className="container">
					<Header/>
					<div className="row">
						<div className="col-sm-4"></div>
						<div className="col xs-12 col-sm-4 text-center">
							<RestaurantName loading={this.state.loading} restaurant={this.state.restaurant} address={this.state.address}/>
						</div>
						<div className="col-sm-4"></div>
					</div>
					<div className="row">
						<div className="col-sm-4"></div>
						<div className="col xs-12 col-sm-4 text-center">
							<button className="btn random-button" id="random-food-btn" onClick={this.getRestaurant} disabled>Loading</button>
						</div>
						<div className="col-sm-4"></div>
					</div>
					<div className="row">
						<div className="col-sm-4"></div>
						<div className="col xs-12 col-sm-4 text-center">
							<RestaurantDetail restaurant={this.state.restaurant_detail} loading={this.state.loadingDetail}/>
						</div>
						<div className="col-sm-4"></div>
					</div>
				</div>
			);		
		}
		else{
			return(
				<div>
					<div className="container">
						<Header/>
						<div className="row">
							<div className="col-sm-4"></div>
							<div className="col xs-12 col-sm-4 text-center">
								<RestaurantName loading={this.state.loading} restaurant={this.state.restaurant} addres={this.state.address}/>
							</div>
							<div className="col-sm-4"></div>
						</div>
						<div className="row">
							<div className="col-sm-4"></div>
							<div className="col xs-12 col-sm-4 text-center">
								<button className="btn btn-primary random-button" id="random-food-btn" onClick={this.getRestaurant}>Terserah</button>
							</div>
							<div className="col-sm-4"></div>
						</div>
						<div className="row">
							<div className="col-sm-4"></div>
							<div className="col xs-12 col-sm-4 text-center">
								<button className="btn btn-danger" onClick={this.getRestaurantDetail}>More Info</button>
							</div>
							<div className="col-sm-4"></div>
						</div>
					</div>
					<div className="row">
						<div className="col-sm-4"></div>
						<div className="col xs-12 col-sm-4 text-center">
							<RestaurantDetail restaurant={this.state.restaurant_detail} loading={this.state.loadingDetail}/>
						</div>
						<div className="col-sm-4"></div>
					</div>
				</div>
			);
		}
	}
}
			
export default Randomizer;