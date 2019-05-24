import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { mapDispatchToProps, mapStateToProps } from './state-dispatch-map';
import '../../../styles/search-history.css';

class SearchHistory extends React.Component {

    static propTypes = {
        items: PropTypes.arrayOf(PropTypes.shape({
            name: PropTypes.string,
            createdDate: PropTypes.string
        }))
    };

    constructor(props) {
        super(props);
    }

    // handlers



    // methods

    render() {
        const { items } = this.props;

        return (
            <section className='search-history'>
                <header>
                    <h1>Search history</h1>
                    {Boolean(items.length) && (
                        <div className='clear-history-btn-wrap'>
                            <span className='clear-history-btn'>Clear search history</span>
                        </div>
                    )}
                </header>
                <footer>
                    {items.length ? (
                        <p>123</p>
                    ) : (
                        <p className='empty-list-message'>There are no saved items yet</p>
                    )}
                </footer>
            </section>
        );
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(SearchHistory);