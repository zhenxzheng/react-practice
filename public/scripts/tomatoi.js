var timerHistory = []; // temporary global timerHistory set

/**
 **		Main Component
 **/
var MainBox = React.createClass({
	render: function() {
		return (
			<div className="mainBox">
				<TimerBox />
			</div>
		);
	}
})

/**
 **		Main Timer Componenets
 **
 **/
var TimerBox = React.createClass({
	getInitialState: function() {
		// initial state - timer sets to 0 with empty timer history
		return {time: 0, timerHistory: [], sound: false};
	},

	// timer buttons function - calculates timer end time, updates history array
	timerClick: function (buttonInfo, timestamp){
		// After a timer button is clicked, it provides 2 types of information
		// 1) how many minutes for the timer 2) what type of timer is triggered
		// to display and history components.

		// end time = now(ms) + selected(min) * ms conversion
		var endTime = Date.now()+buttonInfo.value*60*1000; // + 1s for visual

		// update timerHistory array, maximum 8 history items
		if (timerHistory.length = 8) timerHistory.pop();
		timerHistory.unshift({timerType: buttonInfo.children, date: timestamp});

		// refresh display and history list with new data
		this.setState({time: endTime, timerHistory: timerHistory, sound: true});
	},

	// reset button - clears history and set timer back to 0
	resetClick: function(){
		timerHistory = [];
		this.setState({time: 0, timerHistory: timerHistory, sound: false});
	},
	render: function() {
		return (
			<div className="timerBox">
				<div className="timerBtns">
					<Btn id="opmodoro" value="25" onClick={this.timerClick}>Pomodoro</Btn>
					<Btn id="short" value="5" onClick={this.timerClick}>Short Break</Btn>
					<Btn id ="long" value="15" onClick={this.timerClick}>Long Break</Btn>
				</div>
				<CountdownBox time={this.state.time} sound={this.state.sound}/>
				<Btn id="reset" onClick={this.resetClick}>Reset</Btn>
				<HistoryBox timerHistory={this.state.timerHistory}/>
			</div>
		);
	}
});
//	botton component 
var Btn = React.createClass({
	// return all properties info to parent with time of click
	clickHandler: function(){
		this.props.onClick(this.props, new Date());
	},
	render: function() {
		return (
			<p onClick={this.clickHandler} className="button color" id={this.props.id}>
				{this.props.children}
			</p>
		)
	}
})

/**
 **		Countdown display component
 **/
var CountdownBox = React.createClass({
	getInitialState: function(){
		return {elapsed: 0};
	},
	componentDidMount: function(){
		// refresh timer every second
		console.log("test");
		this.timer = setInterval(this.tick, 1000);
	},
	componentWillUnmout: function(){
		clearInterval(this.timer);
	},
	tick: function(){
		// refresh timer if end time is not reached
		if (this.props.time - new Date() > 0){
			this.setState({elapsed: this.props.time - new Date()})
		}
		else {
			if (this.props.sound) {
				document.getElementById('beepSound').play();
				this.props.sound = false;
			}
			this.setState({elapsed:0});
		}
		// console.log(this.state.elapsed);
	},
	render: function() {
		var elapsed = this.state.elapsed/1000;	// converts to second
		var minutes = Math.floor(elapsed/60);	// calculates minutes
		var seconds = Math.floor(elapsed)%60;	// calculates remaining seconds
		// console.log(elapsed);
		return (
			<div className="countdownBox">
				<h1 className="digits">{minutes<10?"0"+minutes:minutes}:{seconds<10?"0"+seconds:seconds}</h1>
				<audio id="beepSound">
					<source src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/41203/beep.mp3"/>
					<source src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/41203/beep.ogg" />
				</audio>
			</div>
		)
	}
})

/**
 **		Timer History Component
 **/
var HistoryBox = React.createClass({
	render: function(){
		return (
			<div className="historyBox">
				<h3 className="historyTitle">Timer History</h3>
				<HistoryList timerHistory={this.props.timerHistory} />
			</div>
		)
	}
})
// Timer History List
var HistoryList = React.createClass({
	render: function(){
		// loops through timer history array to create HistoryItem components
		var historyNodes = this.props.timerHistory.map(function (item){
			return (
				<HistoryItem timerType={item.timerType} date={item.date}/>
			);
		});
		return (
			<div className="historyList">
				{historyNodes}
			</div>
		)
	}
})
// Timer History Item
var HistoryItem = React.createClass({
	getInitialState: function(){
		return {timestamp: "Less than a minute ago"};
	},
	updateTimestamp: function (){
		// checks how long ago the timer was clicked
		var timestamp,
			elapsed = Date.now() - this.props.date.getTime();
		if (elapsed>86400000) { // 86400000 ms = 24 hours
			var days = Math.floor(elapsed/86400000);
			timestamp = "About " + days.toString() + (days>1?" days":" day")+" ago";
		}
		else if (elapsed>3600000){ // 3600000 ms = 1 hour
			var hours = Math.floor(elapsed/3600000);
			timestamp = "About " + hours.toString() + (hour>1?" hours":" hour")+" ago";
		}
		else if (elapsed>60000){ // 60000 ms = 1 min
			var minutes = Math.floor(elapsed/60000);
			timestamp = minutes.toString() + (minutes>1?" minutes":" minute")+" ago";
		}
		else timestamp = "Less than a minute ago";
		//update state with newly calculated timestamp
		this.setState({timestamp: timestamp});
	},
	componentDidMount: function(){
		this.updateTimestamp;
		// update timestamp every minute
		setInterval(this.updateTimestamp, 1000);
	},
	render: function(){
		return (
			<div className="historyItem">
				<p className="timerType">{this.props.timerType}</p>
				<p className="small timestamp">{this.state.timestamp}</p>
			</div>
		)
	}
})
React.render(
	<MainBox />,
	document.getElementById('content')
);