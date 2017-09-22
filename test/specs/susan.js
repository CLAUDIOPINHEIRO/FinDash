'use strict';
require('assert');
require('should');
require('mocha-steps');

const url = 'https://findash.mybluemix.net/';

describe('Susan prepares for her meeting with Leo Rakes', () => {

  step('visits the Financial Advisor Dashboard home page', () => {

    // Navigates to the URL
    browser.url(url);

    // Page title and Welcome text
    browser.getTitle().should.be.exactly('React App');
    browser.getText('a=Financial Advisor Dashboard');
    browser.getText('h1=Welcome, Susan!');

    // Big 3 indices with movement indicators
    browser.getText('strong=S&P 500');
    browser.getText('strong=DJIA');
    browser.getText('strong=NASDAQ');
    browser.getHTML('span.glyphicon.glyphicon-arrow-down').should.have.length(2);
    browser.getHTML('span.glyphicon.glyphicon-arrow-up').should.be.a.String();

    // Clients list
    browser.getText('h1=Clients');
    browser.waitForText('p*=Account Balance: ').should.be.true();
    let accBals = browser.getText('p*=Account Balance: ');
    accBals.should.have.a.length(8);
    accBals.should.matchEach((str) => {
      let accBal = parseFloat(str.slice(str.indexOf('$')+1).replace(/,/g, ''));
      accBal.should.be.greaterThan(100000);
    });

    // Calendar
    browser.getText('h1=Calendar');
    let calendar = browser.element('div.rbc-calendar');
    calendar.getText('span.rbc-toolbar-label').should.be.exactly('Wednesday Jul 19');
    calendar.getText('strong=Annual Review with Leo Rakes');
    calendar.getText('p*=Zoom URL: https://zoom.us/j/');

    // Recent Market News
    browser.getText('h2=Recent Market News');
    browser.waitForExist('div.panel.panel-default');
    browser.getText('h3.panel-title').should.containEql('The US dollar will rebound in the second half of 2017, says JPMorgan')

  });

  step('visits the Leo Rakes client page', () => {

    // Click Leo Rakes Button
    let leoLink = browser.element('a[href="/clients/1000016"]');
    leoLink.getText().should.containEql('Leo Rakes');
    leoLink.click();

    // Arrive at Leo Rakes Client Profile
    browser.getText('h2=Client Profile');
    browser.waitForExist('div.xx-large=Leo Rakes');

    // See Client Details
    $('tr*=Gender').getText().should.be.exactly('Gender M');
    $('tr*=Age').getText().should.be.exactly('Age 45-54');
    $('tr*=Annual Income').getText().should.be.exactly('Annual Income $ 392,655.00');
    $('tr*=Education').getText().should.be.exactly('Education Masters');
    $('tr*=Profession').getText().should.be.exactly('Profession Executive');

    $('tr*=Account Type').getText().should.be.exactly('Account Balance Trades per Year Account Type Trading Strategy Trading Style');
    $('tr*=Option').getText().should.be.exactly('$ 654,758.00 6 Option Growth Swing');

    browser.getText('h3=Last Meeting with Leo Rakes: October 24th, 2016');

    // See Industry Affinity
    browser.getText('h3=Predicted Industry Affinity');
    $('thead*=Auto').getText().should.be.exactly('Auto Tech Airlines Hotels');
    $('tbody*=94%').getText().should.be.exactly('94%\n84%\n48%\n31%');
    $('tbody*=94%').$$('span.glyphicon').map(span => span.getAttribute('class')).should.deepEqual(
      ['glyphicon glyphicon-arrow-up',
      'glyphicon glyphicon-arrow-down',
      'glyphicon glyphicon-arrow-down',
      'glyphicon glyphicon-arrow-down']);

    // See Portfolio
    browser.getText('h3=Portfolio');
    let stockPanel = $('div#stock-panel');
    stockPanel.$('div*=Auto').getText().should.equal('Auto\nSelect All\nFerrari NV (RACE)\n' +
      'Tech\nSelect All\nAmazon (AMZN)\nAlphabet (GOOGL)\nApple (AAPL)')

    browser.getText('h2=Stock Analysis');
    $('div.checkbox=Relative Performance').$('input').isSelected().should.be.true();
  });

});