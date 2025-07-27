import { StateView } from "./state-view";

export interface DemoState {
    views: { [id: string]: StateView };
    newViewLabel: string;
    activeViewId: string | null;
    isMenuOpened: boolean;
    menuAnchorEl: HTMLElement | null;
}
