import { StateView } from "./state-view";

/**
 * Represents the complete state configuration for the grid component.
 * This interface manages view states, menu interactions, and user interface elements
 * for the data grid functionality.
 */
export interface GridState {
    /**
     * A collection of saved grid views indexed by their unique identifiers.
     * Each view contains column configurations, filters, and sorting preferences
     * that can be restored to recreate a specific grid layout.
     */
    viewConfigs: { [id: string]: StateView };
    
    /**
     * The label text for creating a new grid view.
     * This is typically displayed in input fields where users can name
     * their custom grid configurations.
     */
    viewName: string;
    
    /**
     * The identifier of the currently active grid view.
     * When null, indicates that no specific view is currently selected
     * or the grid is in its default state.
     */
    currentViewId: string | null;
    
    /**
     * Flag indicating whether the grid options menu is currently open.
     * Used to control the visibility state of dropdown menus and
     * popup components in the grid interface.
     */
    isMenuOpened: boolean;
    
    /**
     * Reference to the HTML element that serves as the anchor for popup menus.
     * This element determines the positioning of dropdown menus and tooltips
     * relative to the grid interface.
     */
    menuAnchorElement: HTMLElement | null;
}
