import * as React from 'react';
import * as ReactDOM from 'react-dom';

const speed = 3000;

interface ISlider {
  speed: number;
}

class Slider extends React.Component<ISlider, { count: number }> {
  speed: number;
  slides: any;

  constructor(props: ISlider) {
    super(props);
    this.speed = props.speed || 3000;

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

  showSlides() {
    const { children } = this.props;

    this.slides = React.Children.map(children, (child: JSX.Element, index: number) =>
      React.cloneElement(child, {
        key: index,
        className: (index === this.state.count ? 'active' : 'slide'),
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
      this.showSlides()
    );
  }
}

ReactDOM.render(
  <Slider speed={speed}>
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
