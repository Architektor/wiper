import styled from 'styled-components/native';
import { Animated } from 'react-native';
import * as colors from './colors';

export const AppContainer = styled.View`
  flex: 1;
  backgroundColor: ${colors.primary};
`;

export const TextRegular = styled.Text`
  color: ${colors.secondaryLight};
  font-size: 14;
  font-weight: 600;
`;

export const PlayView = Animated.createAnimatedComponent(styled.View`
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  right: ${({ right }) => right};
  transform: translateX(-12px);
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: center;
`);

export const TimerView = styled.View`
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
`;

export const Box = Animated.createAnimatedComponent(styled.View`
  width: 100px;
  height: 100px;
  backgroundColor: ${colors.secondaryLight};
`)

export const PlayButton = Animated.createAnimatedComponent(styled.View`
  width: 0;
  height: 0;
  backgroundColor: transparent;
  borderStyle: solid;
  borderLeftWidth: 20;
  borderRightWidth: 20;
  borderBottomWidth: 32;
  borderLeftColor: transparent;
  borderRightColor: transparent;
  borderBottomColor: ${colors.accent};
  transform: rotate(90deg);
`)

export const Timer = Animated.createAnimatedComponent(styled(TextRegular)`
  font-size: 64;
  position: absolute;
  bottom: 25%;
`)

export const NewTaskInput = Animated.createAnimatedComponent(styled.TextInput`
  height: 40px;
  width: 80%;
  borderBottomColor: ${colors.secondaryLight};
  borderBottomWidth: 3px;
  font-size: 18px;
  color: white;
`);
