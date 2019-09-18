import React from 'react';
import ComposeFormContainer from './containers/compose_form_container';
import NavigationContainer from './containers/navigation_container';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { mountCompose, unmountCompose } from '../../actions/compose';
import { Link } from 'react-router-dom';
import { injectIntl, defineMessages } from 'react-intl';
import SearchContainer from './containers/search_container';
import Motion from '../ui/util/optional_motion';
import spring from 'react-motion/lib/spring';
import SearchResultsContainer from './containers/search_results_container';
import { changeComposing } from '../../actions/compose';
import { mascot } from '../../initial_state';
import Icon from 'mastodon/components/icon';

const messages = defineMessages({
  start: { id: 'getting_started.heading', defaultMessage: 'Getting started' },
  home_timeline: { id: 'tabs_bar.home', defaultMessage: 'Home' },
  notifications: { id: 'tabs_bar.notifications', defaultMessage: 'Notifications' },
  public: { id: 'navigation_bar.public_timeline', defaultMessage: 'Federated timeline' },
  community: { id: 'navigation_bar.community_timeline', defaultMessage: 'Local timeline' },
  preferences: { id: 'navigation_bar.preferences', defaultMessage: 'Preferences' },
  logout: { id: 'navigation_bar.logout', defaultMessage: 'Logout' },
  compose: { id: 'navigation_bar.compose', defaultMessage: 'Compose new post' },
});

const mapStateToProps = (state, ownProps) => ({
  columns: state.getIn(['settings', 'columns']),
  showSearch: ownProps.multiColumn ? state.getIn(['search', 'submitted']) && !state.getIn(['search', 'hidden']) : ownProps.isSearchPage,
});

