import * as React from 'react';
import * as ReactDOM from 'react-dom';

interface ISlider {
  speed: number;
  pause: boolean;
  controls: boolean;
  pagination: boolean;
  animation: string;
}

class Slider extends React.Component<ISlider, { current: number, previous: number }> {
  speed: number;
  pause: boolean;
  controls: boolean;
  pagination: boolean;
  slides: React.ReactNodeArray;
  slideStyle: string;
  animation: string;
  dotAppear: boolean;
  meltAppear: boolean;
  slideshowAppear: boolean;
  buttons: React.ReactNodeArray;
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
    this.slideStyle = 'active';
    this.timeout;
    this.startPoint;

    this.state = {
      current: 0,
      previous: React.Children.count(this.props.children) - 1,
    };
  }

  createControls() {
    if (this.controls) {
      const onControlsForward = (e: React.MouseEvent<HTMLElement>) => {
        clearTimeout(this.timeout);
        this.moveForward();
      };

      const onControlsBackward = (e: React.MouseEvent<HTMLElement>) => {
        clearTimeout(this.timeout);
        this.moveBackward();
      };

      return (
        <div className="controls">
          <img
            onClick={onControlsBackward}
            className="prevBtn"
            src={require('../assets/icons/icons-arrow.png')}
          />
          <img
            onClick={onControlsForward}
            className="nextBtn"
            src={require('../assets/icons/icons-arrow.png')}
          />
        </div>
      );
    }
  }

  createPagination() {
    if (this.pagination) {
      this.buttons = [];

      for (let i = 0; i < this.slides.length; i += 1) {
        let classButton = 'button';

        if (i === this.state.current) {
          classButton = 'activeButton';
        } else {
          classButton = 'button';
        }

        const onPaginationClick = (e: React.MouseEvent<HTMLElement>) => {
          this.setState({ current: i, previous: this.state.current });
          clearInterval(this.timeout);
        };
        this.buttons.push(<button className={classButton} key={i} onClick={onPaginationClick} />);
      }

      return (
        <div className="controlBar">
          {this.buttons}
        </div>
      );
    }
  }

  moveForward(): void {
    this.state.current + 1 < this.slides.length ?
      this.setState({ current: this.state.current + 1, previous: this.state.current }) :
      this.setState({ current: 0, previous: this.slides.length - 1 });
  }

  moveBackward() {
    this.state.current - 1 >= 0 ?
      this.setState({ current: this.state.current - 1, previous: this.state.current }) :
      this.setState({ current: this.slides.length - 1, previous: 0 });
  }

  autoplay() {
    this.timeout = setTimeout(() => { this.moveForward(); }, this.speed);
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

  handleTouchStart = (event: any) => {
    this.startPoint = event.changedTouches[0].clientX;
  }

  handleTouchEnd = (event: any) => {
    const end = event.changedTouches[0].clientX;

    if (this.startPoint - 100 >= end || this.startPoint === end) {
      clearInterval(this.timeout);
      this.moveForward();
    } else if (this.startPoint + 100 <= end) {
      clearInterval(this.timeout);
      this.moveBackward();
    }
  }

  getSlides() {
    this.slides = React.Children.map(this.props.children, (child: JSX.Element, index: number) =>
      React.cloneElement(child, {
        key: index,
        className: `${this.animate(index)}`,
      }));

    return (
      <div id="slider" onTouchStart={this.handleTouchStart} onTouchEnd={this.handleTouchEnd}>
        {this.slides}
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
    animation={'meltAppear'}
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
