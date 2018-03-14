import React from 'react';
import moment from 'moment';
import { StatusBar, PanResponder, Dimensions, Animated, Easing, Picker } from 'react-native';
import { AppContainer, TextRegular, Timer, PlayView, TimerView, Box, PlayButton, NewTaskInput } from './styled';

const { width, height } = Dimensions.get('window');

export default class App extends React.Component {
  static initialState = {
    initialX: 0,
    initialY: 0,
    dx: 0,
    dy: 0,
    vx: 0,
    vy: 0,
    tick: 0,
    screenHeight: height,
    screenWidth: width,
    bar: new Animated.Value(0),
    foo: new Animated.Value(0),
  }

  state = {
    initialX: 0,
    initialY: 0,
    dx: 0,
    dy: 0,
    vx: 0,
    vy: 0,
    tick: 0,
    screenHeight: height,
    screenWidth: width,
    selectedValue: '0',
    bar: new Animated.Value(0),
    foo: new Animated.Value(0),
    x: new Animated.Value(0),
  }

  addLeadingZero = value => value < 10 ? `0${value}` : value;

  componentWillMount() {
    StatusBar.setBarStyle('light-content', true);
    this.gestureSystem = PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderGrant: (evt, gestureState) => {
        console.log('grant timerview')
        const { x0, y0, vx, vy } = gestureState;
        this.setState({
          initialX: x0,
          initialY: y0,
        })
        // The gesture has started. Show visual feedback so the user knows
        // what is happening!

        // gestureState.d{x,y} will be set to zero now
      },
      onPanResponderMove: (_, { dx, dy }) => {
        console.log(this.state.initialX);
        if (this.state.initialX > 300) {
          this.state.foo.setValue(dx);
        } else if (this.state.initialY > 700 && dy < -100) {
          this.state.bar.setValue(-dy)
        }
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        if (this.state.initialX > 300) {
          this.setState(this.initialState);
          this.startTimer();
          Animated.spring(this.state.foo, {
            toValue: -375,
            velocity: gestureState.vx,
          }).start();
        } else if (this.state.initialY > 700 && gestureState.dy < -100) {
          this.openCreateTaskView();
          Animated.spring(this.state.bar, {
            toValue: 100,
            velocity: gestureState.vx,
          }).start();
        }
        // The user has released all touches while this view is the
        // responder. This typically means a gesture has succeeded
      },
      onPanResponderTerminate: (evt, gestureState) => {
        // Another component has become the responder, so this gesture
        // should be cancelled
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        // Returns whether this component should block native components from becoming the JS
        // responder. Returns true by default. Is currently only supported on android.
        return true;
      },
    });
    this.playViewGestureSystem = PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderGrant: (evt, gestureState) => {
        const { x0, y0, vx, vy } = gestureState;
        this.setState({
          initialX: x0,
          initialY: y0,
        })
        // The gesture has started. Show visual feedback so the user knows
        // what is happening!

        // gestureState.d{x,y} will be set to zero now
      },
      onPanResponderMove: (_, { dx }) => {
        if (this.state.initialX < 35) {
          this.state.foo.setValue(-375 + dx);
        }
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, { dx, vx }) => {
        if (this.state.initialX < 35) {
          this.state.foo.setValue(-375 + dx);
          this.setState(this.initialState);
          this.stopTimer();
          Animated.spring(this.state.foo, {
            toValue: 0,
            velocity: vx,
          }).start();
        }
        // The user has released all touches while this view is the
        // responder. This typically means a gesture has succeeded
      },
      onPanResponderTerminate: (evt, gestureState) => {
        // Another component has become the responder, so this gesture
        // should be cancelled
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        // Returns whether this component should block native components from becoming the JS
        // responder. Returns true by default. Is currently only supported on android.
        return true;
      },
    });
  }

  openCreateTaskView = () => {
    this.newTaskInput._component.root.focus();
    this.setState({ createTaskViewOpen: true });
  };

  startTimer = () => {
    this.timer = setInterval(() => this.setState({ tick: this.state.tick + 1 }), 1000);
  }

  stopTimer = () => {
    clearInterval(this.timer);
    this.setState({
      tick: 0,
    });
  }

  render() {
    const { initialX, selectedValue, tick, foo, bar, x, screenWidth, dx, dy } = this.state;
    const time = moment.duration(tick, 'seconds');
    return (
      <AppContainer>
        <TimerView {...this.gestureSystem.panHandlers}>
          <NewTaskInput
            placeholder="summary"
            ref={(c) => { this.newTaskInput = c; }}
            style={{
              opacity: bar.interpolate({ inputRange: [0, 100], outputRange: [0, 1] }),
              transform: [{ translateY: bar.interpolate({ inputRange: [0, 100], outputRange: [0, -100]  }) }]
            }}
          />
          <Picker
            style={{ width: 300, height: 200 }}
            itemStyle={{ color: 'white' }}
            selectedValue={selectedValue}
            onValueChange={itemValue => this.setState({ selectedValue: itemValue })}
          >
            <Picker.Item value="1" label="Walk a dog" />
            <Picker.Item value="2" label="Grow a tree" />
            <Picker.Item value="3" label="Raise a son" />
            <Picker.Item value="4" label="Quit smoking" />
            <Picker.Item value="5" label="Build a house" />
            <Picker.Item value="6" label="Marry a beautiful woman" />
            <Picker.Item value="7" label="Walk a dog" />
            <Picker.Item value="8" label="Walk a dog" />
            <Picker.Item value="9" label="Walk a dog" />
            <Picker.Item value="10" label="Walk a dog" />
            <Picker.Item value="11" label="Walk a dog" />
            <Picker.Item value="12" label="Walk a dog" />
            <Picker.Item value="13" label="Walk a dog" />
            <Picker.Item value="14" label="Walk a dog" />
            <Picker.Item value="15" label="Walk a dog" />
          </Picker>
        </TimerView>
        <PlayView
          {...this.playViewGestureSystem.panHandlers}
          right={-375}
          style={{
            transform: [{
              translateX: foo.interpolate({ inputRange: [-375, 0], outputRange: [-375, 0] })
            }]
          }}
        >
          <PlayButton
            style={{
              transform: [{
                scale: foo.interpolate({ inputRange: [-375, 0], outputRange: [0.5, 3] })
              }, {
                rotate: '90deg'
              }, {
                translateX: foo.interpolate({ inputRange: [-375, 0], outputRange: [15, 0] })
              }, {
                translateY: foo.interpolate({ inputRange: [-375, 0], outputRange: [280, 0] })
              }],
              opacity: foo.interpolate({ inputRange: [-375, 0], outputRange: [0.8, 0.2] })
            }}
          />
          <Timer>
            {this.addLeadingZero(time.minutes())} : {this.addLeadingZero(time.seconds())}
          </Timer>
        </PlayView>
      </AppContainer>
    );
  }
}