let instanceMascot;
if (mascot) {
  instanceMascot = <img alt='' draggable='false' src={mascot} />;
} else {
  instanceMascot = <svg xmlns="http://www.w3.org/2000/svg" id="hometownlogo" viewBox="0 0 611.55 611.55" preserveAspectRatio="xMidYMid meet" x="0px" y="0px" width="100%" height="100%"><title>hometown logo</title><g data-name="Layer 2"><g data-name="Layer 1" transform="translate(150,80)"><path d="M8.6,418.79c-1.72-3.08-9-6.32-3.29-13.45.32-.39-.17-1.5-.4-2.25-8.14-25.94-4.57-51.95-.63-78,3.64-24.12,6.89-48.3,10.61-72.4q7.09-45.93,14.72-91.8c4.9-29.18,13.27-57.26,31.05-81.43,16.69-22.69,34.24-44.71,61.7-55.72,1.85-.74,3.57-4.22,3.66-6.49.5-12.91,7.79-19,20.51-16.83,9.3,1.56,17.1,4.46,19.91,15,.63,2.37,4.14,4.77,6.82,5.64,13.52,4.42,25.24,11.15,34.81,22,5,5.62,12,9.39,17.45,14.6,22.8,21.64,37.27,48.64,48.11,77.64,7.24,19.36,14.33,38.89,19.58,58.85,8.26,31.45,15.16,63.22,14.46,96.2-.29,13.58,1.95,27.21,2.45,40.84.49,13.37.12,26.77.35,40.15.08,5,1.22,10,1.06,14.91-.13,4.16-1.53,8.28-2.21,12.44-.37,2.29-1,4.76-.48,6.92,1.64,7-1.13,11.43-7.67,13.23-7.28,2-14.68,4.14-22.16,4.8-22.45,2-45.31,1.33-67.36,5.29-29,5.2-57.74,2.16-86.53,1.06-28-1.06-55.89-3.8-83.8-6.2-5.67-.48-11.14-3-16.81-4C20,419,15.24,419.16,8.6,418.79Zm199.73-28c30.66-.77,59.79-1.33,88.9-2.54,2.16-.09,5.84-4.69,5.92-7.28.43-14.93.3-29.9-.24-44.83-.45-12.32-2-24.59-2.59-36.9-1.28-27.77-2.89-55.19-8.95-82.75C282,174,268.32,133.67,247.28,95.83,238.13,79.39,226.2,65.09,210.73,54c-5.29-3.82-9.56-9.12-15-12.66A134.13,134.13,0,0,0,171.65,28.4c-2.27-.88-6.61,3.64-10,5.59a8.15,8.15,0,0,1-2.3.55c-9.12,2.08-18.11,3.49-26.17-3.31-1-.84-3.17-1.46-4.17-.95-6.51,3.33-13.43,6.25-19.1,10.73A223.25,223.25,0,0,0,86.4,62.74c-16,16.85-29.85,35.56-37.56,57.43-6.06,17.18-9.23,35.48-12.57,53.49-4.08,21.91-7.1,44-10.38,66.08-3,20-5.29,40.05-8.58,60-4.11,24.88-9.62,49.57-8.16,75,.68,11.78,3.11,13.68,15.05,14,8.6.22,17.16,1.83,25.76,2.16,10.35.39,20.73.09,33.09.09-7.84-52.47-18-103.39-18.22-155l25.4-2.64c-2.56-14.29-5.58-27.05-7-40-2-18.65-1.18-37.33,5.2-55.21,1.16-3.25,5-5.53,7.61-8.26,2.64,2.57,5.71,4.85,7.8,7.81,1.59,2.26,1.7,5.5,2.9,8.11,3.48,7.62,7.16,15.13,10.77,22.69l2.16-.79c1-4.35,2.52-8.66,2.81-13.06,1.34-20.3,8.41-38.88,16.69-57.1,1.39-3.05,4.09-5.5,6.19-8.23,1.63,2.82,3.29,5.63,4.89,8.46.78,1.37,1.47,2.79,2.18,4.19,3.34,6.53,8.32,12.73,9.67,19.65,3.46,17.65,15.36,33.28,12.56,52.71a48.1,48.1,0,0,0,5.83-7.19c2-2.76,4-5.55,6.14-8.15,4.17-5,14.55-7.23,21.13-4.66s3.29,8.58,4.08,13.09c.45,2.56-.19,5.3.19,7.89,1.84,12.61,2.18,25-1.7,37.47-2.46,7.87-3.92,16-6,24.62,7.29.81,14,.84,20.2,2.52,3.46.93,8,4.11,8.83,7.14,1.34,5.1.68,11-.22,16.36-3.09,18.57-6.49,37.09-10.06,55.58-4,21-4.42,42.83-13.64,62.74C208.58,383.68,208.87,386.21,208.33,390.75Zm-77.49-1.64c10.8,0,21.35.27,31.86-.18a11,11,0,0,0,7.37-4.09,95.84,95.84,0,0,0,8.71-14.94c4.31-8.85,11.89-12.7,20.95-12.75,6.62,0,8.68-3.09,10-8.58,1.93-7.77-2.89-11.67-8.12-15.5-14.67-10.76-15.93-29.57-7.9-43.85,3.43-6.09,9.28-11.07,17.24-10.77,3.53.13,7,1.57,10.46,2.41,1.83-5.89,4.11-11.26,5.05-16.86.84-5.08,1.41-10.85-.3-15.4-.77-2-7.45-1.83-11.44-2.66-.77-.16-1.52-.47-2.3-.57-18.66-2.53-37.25-5.89-56.24-2.57a45.12,45.12,0,0,1-15.76.16c-8.38-1.57-16.36-3.48-22.83,6.08-4.12-9.13-10.41-10.85-18.44-7.58-.83.34-2.06-.5-3.07-.42-6.44.48-12.93.76-19.27,1.85-1.37.23-3.21,3.52-3.14,5.35.32,9.66,1.6,19.3,1.71,29,.07,6.6,3.07,9.44,8.79,12.06,22.77,10.47,20.39,41.17,7.07,51.82-6.55,5.24-6.73,9.48-3.45,15.63C106.21,355.83,121.11,366.9,130.84,389.11ZM11.1,394.16c-.41,8.87,1.12,15.67,9.58,18,8.08,2.24,16.27,4.82,24.55,5.45,37.4,2.85,74.81,5.85,112.28,7.16,18.52.65,37.16-2.34,55.75-3.54,23.13-1.49,46.28-2.54,69.38-4.33,14.46-1.12,21.77-6.72,16.33-20.74-27,0-54-.41-81.08.21-10.69.24-21,2.43-32.15,1.38-15.27-1.45-30.94,2-46.4,1.7-32.63-.61-65.24-2.22-97.86-3.53C31.55,395.53,21.63,394.78,11.1,394.16ZM151.27,234.71l2.62-.2c1.27-4.31,2.55-8.61,4.13-14-5.29,2-9.51,3.91-9.72-3.22-.48-16.79-.68-33.61-1.8-50.37-1.09-16.31-3.18-32.55-4.82-48.82-9,8.47-9.38,19.39-11.88,29.5s-4.68,20.26-6.7,30.45a10.3,10.3,0,0,0,1,6.32c5.12,9.73,10.57,19.29,15.81,28.95C143.8,220.43,147.5,227.59,151.27,234.71Zm-7.34,2.18c-15.88-32.65-31-63.78-46.65-96C91.94,149.3,96,156,99,161.68c10.39,19.86,16.21,40.82,18.51,63,.37,3.62,3,9,5.85,9.94C129.36,236.62,136.15,236.21,143.93,236.89Zm4-133-1.29.5c3.19,36.94,6.38,73.87,9.54,110.39,4.34-10,8.62-19.69,12.8-29.46.59-1.38,1.23-3.09.94-4.46-3.16-15-5.9-30.19-10-45C156.85,125,152,114.53,147.9,103.88Zm42.22,66.82-2.64-.69c-12.52,17.39-24.33,35-24.73,57.88-.08,5.06,2.19,6.64,6.49,6.66,4.11,0,9.29,2.6,10.59-4.48,2.07-11.32,4.5-22.58,6.5-33.91C187.82,187.72,188.87,179.19,190.12,170.7ZM93.34,160.6l-4.12.92c1.1,16.33,1.67,32.72,3.55,48.95.76,6.55,3.77,13.11,7,19,1.24,2.22,6,2.75,9.31,3.27.5.09,2.71-4.19,2.37-6.14-2.32-13.41-4.51-26.9-8-40C101.16,177.6,96.8,169.22,93.34,160.6Zm107.68.58-3,.9c-1.56,8.71-3.31,17.4-4.65,26.14-2,12.95-3.54,26-5.64,38.9-.54,3.31-3.08,6.62,2.19,8.1,4.6,1.28,7-.53,8.95-5,9-20.24,9.27-41.23,6.14-62.55C204.65,165.36,202.39,163.34,201,161.18Zm11.83,171.94c1.34-7.5,2.33-13.37,3.46-19.22,1.18-6.15,2.92-12.24,3.54-18.44.28-2.93-.6-7.37-2.59-8.74-2.16-1.48-7.11-1.42-9.3.14-7.34,5.24-12.32,12.45-11.59,22C197.16,319.17,201.86,327.15,212.85,333.12ZM88.62,364.64c4.87,29,3.25,27.67,31.31,25.12A28.28,28.28,0,0,0,88.62,364.64Zm-11.88-71.1c2.1,14.81,4,27.91,6,41.86C96.42,322.5,96.09,302,76.74,293.54ZM147.2,27.83c8.76-.21,10.63-2,10.39-9.81-.2-6.51-5-10-13.47-9.3-4.62.4-8.84,2.19-8.92,8C135.1,23.92,139.58,28,147.2,27.83ZM178.88,388c16.74.49,23.93-6,25.25-22.11C194.24,364.21,184.12,372.9,178.88,388Z"/><path d="M262.51,237.49c-1.15-2.32-3.13-4.56-3.34-7a365.07,365.07,0,0,0-29.78-115.85c-.91-2.06.06-4.94.16-7.45,2.06,1.69,5.06,3,6,5.13,14.69,32.71,25.73,66.48,29,102.46.47,5.2,2.27,10.28,2.73,15.48.21,2.27-1.38,4.72-2.15,7.08Z"/><path d="M258.17,260.94c3.89-3.43,7.51-7.57,8.24-7.11,3.35,2.11,6.9,5.11,8.23,8.61.59,1.54-3.91,5-6.11,7.64Z"/><path d="M142.09,285c10.82,0,22,10.75,22.21,21.34.16,9.22-7.85,16.38-18.44,16.33-10-.05-24.07-9.11-23.65-21.61C122.47,293.22,132.31,285,142.09,285Zm2.8,30.72c5.11.05,11.16-5.56,11-10.23-.17-6.65-6-13-12.13-13.26-4.93-.18-14,6.36-14.12,10.2C129.44,308.43,137.73,315.66,144.89,315.74Z"/></g></g></svg>;
}

