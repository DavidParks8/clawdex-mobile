import { AccessibilityInfo, Text, View } from 'react-native';
import renderer, { act, type ReactTestRenderer } from 'react-test-renderer';

import {
  controlAccessibilityState,
  decorativeAccessibilityProps,
  useAccessibilityAnnouncement,
} from '../accessibility';

function AnnouncementProbe({ message }: { message: string | null }) {
  useAccessibilityAnnouncement(message);
  return <Text>{message}</Text>;
}

describe('accessibility helpers', () => {
  it('builds explicit control state without inventing optional state', () => {
    expect(controlAccessibilityState({ disabled: true, selected: false, expanded: true, busy: true }))
      .toEqual({ disabled: true, selected: false, expanded: true, busy: true });
    expect(controlAccessibilityState({})).toEqual({ disabled: false });
  });

  it('hides decorative descendants from accessibility', () => {
    let tree: ReactTestRenderer | undefined;
    act(() => {
      tree = renderer.create(<View {...decorativeAccessibilityProps} />);
    });

    expect(tree?.root.findByType(View).props).toMatchObject({
      accessible: false,
      accessibilityElementsHidden: true,
      importantForAccessibility: 'no',
    });
  });

  it('announces changed non-empty messages once', () => {
    const announce = jest.spyOn(AccessibilityInfo, 'announceForAccessibility').mockImplementation();
    let tree: ReactTestRenderer | undefined;

    act(() => {
      tree = renderer.create(<AnnouncementProbe message="Loading" />);
    });
    act(() => {
      tree?.update(<AnnouncementProbe message="Loading" />);
    });
    act(() => {
      tree?.update(<AnnouncementProbe message="Ready" />);
    });

    expect(announce).toHaveBeenCalledTimes(2);
    expect(announce).toHaveBeenNthCalledWith(1, 'Loading');
    expect(announce).toHaveBeenNthCalledWith(2, 'Ready');
    announce.mockRestore();
  });
});
