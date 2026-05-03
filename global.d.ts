declare global {
    interface Window {
        getAvailableServerActions: () => AternosServerActionsType;
        reportServerActionChange: (action: AternosServerActionsType) => void;
        reportStatusChange: (status: string) => void;
        isAdboxVisible: () => boolean;
        isHelpersInjected: () => string;
        closeNotificationAlertBox: () => boolean;
        closeForcedAdRewardBox: () => Promise<boolean>;
        isForcedAdRewardBoxVisible: () => boolean;
    }
}

export {}
