import * as React from 'react';
import { Spring } from 'react-spring';

import Portal from '../Portal';
import { Container, Item, ItemContainer } from './elements';

class ContextMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      x: 0,
      y: 0,
      show: false,
    };
  }

  onContextMenu = event => {
    event.preventDefault();
    this.mousedown = window.addEventListener('mousedown', mousedownEvent => {
      const { show } = this.state;

      if (show && this.el) {
        if (!this.el.contains(mousedownEvent.target)) {
          this.close();
        }
      }
    });

    this.keydown = window.addEventListener('keydown', keydownEvent => {
      const { show } = this.state;
      if (keydownEvent.keyCode === 27 && show) {
        // Escape
        this.close();
      }
    });

    this.setState({
      show: true,
      x: event.clientX + 10,
      y: event.clientY + 10,
    });

    if (this.props.onContextMenu) {
      this.props.onContextMenu(event);
    }
  };

  componentWillUnmount() {
    this.unregisterListeners();
    this.unmounted = true;
  }

  unregisterListeners = () => {
    window.removeEventListener('keydown', this.keydown);
    window.removeEventListener('mousedown', this.mousedown);
  };

  close = () => {
    if (!this.unmounted) {
      this.unregisterListeners();
      this.setState({
        show: false,
      });
    }
  };

  render() {
    const { children, items, ...props } = this.props;
    const { show, x, y } = this.state;

    const mapFunction = (item, i) => {
      if (Array.isArray(item)) {
        return <ItemContainer key={i}>{item.map(mapFunction)}</ItemContainer>;
      }

      return (
        <Item
          key={item.title}
          color={item.color}
          onClick={() => item.action() && this.close()}
        >
          {item.icon && <item.icon />}
          {item.title}
        </Item>
      );
    };

    return (
      <div {...props} onContextMenu={this.onContextMenu}>
        {children}
        {show && (
          <Portal>
            <div
              ref={el => {
                this.el = el;
              }}
            >
              <Spring
                from={{ opacity: 0.6, height: 0 }}
                to={{ opacity: 1, height: 'auto' }}
              >
                {({ opacity, height }) => (
                  <Container
                    style={{
                      left: x,
                      top: y,
                      opacity,
                      height,
                    }}
                  >
                    {items.map(mapFunction)}
                  </Container>
                )}
              </Spring>
            </div>
          </Portal>
        )}
      </div>
    );
  }
}

export default ContextMenu;