export default @connect(mapStateToProps)
@injectIntl
class Compose extends React.PureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    columns: ImmutablePropTypes.list.isRequired,
    multiColumn: PropTypes.bool,
    showSearch: PropTypes.bool,
    isSearchPage: PropTypes.bool,
    intl: PropTypes.object.isRequired,
  };

  componentDidMount () {
    const { isSearchPage } = this.props;

    if (!isSearchPage) {
      this.props.dispatch(mountCompose());
    }
  }

  componentWillUnmount () {
    const { isSearchPage } = this.props;

    if (!isSearchPage) {
      this.props.dispatch(unmountCompose());
    }
  }

  onFocus = () => {
    this.props.dispatch(changeComposing(true));
  }

  onBlur = () => {
    this.props.dispatch(changeComposing(false));
  }

  render () {
    const { multiColumn, showSearch, isSearchPage, intl } = this.props;

    let header = '';

    if (multiColumn) {
      const { columns } = this.props;
      header = (
        <nav className='drawer__header'>
          <Link to='/getting-started' className='drawer__tab' title={intl.formatMessage(messages.start)} aria-label={intl.formatMessage(messages.start)}><Icon id='bars' fixedWidth /></Link>
          {!columns.some(column => column.get('id') === 'HOME') && (
            <Link to='/timelines/home' className='drawer__tab' title={intl.formatMessage(messages.home_timeline)} aria-label={intl.formatMessage(messages.home_timeline)}><Icon id='home' fixedWidth /></Link>
          )}
          {!columns.some(column => column.get('id') === 'NOTIFICATIONS') && (
            <Link to='/notifications' className='drawer__tab' title={intl.formatMessage(messages.notifications)} aria-label={intl.formatMessage(messages.notifications)}><Icon id='bell' fixedWidth /></Link>
          )}
          {!columns.some(column => column.get('id') === 'COMMUNITY') && (
            <Link to='/timelines/public/local' className='drawer__tab' title={intl.formatMessage(messages.community)} aria-label={intl.formatMessage(messages.community)}><Icon id='users' fixedWidth /></Link>
          )}
          {!columns.some(column => column.get('id') === 'PUBLIC') && (
            <Link to='/timelines/public' className='drawer__tab' title={intl.formatMessage(messages.public)} aria-label={intl.formatMessage(messages.public)}><Icon id='globe' fixedWidth /></Link>
          )}
          <a href='/settings/preferences' className='drawer__tab' title={intl.formatMessage(messages.preferences)} aria-label={intl.formatMessage(messages.preferences)}><Icon id='cog' fixedWidth /></a>
          <a href='/auth/sign_out' className='drawer__tab' data-method='delete' title={intl.formatMessage(messages.logout)} aria-label={intl.formatMessage(messages.logout)}><Icon id='sign-out' fixedWidth /></a>
        </nav>
      );
    }

    return (
      <div className='drawer' role='region' aria-label={intl.formatMessage(messages.compose)}>
        {header}

        {(multiColumn || isSearchPage) && <SearchContainer /> }

        <div className='drawer__pager'>
          {!isSearchPage && <div className='drawer__inner' onFocus={this.onFocus}>
            <NavigationContainer onClose={this.onBlur} />

            <ComposeFormContainer />

            <div className='drawer__inner__mastodon'>
              {instanceMascot}
            </div>
          </div>}

          <Motion defaultStyle={{ x: isSearchPage ? 0 : -100 }} style={{ x: spring(showSearch || isSearchPage ? 0 : -100, { stiffness: 210, damping: 20 }) }}>
            {({ x }) => (
              <div className='drawer__inner darker' style={{ transform: `translateX(${x}%)`, visibility: x === -100 ? 'hidden' : 'visible' }}>
                <SearchResultsContainer />
              </div>
            )}
          </Motion>
        </div>
      </div>
    );
  }

}
