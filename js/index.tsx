import * as React from 'react';
import * as ReactDOM from 'react-dom';

interface ISlider {
  speed: number;
  pause: boolean;
  controls: boolean;
  pager: boolean;
  animation: string;
}

class Slider extends React.Component<ISlider, { current: number }> {
  speed: number;
  pause: boolean;
  controls: boolean;
  pager: boolean;
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
    this.pager = props.pager;
    this.animation = props.animation;
    this.dotAppear = (props.animation === 'dotAppear');
    this.meltAppear = (props.animation === 'meltAppear');
    this.slideshowAppear = (props.animation === 'slideshowAppear');
    this.slideStyle = 'active';
    this.timeout;
    this.startPoint;

    this.state = {
      current: 0,
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

  createPager() {
    if (this.pager) {
      this.buttons = [];

      for (let i = 0; i < this.slides.length; i += 1) {
        let classButton = 'button';

        if (i === this.state.current) {
          classButton = 'activeButton';
        } else {
          classButton = 'button';
        }

        const onPagerEvent = (e: React.MouseEvent<HTMLElement>) => {
          this.setState({ current: i });
          clearInterval(this.timeout);
        };
        this.buttons.push(<button className={classButton} key={i} onClick={onPagerEvent} />);
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
      this.setState({ current: this.state.current + 1 }) :
      this.setState({ current: 0 });
  }

  moveBackward() {
    this.state.current - 1 >= 0 ?
      this.setState({ current: this.state.current - 1 }) :
      this.setState({ current: this.slides.length - 1 });
  }

  autoplay() {
    this.timeout = setTimeout(() => { this.moveForward(); }, this.speed);
  }

  animate() {
    if (this.dotAppear) return 'dot-current';
    if (this.meltAppear) return 'melt-current';
    if (this.slideshowAppear) return 'slideshow-previous';

    return 'active';
  }

  hideSlides() {
    // if (this.slideshowAppear) return 'slideshow-current';

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
    const children = this.props.children;

    this.slides = React.Children.map(children, (child: JSX.Element, index: number) =>
      React.cloneElement(child, {
        key: index,
        className: (index === this.state.current ?
          `${this.animate()}` :
          `${this.hideSlides()}`),
      }));

    return (
      <div id="slider" onTouchStart={this.handleTouchStart} onTouchEnd={this.handleTouchEnd}>
        {this.slides}
        {this.createControls()}
        {this.createPager()}
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
    pause={true}
    controls={true}
    pager={true}
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
