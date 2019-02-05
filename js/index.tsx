import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { any } from 'prop-types';

const speed = 3000;
const pause = true;
const controls = true;
const pager = true;
const meltAppear = false;
const dotAppear = false;
const slideshowAppear = false;

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
  buttons: any;
  // onGenericEvent: (event: React.SyntheticEvent<{ value: string }>) => void;

  constructor(props: ISlider) {
    super(props);
    this.speed = props.speed || 3000;
    this.pause = props.pause || true;
    this.controls = props.controls || false;
    this.pager = props.pager || false;
    this.dotAppear = props.dotAppear || false;
    this.meltAppear = props.meltAppear || false;
    this.slideshowAppear = props.slideshowAppear || false;
    this.buttons = [];
    this.slideStyle = 'active';

    this.state = {
      current: 0,
    };
  }

  createControls() {
    if (this.controls) {

      const onControlsForward = (event: React.MouseEvent<HTMLElement>) => {
        this.moveForvard();
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

  createButtons() {
    for (let i = 0; i < this.slides.length; i += 1) {
      let classButton = 'button';
      if (i === this.state.current) {
        classButton = 'activeButton';
      } else {
        classButton = 'button';
      }
      this.buttons.push(<button className={classButton} key={i} />);
      console.log(this.buttons.props);
    }
    console.log(this.buttons);
    console.log(this.state.current);

    return (
      <div className="controlBar">
        {this.buttons}
      </div>
    );
  }

  moveForvard(): void {
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
    setTimeout(() => { this.moveForvard(); }, this.speed);
  }

  animate() {
    if (this.dotAppear) return 'dot-current';
    if (this.meltAppear) return 'melt-current';
    if (this.slideshowAppear) return 'slideshow-current';

    return 'active';
  }

  getSlides() {
    const { children } = this.props;

    this.slides = React.Children.map(children, (child: JSX.Element, index: number) =>
      React.cloneElement(child, {
        key: index,
        className: (index === this.state.current ? `${this.animate()}` : 'slide'),
      }));

    return (
      <div id="slider">
        {this.slides}
        {this.createControls()}
        {this.createButtons()}
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
    speed={speed}
    pause={pause}
    controls={controls}
    pager={pager}
    meltAppear={meltAppear}
    dotAppear={dotAppear}
    slideshowAppear={slideshowAppear}
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
