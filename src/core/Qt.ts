// Define interfaces and types first
export interface QSizePolicy {
    horizontal: number;
    vertical: number;
}

/**
 * Global Qt namespace that provides enums and constants similar to the Qt framework
 */
export enum Qt {
    // Alignment flags
    AlignLeft = 0x0001,
    AlignRight = 0x0002,
    AlignHCenter = 0x0004,
    AlignJustify = 0x0008,

    AlignTop = 0x0020,
    AlignBottom = 0x0040,
    AlignVCenter = 0x0080,

    AlignCenter = AlignVCenter | AlignHCenter,

    TextSingleLine = 0x0100,
    TextDontClip = 0x0200,
    TextWordWrap = 0x0400,
    TextBreakAnywhere = 0x0800,

    // Orientation
    Horizontal = 0x1,
    Vertical = 0x2,

    // Size policies
    Fixed = 0,
    Minimum = 1,
    Maximum = 2,
    Preferred = 3,
    MinimumExpanding = 4,
    Expanding = 5,
    Ignored = 6,

    // Window flags
    Widget = 0x00000000,
    Window = 0x00000001,
    Dialog = 0x00000002,
    Sheet = 0x00000004,
    Popup = 0x00000008,
    Tool = 0x00000010,
    ToolTip = 0x00000020,
    SplashScreen = 0x00000040,
    Desktop = 0x00000080,
    SubWindow = 0x00000100,

    // Key modifier flags
    NoModifier = 0x00000000,
    ShiftModifier = 0x02000000,
    ControlModifier = 0x04000000,
    AltModifier = 0x08000000,
    MetaModifier = 0x10000000,
    KeypadModifier = 0x20000000,

    // Connection types - referenced in QObject.ts
    AutoConnection = 0,
    DirectConnection = 1,
    QueuedConnection = 2,
    BlockingQueuedConnection = 3,
    UniqueConnection = 0x80,

    // TextFormat - referenced in QLabel.ts
    PlainText = 0,
    RichText = 1,
    AutoText = 2,
    MarkdownText = 3,

    // CheckState - referenced in QCheckBox.ts
    Unchecked = 0,
    PartiallyChecked = 1,
    Checked = 2,

    // FocusPolicy - referenced in QWidget.ts
    NoFocus = 0,
    TabFocus = 1,
    ClickFocus = 2,
    StrongFocus = TabFocus | ClickFocus,
    WheelFocus = StrongFocus | 0x4,

    // SizeConstraint - referenced in QLayout.ts
    SetDefaultConstraint = 0,
    SetNoConstraint = 1,
    SetMinimumSize = 2,
    SetFixedSize = 3,
    SetMaximumSize = 4,
    SetMinAndMaxSize = 5,

    // LayoutDirection
    LeftToRight = 0,
    RightToLeft = 1,
    LayoutDirectionAuto = 2
}

// Define namespace objects to store the enum values within the Qt namespace
// This makes Qt.SizePolicy.Fixed work as expected in the code
export namespace Qt {
    export enum ConnectionType {
        AutoConnection = Qt.AutoConnection,
        DirectConnection = Qt.DirectConnection,
        QueuedConnection = Qt.QueuedConnection,
        BlockingQueuedConnection = Qt.BlockingQueuedConnection,
        UniqueConnection = Qt.UniqueConnection
    }

    export enum Alignment {
        AlignLeft = Qt.AlignLeft,
        AlignRight = Qt.AlignRight,
        AlignHCenter = Qt.AlignHCenter,
        AlignJustify = Qt.AlignJustify,
        AlignTop = Qt.AlignTop,
        AlignBottom = Qt.AlignBottom,
        AlignVCenter = Qt.AlignVCenter,
        AlignCenter = Qt.AlignCenter
    }

    export enum TextFormat {
        PlainText = Qt.PlainText,
        RichText = Qt.RichText,
        AutoText = Qt.AutoText,
        MarkdownText = Qt.MarkdownText
    }

    export enum CheckState {
        Unchecked = Qt.Unchecked,
        PartiallyChecked = Qt.PartiallyChecked,
        Checked = Qt.Checked
    }

    export enum FocusPolicy {
        NoFocus = Qt.NoFocus,
        TabFocus = Qt.TabFocus,
        ClickFocus = Qt.ClickFocus,
        StrongFocus = Qt.StrongFocus,
        WheelFocus = Qt.WheelFocus
    }

    export enum SizeConstraint {
        SetDefaultConstraint = Qt.SetDefaultConstraint,
        SetNoConstraint = Qt.SetNoConstraint,
        SetMinimumSize = Qt.SetMinimumSize,
        SetFixedSize = Qt.SetFixedSize,
        SetMaximumSize = Qt.SetMaximumSize,
        SetMinAndMaxSize = Qt.SetMinAndMaxSize
    }

    export enum LayoutDirection {
        LeftToRight = Qt.LeftToRight,
        RightToLeft = Qt.RightToLeft,
        LayoutDirectionAuto = Qt.LayoutDirectionAuto
    }

    export enum SizePolicy {
        Fixed = Qt.Fixed,
        Minimum = Qt.Minimum,
        Maximum = Qt.Maximum,
        Preferred = Qt.Preferred,
        MinimumExpanding = Qt.MinimumExpanding,
        Expanding = Qt.Expanding,
        Ignored = Qt.Ignored
    }

    // Adding the SizePolicy namespace with a create method
    export namespace SizePolicy {
        /**
         * Creates a size policy with the given horizontal and vertical policies
         * @param horizontal The horizontal size policy (default: Preferred)
         * @param vertical The vertical size policy (default: Preferred)
         * @returns A QSizePolicy object
         */
        export function create(horizontal?: number, vertical?: number): QSizePolicy {
            return { 
                horizontal: horizontal !== undefined ? horizontal : Qt.Preferred, 
                vertical: vertical !== undefined ? vertical : Qt.Preferred 
            };
        }
    }

    export enum AlignmentFlag {
        AlignLeft = 0x0001,
        AlignRight = 0x0002,
        AlignHCenter = 0x0004,
        AlignJustify = 0x0008,
        
        AlignTop = 0x0020,
        AlignBottom = 0x0040,
        AlignVCenter = 0x0080,
        
        AlignCenter = AlignHCenter | AlignVCenter
    }
}

// Export types for enums
export type QtConnectionType = typeof Qt.ConnectionType;
export type QtAlignment = typeof Qt.Alignment;
export type QtTextFormat = typeof Qt.TextFormat;
export type QtCheckState = typeof Qt.CheckState;
export type QtFocusPolicy = typeof Qt.FocusPolicy;
export type QtSizeConstraint = typeof Qt.SizeConstraint;
export type QtLayoutDirection = typeof Qt.LayoutDirection;
