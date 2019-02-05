import * as React from 'react';
import * as ReactDOM from 'react-dom';

interface ISlider {
  speed: number;
  pause: boolean;
  controls: boolean;
  pager: boolean;
  dotAppear: boolean;
  meltAppear: boolean;
  slideshowAppear: boolean;
}

class Slider extends React.Component<ISlider, { current: number }> {
  speed: number;
  pause: boolean;
  controls: boolean;
  pager: boolean;
  slides: React.ReactNodeArray; // React.ReactElement<any>[]
  slideStyle: string;
  dotAppear: boolean;
  meltAppear: boolean;
  slideshowAppear: boolean;
  buttons: React.ReactNodeArray;
  timeout: NodeJS.Timeout;
  // onGenericEvent: (event: React.SyntheticEvent<{ value: string }>) => void;

  constructor(props: ISlider) {
    super(props);
    this.speed = props.speed || 3000;
    this.pause = props.pause;
    this.controls = props.controls;
    this.pager = props.pager;
    this.dotAppear = props.dotAppear;
    this.meltAppear = props.meltAppear;
    this.slideshowAppear = props.slideshowAppear;
    this.slideStyle = 'active';
    this.timeout;

    this.state = {
      current: 0,
    };
  }

  createControls() {
    if (this.controls) {

      const onControlsForward = (event: React.MouseEvent<HTMLElement>) => {
        this.moveForward();
      };

      const onControlsBackward = (event: React.MouseEvent<HTMLElement>) => {
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

        const onPagerEvent = (event: React.MouseEvent<HTMLElement>) => {
          this.setState({ current: i });
          clearInterval(this.timeout);
        };
        this.buttons.push(<button className={classButton} key={i} onClick={onPagerEvent} />);
        // this.setState({ current: this.state.current });
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

  getSlides() {
    const { children } = this.props;
    const forward = (event: React.TouchEvent<HTMLDivElement>) => {
      clearTimeout(this.timeout);
      this.moveForward();
      console.log(12);
    };
    const backward = (event: React.TouchEvent<HTMLDivElement>) => {
      clearTimeout(this.timeout);
      this.moveBackward();
      console.log(122);
    };

    this.slides = React.Children.map(children, (child: JSX.Element, index: number) =>
      React.cloneElement(child, {
        key: index,
        className: (index === this.state.current ? `${this.animate()}` : 'slide'),
      }));

    return (// onTouchEnd={backward}
      <div id="slider" onTouchStart={forward} >
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
    pause={false}
    controls={true}
    pager={true}
    meltAppear={false}
    dotAppear={false}
    slideshowAppear={true}
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
