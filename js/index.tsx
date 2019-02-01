import * as React from 'react';
import * as ReactDOM from 'react-dom';

const speed = 3000;
const pause = false;
const controls = true;
const pager = true;
const meltAppear = true;
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

  constructor(props: ISlider) {
    super(props);
    this.speed = props.speed || 3000;
    this.pause = props.pause || true;
    this.controls = props.controls || false;
    this.pager = props.pager || false;
    this.dotAppear = props.dotAppear || false;
    this.meltAppear = props.meltAppear || false;
    this.slideshowAppear = props.slideshowAppear || false;
    this.slideStyle = 'active';

    this.state = {
      current: 0,
    };
  }

  createControls() {

    return (
      <div className="controls">
        <img className="prevBtn" src={require('../assets/icons/icons-arrow.png')} title="Arrow" />
        <img className="nextBtn" src={require('../assets/icons/icons-arrow.png')} title="Arrow" />
      </div>
    );
  }

  autoplay() {
    setTimeout(() => {
      this.state.current + 1 < this.slides.length ?
        this.setState({ current: this.state.current + 1 }) :
        this.setState({ current: 0 });
      // tslint:disable-next-line:align
    }, this.speed);
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
      </div>
    );
  }

  render() {
    if (this.pause) this.autoplay();

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
