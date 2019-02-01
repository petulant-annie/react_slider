import * as React from 'react';
import * as ReactDOM from 'react-dom';

const speed = 3000;
const meltAppear = true;
const dotAppear = false;
const slideshowAppear = false;

interface ISlider {
  speed: number;
  dotAppear: boolean;
  meltAppear: boolean;
  slideshowAppear: boolean;
}

class Slider extends React.Component<ISlider, { current: number }> {
  speed: number;
  slides: any; // React.ReactElement<any>[]
  slideStyle: string;
  dotAppear: boolean;
  meltAppear: boolean;
  slideshowAppear: boolean;

  constructor(props: ISlider) {
    super(props);
    this.speed = props.speed || 3000;
    this.dotAppear = props.dotAppear || false;
    this.meltAppear = props.meltAppear || false;
    this.slideshowAppear = props.slideshowAppear || false;
    this.slideStyle = 'active';

    this.state = {
      current: 0,
    };
  }

  autoplay() {
    setTimeout(() => {
      this.state.current + 1 < this.slides.length ?
        this.setState({ current: this.state.current + 1 }) :
        this.setState({ current: 0 });
    }, this.speed);
  }

  animate() {
    if (this.dotAppear) return 'dot-current';
    if (this.meltAppear) return 'melt-current';
    if (this.slideshowAppear) return 'slideshow-current';

    return 'active';
  }

  // classNameProps(index: number) {
  //   const a = (index === this.state.current ? `${this.animate()}` : 'slide');

  //   return a;
  // }

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
      </div>
    );
  }

  render() {
    this.autoplay();

    return (
      this.getSlides()
    );
  }
}

const slider = (
  <Slider
    speed={speed}
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
