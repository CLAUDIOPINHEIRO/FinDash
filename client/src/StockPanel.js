import React, { Component } from 'react';
import { Button, ToggleButton, ToggleButtonGroup, Glyphicon } from 'react-bootstrap';
import StockChart from './StockChart';
import './daterangepicker.css';
let DateRangePicker = require('react-bootstrap-daterangepicker');
let moment = require('moment');

class StockPanel extends Component {
  constructor(props) {
    super(props);
    this.setDates = this.setDates.bind(this);
    this.stockPanel = this.stockPanel.bind(this);
    this.stockChart = this.stockChart.bind(this);
    this.stockCategories = this.stockCategories.bind(this);
    this.stockList = this.stockList.bind(this);
    this.toggleCheckbox = this.toggleCheckbox.bind(this);
    this.selectAllStocks = this.selectAllStocks.bind(this);
    this.toggleNormalization = this.toggleNormalization.bind(this);
    this.toggleStock = this.toggleStock.bind(this);
    this.setStocks = this.setStocks.bind(this);

    this.state = {
      stocks: props.stocks || {},
      displayStocks: [],
      normalized: props.normalized || false,
      startDate: moment("2016-09-01"),
      endDate: moment("2017-08-15")
    };
  }

  componentDidMount() {
    if(Object.keys(this.state.stocks).length === 0){
      fetch('/api/stocks')
        .then(res => res.json())
        .then(stocks => this.setState({ stocks }))
        .then(() => this.setStocks());
    } else {this.setStocks()}
  }

  render() {
    return(
      <div id="stock-panel">

        {this.props.topPanel && this.stockPanel()}

        {this.stockChart(this.state.displayStocks)}

        {this.props.topPanel==null && this.stockPanel()}

      </div>
    );
  }

  stockChart(displayStocks) {

    let start = this.state.startDate.format('YYYY-MM-DD');
    let end = this.state.endDate.format('YYYY-MM-DD');
    let label = start + ' - ' + end;
    if (start === end) { label = start; }
    let newDisplayStocks = displayStocks.toString().split(','); //copy displayStocks to capture differences

    return (
      <div>
        <div className="checkbox align-left"><label style={{textAlign: 'left'}}>
          <input type="checkbox" onChange={this.toggleNormalization} checked={this.state.normalized}/> Relative Performance</label>
        </div>

        <StockChart displayStocks={newDisplayStocks} startDate={start} endDate={end} normalized={this.state.normalized}/>

        <label>Date Range:</label>{' '}
        <DateRangePicker startDate={this.state.startDate} endDate={this.state.endDate} onApply={this.setDates}>
          <Button className="selected-date-range-btn">
            <div className="pull-left"><Glyphicon glyph="calendar" /> <span>{label}</span> <span className="caret"></span></div>
          </Button>
        </DateRangePicker>
      </div>
    )
  }

  setDates(event, picker) {
    this.setState({
      startDate: picker.startDate,
      endDate:   picker.endDate
    });
  }

  stockPanel() {
    return <div className="row">
      {this.stockCategories(this.state.stocks)}
    </div>
  }

  stockCategories(stocks) {
    let categories = Object.keys(stocks);
    let width = (12/categories.length).toString();
    return (categories.map(category =>
      <div key={"category-"+category} className={"col-md-"+width}>
        <h3>{category}</h3>
        <ToggleButtonGroup type="checkbox" className="full-width">
          <ToggleButton id={'all-'+category} value={category} onChange={this.selectAllStocks} block>
            <strong>Select All</strong>
          </ToggleButton>
        </ToggleButtonGroup>
        {this.stockList(stocks[category], this.state.displayStocks)}
      </div>
    ));
  }

  stockList(arr) {
    return (arr.map(elem =>
      <ToggleButtonGroup key={elem.id} type="checkbox" className="full-width margin-top-sm">
        <ToggleButton id={'btn-'+elem.id} value={elem.id} onChange={this.toggleCheckbox} block>
          {elem.name === elem.id ? elem.name : elem.name+" ("+elem.id+")"}
        </ToggleButton>
      </ToggleButtonGroup>
    ));
  }

  toggleCheckbox(event) {
    let stock = event.target.value;
    let add = event.target.checked;
    this.toggleStock(stock, add);
  }

  selectAllStocks(event) {
    let category = event.target.value;
    let displayStocks = this.state.displayStocks;
    this.state.stocks[category].forEach((stock) => {
      if(!displayStocks.includes(stock.id)) displayStocks.push(stock.id)
    });
    this.setState({displayStocks});
  }

  toggleStock(stock, add) {
    this.setState(function(prevState) {
      let displayStocks = prevState.displayStocks.slice(0);
      if (add) {
        displayStocks.push(stock);
      } else {
        let index = displayStocks.indexOf(stock);
        if (index > -1) {
          displayStocks.splice(index, 1);
        }
      }
      return {displayStocks: displayStocks};
    });
  }

  toggleNormalization(event) {
    let normalized = event.target.checked;
    this.setState({normalized});
  }

  setStocks() {
    let displayStocks = [];
    if (this.props.displayStocks){
      let displayStocks = this.props.displayStocks;
      this.setState({displayStocks});
    }
    if(this.props.allSelected){
      let categories = Object.values(this.state.stocks);
      displayStocks = categories.reduce(function(a, b) { return a.concat(b); }, []).map(function(s) {return s.id;});
      this.setState({displayStocks});
    }
  }
}

export default StockPanel;
