import React from 'react';
import PropTypes from 'prop-types';
import { Motion, spring } from 'react-motion';

import './styled/DraggableListStyles';

Array.prototype.equals = function(array) {
  if (!array) return false;

  if (this.length != array.length) return false;

  for (var i = 0, l = this.length; i < l; i++) {
    if (this[i] instanceof Array && array[i] instanceof Array) {
      if (!this[i].equals(array[i])) return false;
    } else if (this[i] != array[i]) {
      return false;
    }
  }
  return true;
};

Object.defineProperty(Array.prototype, 'equals', { enumerable: false });

function range(count, start = 0) {
  const rangeItems = [];
  for (let i = start; i < count; i++) {
    rangeItems.push(i);
  }
  return rangeItems;
}

function reinsert(arr, from, to) {
  const _arr = arr.slice(0);
  const val = _arr[from];
  _arr.splice(from, 1);
  _arr.splice(to, 0, val);
  return _arr;
}

function clamp(n, min, max) {
  return Math.max(Math.min(n, max), min);
}

const springConfig = { stiffness: 300, damping: 50 };
const itemsCount = 10;

class DraggableList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ready: false,
      wrapperHeight: 0,
      topDeltaY: 0,
      mouseY: 0,
      isPressed: false,
      originalPosOfLastPressed: 0,
      order: range(props.children.length)
    };
  }

  componentDidMount() {
    const { children } = this.props;
    if (children && children.length) {
      this.init(children);
    }
    this.updateWrapperHeight();
    window.addEventListener('touchmove', this.handleTouchMove);
    window.addEventListener('touchend', this.handleMouseUp);
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('mouseup', this.handleMouseUp);
  }

  componentDidUpdate({ children }) {
    const { children: nextChildren } = this.props;
    if (children.length !== nextChildren.length || !this.state.ready) {
      this.updateWrapperHeight();
    }
  }

  componentWillUpdate({ updateOrders }, { order: nextOrder }) {
    const { order: prevOrder } = this.state;
    if (!nextOrder.equals(prevOrder) && updateOrders) {
      updateOrders(nextOrder);
    }
  }

  componentWillReceiveProps({ children }) {
    const { children: prevChildren } = this.props;
    if (
      children &&
      prevChildren &&
      prevChildren.length &&
      children.length > prevChildren.length
    ) {
      // Handle add item form parent
      this.addToList(children);
    } else if (
      children &&
      prevChildren &&
      children.length < prevChildren.length
    ) {
      // Handle remove item form parent
      const removedItem = prevChildren.find(prevChild => {
        return !children.find(child => child.key === prevChild.key);
      });

      const { order } = this.state;
      const removedItemOrder = order[removedItem.props.order];
      const removedItemOrderIndex = order.findIndex(
        o => o === removedItemOrder
      );
      const recomputeOrder = [...order];
      recomputeOrder.splice(removedItemOrderIndex, 1);
      for (let i = 0; i < order.length; i++) {
        if (recomputeOrder[i] > removedItemOrder) {
          recomputeOrder[i] = recomputeOrder[i] - 1;
        }
      }
      this.setState({ order: recomputeOrder });
      this.props.updateOrders(recomputeOrder);
    }
  }

  handleTouchStart = (key, pressLocation, e) => {
    e.preventDefault();
    this.handleMouseDown(key, pressLocation, e.touches[0]);
  };

  handleTouchMove = e => {
    e.preventDefault();
    this.handleMouseMove(e.touches[0]);
  };

  handleMouseDown = (pos, pressY, { pageY }) => {
    this.setState({
      topDeltaY: pageY - pressY,
      mouseY: pressY,
      isPressed: true,
      originalPosOfLastPressed: pos
    });
  };

  handleMouseMove = ({ pageY }) => {
    const {
      isPressed,
      topDeltaY,
      order,
      originalPosOfLastPressed
    } = this.state;

    if (isPressed) {
      const mouseY = pageY - topDeltaY;
      const currentRow = clamp(Math.round(mouseY / 100), 0, itemsCount - 1);
      let newOrder = order;

      if (currentRow !== order.indexOf(originalPosOfLastPressed)) {
        newOrder = reinsert(
          order,
          order.indexOf(originalPosOfLastPressed),
          currentRow
        );
      }
      this.setState({ mouseY: mouseY, order: newOrder });
    }
  };

  handleMouseUp = () => {
    this.setState({ isPressed: false, topDeltaY: 0 });
  };

  init = children => {
    this.setState({
      ready: false,
      wrapperHeight: 0,
      topDeltaY: 0,
      mouseY: 0,
      isPressed: false,
      originalPosOfLastPressed: 0,
      order: range(children.length)
    });
  };

  computeChildrenTotalHeight(children) {
    let totalHeight = 0;
    for (let i = 0; i < children.length; i++) {
      totalHeight += children[i].offsetHeight;
    }
    return totalHeight;
  }

  addToList = children => {
    const { order: oldOrder } = this.state;
    this.setState({
      topDeltaY: 0,
      mouseY: 0,
      isPressed: false,
      originalPosOfLastPressed: 0,
      order: oldOrder.concat(range(children.length, children.length - 1))
    });
  };

  updateWrapperHeight = () => {
    this.setState({
      ready: true,
      wrapperHeight: this.computeChildrenTotalHeight(this.wrapperRef.children)
    });
  };

  render() {
    const { children, draggableHeight, draggableWidth } = this.props;
    const {
      mouseY,
      isPressed,
      originalPosOfLastPressed,
      order,
      wrapperHeight
    } = this.state;
    return (
      <div
        ref={ref => (this.wrapperRef = ref)}
        className="draggable"
        style={{ height: wrapperHeight }}
      >
        {children.map((item, i) => {
          const style =
            originalPosOfLastPressed === i && isPressed
              ? {
                  scale: spring(1.1, springConfig),
                  shadow: spring(16, springConfig),
                  y: mouseY
                }
              : {
                  scale: spring(1, springConfig),
                  shadow: spring(1, springConfig),
                  y: spring(order.indexOf(i) * 100, springConfig)
                };

          return (
            <Motion style={style} key={i}>
              {({ scale, y }) => (
                <div
                  className="draggable-item"
                  style={{
                    transform: `translate3d(0, ${y}px, 0) scale(${scale})`,
                    WebkitTransform: `translate3d(0, ${y}px, 0) scale(${scale})`,
                    zIndex: i === originalPosOfLastPressed ? 99 : i
                  }}
                >
                  <div
                    onMouseDown={this.handleMouseDown.bind(null, i, y)}
                    onTouchStart={this.handleTouchStart.bind(null, i, y)}
                    style={{
                      height: draggableHeight,
                      width: draggableWidth,
                      position: 'absolute'
                    }}
                  />
                  {item}
                </div>
              )}
            </Motion>
          );
        })}
      </div>
    );
  }
}

DraggableList.propTypes = {
  children: PropTypes.array,
  draggableHeight: PropTypes.string,
  draggableWidth: PropTypes.string,
  updateOrders: PropTypes.func
};

DraggableList.defaultProps = {
  draggableHeight: '100%',
  draggableWidth: '100%'
};

export default DraggableList;
