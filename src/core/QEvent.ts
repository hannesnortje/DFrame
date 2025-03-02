export enum EventType {
    None = 0,
    Timer = 1,
    MouseButtonPress = 2,
    MouseButtonRelease = 3,
    MouseButtonDblClick = 4,
    MouseMove = 5,
    KeyPress = 6,
    KeyRelease = 7,
    FocusIn = 8,
    FocusOut = 9,
    Enter = 10,
    Leave = 11,
    Paint = 12,
    Move = 13,
    Resize = 14,
    Show = 15,
    Hide = 16,
    Close = 17,
    WindowActivate = 18,
    WindowDeactivate = 19,
    DragEnter = 20,
    DragMove = 21,
    DragLeave = 22,
    Drop = 23,
    ChildAdded = 24,
    ChildRemoved = 25,
    Wheel = 26
}

export class QEvent {
    private static nextCustomType = 1000;
    private accepted: boolean = true;
    private type: EventType;

    constructor(type: EventType) {
        this.type = type;
    }

    getType(): EventType {
        return this.type;
    }

    accept(): void {
        this.accepted = true;
    }

    ignore(): void {
        this.accepted = false;
    }

    isAccepted(): boolean {
        return this.accepted;
    }

    static registerEventType(hint: number = -1): number {
        if (hint >= 0) {
            QEvent.nextCustomType = Math.max(hint, QEvent.nextCustomType);
        }
        return QEvent.nextCustomType++;
    }
}
