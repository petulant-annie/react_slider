import * as React from 'react';
import * as ReactDOM from 'react-dom';

const controlArrow = require('../assets/icons/icons-arrow.png');

interface ISlider {
  speed: number;
  pause: boolean;
  controls: boolean;
  pagination: boolean;
  animation: string;
}

interface ISliderState {
  current: number;
  previous: number;
  eventsAccess: boolean;
}

class Slider extends React.Component<ISlider, ISliderState> {
  speed: number;
  pause: boolean;
  controls: boolean;
  pagination: boolean;
  animation: string;
  dotAppear: boolean;
  meltAppear: boolean;
  slideshowAppear: boolean;
  timeout: NodeJS.Timeout;
  startPoint: number;

  constructor(props: ISlider) {
    super(props);
    this.speed = props.speed || 3000;
    this.pause = props.pause;
    this.controls = props.controls;
    this.pagination = props.pagination;
    this.animation = props.animation;
    this.dotAppear = (props.animation === 'dotAppear');
    this.meltAppear = (props.animation === 'meltAppear');
    this.slideshowAppear = (props.animation === 'slideshowAppear');

    this.state = {
      current: 0,
      previous: React.Children.count(this.props.children) - 1,
      eventsAccess: true,
    };
  }

  onControlsForward() {
    const forward = (e: React.MouseEvent<HTMLElement>) => {
      clearTimeout(this.timeout);
      this.moveForward();
    };

    return forward;
  }

  onControlsBackward() {
    const backward = (e: React.MouseEvent<HTMLElement>) => {
      clearTimeout(this.timeout);
      this.moveBackward();
    };

    return backward;
  }

  stopClickEvent() {
    const stopEvent = (e: React.SyntheticEvent<HTMLElement>) => e.stopPropagation();

    return stopEvent;
  }

  handleStopEvent() {
    const stopEvent = (e: React.TouchEvent<HTMLDivElement>) => e.stopPropagation();

    return stopEvent;
  }

  createControls() {
    const events: React.CSSProperties = {
      pointerEvents: (this.state.eventsAccess) ? 'auto' : 'none'
    };

    if (this.controls) {
      return (
        <div className="controls">
          <img
            onClick={this.onControlsBackward()}
            onMouseDown={this.stopClickEvent()}
            onTouchStart={this.handleStopEvent()}
            onTouchEnd={this.handleStopEvent()}
            className="prevBtn"
            src={controlArrow}
            style={events}
          />
          <img
            onClick={this.onControlsForward()}
            onMouseDown={this.stopClickEvent()}
            onTouchStart={this.handleStopEvent()}
            onTouchEnd={this.handleStopEvent()}
            className="nextBtn"
            src={controlArrow}
            style={events}
          />
        </div>
      );
    }

    return null;
  }

  activateControls() {
    setTimeout(() => this.setState({ eventsAccess: true }), 500);
  }

  createPagination() {
    if (this.pagination) {

      const buttons = [];

      for (let i = 0; i < React.Children.count(this.props.children); i += 1) {
        let classButton = 'button';

        if (i === this.state.current) {
          classButton = 'button activeButton';
        } else {
          classButton = 'button';
        }

        const onPaginationClick = (e: React.MouseEvent<HTMLElement>) => {
          this.setState({ current: i, previous: this.state.current });
          clearInterval(this.timeout);
        };
        buttons.push(
          <button
            className={classButton}
            key={i}
            onClick={onPaginationClick}
            onMouseDown={this.stopClickEvent()}
          />);
      }

      return (
        <div className="controlBar">
          {buttons}
        </div>
      );
    }

    return null;
  }

  moveForward() {
    this.state.current + 1 < React.Children.count(this.props.children) ?
      this.setState({
        current: this.state.current + 1,
        previous: this.state.current, eventsAccess: false,
      }) :
      this.setState({
        current: 0,
        previous: React.Children.count(this.props.children) - 1, eventsAccess: false,
      });
    const disable = setTimeout(() => {
      this.setState({ eventsAccess: true });
      clearTimeout(disable);
    }, 1000);
  }

