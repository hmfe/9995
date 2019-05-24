import React from 'react';
import { connect } from 'react-redux';
import debounce from 'lodash.debounce';
import PropTypes from 'prop-types';

import { mapDispatchToProps, mapStateToProps } from './state-dispatch-map';
import Loader from '../Loader';
import Highlighted from './Highlighted';
import '../../../styles/search.css';

const RESULTS_HEIGHT_FETCHING = 29;
const RESULTS_HEIGHT = 160;
const RESULTS_HEIGHT_DEFAULT = 0;
const DEBOUNCE_VALUE = 500;
const ANIMATION_DURATION = 500;

class Search extends React.Component {

    static propTypes = {
        queryString: PropTypes.string,
        isFetching: PropTypes.bool,
        isActive: PropTypes.bool,
        items: PropTypes.arrayOf(PropTypes.string),

        toggleActive: PropTypes.func,
        toggleFetching: PropTypes.func,
        makeSearch: PropTypes.func,
        setItems: PropTypes.func,
        saveSearchItem: PropTypes.func,
        setQueryString: PropTypes.func,
    };

    constructor(props) {
        super(props);

        this.timer = null;
        this.state = {
            animating: false
        };
    }

    // lifecycle

    componentWillUnmount() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
    }

    // handlers

    onBlurHandler() {
        this.props.setItems([]);
        this.props.toggleActive(false);
    }

    onClearClickHandler() {
        this.resetSearch();
    }

    onSearchItemClickHandler(item) {
        this.props.saveSearchItem({
            name: item,
            createdDate: (new Date()).toISOString()
        });
        this.props.setQueryString(item);
    }

    onChangeHandler(evt) {
        const val = evt.target.value;

        this.props.setQueryString(val);

        if (val) {
            this.props.toggleActive(true);
            this.props.toggleFetching(true);
            this.makeSearch(val);
        }
        else {
            this.performEmptyInputAnimation();
            this.resetSearch();
        }
    }

    // methods

    performEmptyInputAnimation() {
        this.setState({ animating: true });
        this.timer = setTimeout(() => {
            this.setState({ animating: false });
            this.timer = null;
        }, ANIMATION_DURATION);
    }

    makeSearch = debounce(value => {
        this.props.makeSearch(value);
    }, DEBOUNCE_VALUE);

    resetSearch() {
        this.props.setQueryString('');
        this.props.setItems([]);
        this.props.toggleActive(false);
    }

    calculateSearchResultHeight() {
        const {
            isActive,
            isFetching,
            queryString,
            items
        } = this.props;

        if (
            isActive && (
                isFetching ||
                (
                    queryString &&
                    !items.length
                )
            )
        ) {
            return RESULTS_HEIGHT_FETCHING;
        }

        if (isActive && items.length) {
            return RESULTS_HEIGHT;
        }

        return RESULTS_HEIGHT_DEFAULT;
    }

    isSearchResultVisible() {
        const {
            isActive,
            queryString,
            isFetching,
            items
        } = this.props;

        return isActive && (
            isFetching ||
            items.length ||
            (
                !items.length &&
                queryString
            )
        );
    }

    renderSearchResult() {
        const {
            isFetching,
            items,
            queryString
        } = this.props;

        if (isFetching) {
            return <Loader />;
        }

        if (items.length) {
            return (
                <>
                    {items.map((item, idx) => (
                        <div
                            key={idx}
                            className='search-item'
                            onMouseDown={() => this.onSearchItemClickHandler(item)}
                        >{Highlighted(item, queryString)}</div>
                    ))}
                </>
            )
        }

        if (!items.length && queryString) {
            return <span className='empty-result'>No items were found</span>;
        }
    }

    render() {
        const { queryString } = this.props;

        return (
            <section className={`search-section ${this.state.animating ? 'animating' : ''}`} role='search'>
                <header>
                    <form>
                        <fieldset>
                            <label htmlFor='query'>
                                <div className='search-input'>
                                    <input
                                        type='search'
                                        name='query'
                                        id='query'
                                        placeholder='Type to search the movie...'
                                        maxLength='200'
                                        value={queryString}
                                        autoComplete='off'

                                        onBlur={this.onBlurHandler.bind(this)}
                                        onChange={this.onChangeHandler.bind(this)}
                                    />
                                    <span
                                        onClick={this.onClearClickHandler.bind(this)}
                                        className={`clear-btn ${queryString.length ? 'visible' : '' }`}
                                    />
                                </div>
                            </label>
                        </fieldset>
                    </form>
                </header>
                <footer
                    className={`search-result-wrap ${this.isSearchResultVisible() ? 'visible' : ''}`}
                    style={{ height: this.calculateSearchResultHeight() }}
                >
                    {this.renderSearchResult()}
                </footer>
            </section>
        )
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(Search);