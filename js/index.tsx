import * as React from 'react';
import * as ReactDOM from 'react-dom';

const speed = 3000;
const melt = true;
const dotAppear = true;

interface ISlider {
  speed: number;
  melt: boolean;
  dotAppear: boolean;
}

class Slider extends React.Component<ISlider, { count: number }> {
  speed: number;
  slides: any;
  melt: boolean;
  slideStyle: string;
  dotAppear: boolean;

  constructor(props: ISlider) {
    super(props);
    this.speed = props.speed || 3000;
    this.melt = props.melt || false;
    this.dotAppear = props.dotAppear || false;
    this.slideStyle = 'active';

    this.state = {
      count: 0,
    };
  }

  autoplay() {
    setTimeout(() => {
      this.state.count + 1 < this.slides.length ?
        this.setState({ count: this.state.count + 1 }) :
        this.setState({ count: 0 });
    }, this.speed);
  }

  dotAppearSlide(): void {
    this.slideStyle = 'dot-current';
  }

  showSlides() {
    const { children } = this.props;

    this.slides = React.Children.map(children, (child: JSX.Element, index: number) =>
      React.cloneElement(child, {
        key: index,
        className: (index === this.state.count ? `${this.slideStyle}` : 'slide'),
      }));

    return (
      <div id="slider">
        {this.slides}
      </div>
    );
  }

  render() {
    this.autoplay();
    if (this.dotAppear) this.dotAppearSlide();

    return (
      this.showSlides()
    );
  }
}

ReactDOM.render(
  <Slider speed={speed} melt={melt} dotAppear={dotAppear}>
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
  </Slider>,
  document.getElementById('root'));
