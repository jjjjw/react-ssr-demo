var Immutable = require('immutable');
var React = require('react');
var Route = require('react-router').Route;
var Router = require('react-router');

var App = React.createClass({

  render () {
    return (
      <div className='app'>
        {this.props.data.get('message')}
      </div>
    );
  }
});

var routes = (
  <Route path="/hello" handler={App} />
);

var App = module.exports = {

  /** Initialize with the necessary page data **/
  initialize (pageData) {
    this.pageData = Immutable.fromJS(pageData);
  },

  /** Render a live React component into the DOM (browser) **/
  render (domNode) {
    Router.run(routes, Router.HistoryLocation, Handler => {
      React.render(<Handler data={this.pageData}/>, domNode);
    });
  },

  /** Render static markup (server) **/
  renderHtml (path, cb) {
    Router.run(routes, path, Handler => {
      cb(React.renderToString(<Handler data={this.pageData}/>));
    });
  }
};

/** If the context is a browser, render the app **/
if (typeof window !== 'undefined') {
  var pageData = JSON.parse(document.getElementById('page-data').getAttribute('data-page'));
  App.initialize(pageData);
  App.render(document.getElementById('app-container'));
}
