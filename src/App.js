const FETCH_QUOTES = "FETCH_QUOTES";
const NEW_QUOTE = "NEW_QUOTE";

const initialState = {
  loading: true,
  error: false,
  data: [],
  randomNumber: "",
  colors: [
    "#16a085",
    "#27ae60",
    "#2c3e50",
    "#f39c12",
    "#e74c3c",
    "#9b59b6",
    "#FB6964",
    "#342224",
    "#472E32",
    "#BDBB99",
    "#77B1A9",
    "#73A857"
  ]
};

function quotesReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_QUOTES:
      return {
        ...state,
        loading: false,
        data: action.payload
      };
    case NEW_QUOTE:
      return {
        ...state,
        randomNumber: action.payload
      };
    default:
      return state;
  }
}

const rootReducer = Redux.combineReducers({
  quotes: quotesReducer
});

const preInitialState = {};

const middleware = [ReduxThunk.default];

const store = Redux.createStore(
  rootReducer,
  preInitialState,
  Redux.applyMiddleware(...middleware)
);

const fetchQuotes = () => dispatch => {
  fetch(
    "https://gist.githubusercontent.com/irkreja/5f35dc197c6be4ddc32a45acdd23fcd7/raw/0d9b85d4a9d9da9dc67fa0257df66ed80702ff3a/quotes.json"
  )
    .then(response => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response.json();
    })
    .then(data => {
      //   this.setState({ loading: false, error: false, posts: data });
      dispatch({ type: "FETCH_QUOTES", payload: data.quotes });
    })
    .catch(error => {
      console.log(error);
      //   this.setState({ loading: false, error: true });
    });
};

const newQuote = randomNo => {
  return {
    type: "NEW_QUOTE",
    payload: randomNo
  };
};

class Loading extends React.Component {
  render() {
    return (
      <div className="loading-container">
        <div className="loader-dzg" />
      </div>
    );
  }
}

class RandomQuotes extends React.Component {
  constructor() {
    super();
    this.getNewQuote = this.getNewQuote.bind(this);
  }
  componentDidMount() {
    this.props.fetchQuotes();
    this.getNewQuote();
  }

  getNewQuote() {
    let randomQuoteIndex = Math.floor(Math.random() * 102);
    this.props.newQuote(randomQuoteIndex);
  }
  render() {
    if (this.props.loading) {
      return <Loading />;
    }
    const { quote, author } = this.props.quotes[this.props.randomNumber];
    const randomColor = this.props.randomColor[Math.floor(Math.random() * 11)];
    return (
      <div className="wrapper" style={{ backgroundColor: randomColor }}>
        <div id="quote-box">
          <div className="quote-text">
            <i className="fa fa-quote-left"> </i>
            <q id="text" style={{ color: randomColor }}>
              {quote}
            </q>
          </div>
          <div className="quote-author" style={{ color: randomColor }}>
            -
            <span id="author"> {author}</span>
          </div>
          <div className="buttons">
            <a
              href={
                'https://twitter.com/intent/tweet?hashtags=quotes,freecodecamp&related=freecodecamp&text="' +
                quote +
                '" %0D%0A- ' +
                author +
                "%0D%0A"
              }
              className="button"
              id="tweet-quote"
              title="Tweet this quote!"
              target="_blank"
              style={{ backgroundColor: randomColor }}
            >
              TWEET
            </a>
            <button
              className="button"
              id="new-quote"
              onClick={this.getNewQuote}
              style={{ backgroundColor: randomColor }}
            >
              NEW QUOTE
            </button>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  quotes: state.quotes.data,
  randomNumber: state.quotes.randomNumber,
  loading: state.quotes.loading,
  randomColor: state.quotes.colors
});

function mapDispatchToProps(dispatch) {
  return Redux.bindActionCreators(
    {
      fetchQuotes,
      newQuote
    },
    dispatch
  );
}

const RandomQuotesContainer = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(RandomQuotes);

class App extends React.Component {
  render() {
    return (
      <ReactRedux.Provider store={store}>
        <RandomQuotesContainer />
      </ReactRedux.Provider>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
