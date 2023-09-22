// RootNavigation.js

import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef()

export function navigate(screen) {
    if (navigationRef.isReady()) {
        navigationRef.navigate(screen);
    }
}

// add other navigation functions that you need and export them