  moveBackward() {
    this.state.current - 1 >= 0 ?
      this.setState({
        current: this.state.current - 1,
        previous: this.state.current, eventsAccess: false,
      }) :
      this.setState({
        current: React.Children.count(this.props.children) - 1,
        previous: 0, eventsAccess: false,
      });
    const disable = setTimeout(() => {
      this.setState({ eventsAccess: true });
      clearTimeout(disable);
    }, 1000);
  }

  autoplay() {
    if (this.state.eventsAccess) {
      this.timeout = setTimeout(() => this.moveForward(), this.speed);
    }
  }

  animate(index: number) {
    const loopForward = (this.state.current === 0 &&
      this.state.previous === React.Children.count(this.props.children) - 1);

    const loopBackward = (this.state.current ===
      React.Children.count(this.props.children) - 1 && this.state.previous === 0);

    if (index === this.state.previous) {
      switch (true) {
        case (this.meltAppear):
          return 'melt-previous';
        case (this.slideshowAppear):
          if ((this.state.previous < this.state.current && !loopBackward) || loopForward) {
            return 'slideshow-previous slide-out-to-left';
          } if (this.state.previous > this.state.current || loopBackward) {
            return 'slideshow-previous slide-out-to-right';
          }
        default: return 'slide';
      }
    }
    if (index === this.state.current) {
      switch (true) {
        case (this.dotAppear):
          return 'dot-current';
        case (this.meltAppear):
          return 'melt-current';
        case (this.slideshowAppear):
          if ((this.state.previous < this.state.current && !loopBackward) || loopForward) {
            return 'slideshow-current slide-in-from-right';
          } if (this.state.previous > this.state.current || loopBackward) {
            return 'slideshow-current slide-in-from-left';
          }
        default:
          return 'active';
      }
    }

    return 'slide';
  }

  handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    this.startPoint = event.changedTouches[0].clientX;
  }

  handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {

    const end = event.changedTouches[0].clientX;

    clearInterval(this.timeout);
    if (this.startPoint - 100 >= end || this.startPoint === end) {
      this.moveForward();
    } else if (this.startPoint + 100 <= end) {
      this.moveBackward();
    }
  }

  getSlides() {
    const events: React.CSSProperties = {
      pointerEvents: (this.state.eventsAccess) ? 'auto' : 'none'
    };

    const slides = React.Children.map(this.props.children, (child: JSX.Element, index: number) =>
      React.cloneElement(child, {
        key: index,
        className: `${this.animate(index)}`,
      }));

    return (
      <div
        id="slider"
        onClick={this.stopClickEvent()}
        onMouseDown={this.onControlsForward()}
        onTouchStart={this.handleTouchStart && this.stopClickEvent()}
        onTouchEnd={this.handleTouchEnd}
        style={events}
      >
        {slides}
        {this.createControls()}
        {this.createPagination()}
      </div>
    );
  }

  render() {
    if (!this.pause) this.autoplay();

    return (
      this.getSlides()
    );
  }
}

const slider = (
  <Slider
    speed={3000}
    pause={false}
    controls={true}
    pagination={true}
    animation={'slideshowAppear'}
  >
    <div>
      <img src={require('../assets/images/lake.jpg')} title="Lake" />
    </div>
    <div>
      <img src={require('../assets/images/mountains-lake.jpg')} title="Mountains Lake" />
    </div>
    <div>
      <img src={require('../assets/images/road.jpg')} title="Road" />
    </div>
    <div>
      <img src={require('../assets/images/winter-road.jpg')} title="Winter Road" />
    </div>
    <div>
      <img src={require('../assets/images/winter-town.jpg')} title="Winter Town" />
    </div>
  </Slider>
);

ReactDOM.render(slider, document.getElementById('root'));
