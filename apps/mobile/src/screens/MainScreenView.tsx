import { MainScreenViewSection01 } from './MainScreenViewSection01';
import { MainScreenViewSection02 } from './MainScreenViewSection02';
import { MainScreenViewSection03 } from './MainScreenViewSection03';
import { MainScreenViewSection04 } from './MainScreenViewSection04';
import { MainScreenViewSection05 } from './MainScreenViewSection05';
import { View } from 'react-native';
import type { MainScreenSection37Context, MainScreenSection37Output } from './mainScreenSection37';




type MainScreenViewContext = MainScreenSection37Context & MainScreenSection37Output;

export function MainScreenView({ context }: { context: MainScreenViewContext }) {
  return (
    <View style={context.styles.container}>
      <MainScreenViewSection01 context={context} />
      <MainScreenViewSection02 context={context} />
      <MainScreenViewSection03 context={context} />
      <MainScreenViewSection04 context={context} />
      <MainScreenViewSection05 context={context} />
    </View>
  );
}
