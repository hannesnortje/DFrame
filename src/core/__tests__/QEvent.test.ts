import { QEvent, EventType } from '../QEvent';
import { QObject } from '../QObject';

describe('QEvent', () => {
    test('basic event properties', () => {
        const event = new QEvent(EventType.MouseButtonPress);
        expect(event.getType()).toBe(EventType.MouseButtonPress);
        expect(event.isAccepted()).toBeTruthy();
    });

    test('accept and ignore', () => {
        const event = new QEvent(EventType.MouseButtonPress);
        event.ignore();
        expect(event.isAccepted()).toBeFalsy();
        event.accept();
        expect(event.isAccepted()).toBeTruthy();
    });

    test('custom event registration', () => {
        const type1 = QEvent.registerEventType();
        const type2 = QEvent.registerEventType();
        expect(type2).toBeGreaterThan(type1);
        expect(type1).toBeGreaterThanOrEqual(1000);
    });

    test('event filtering', () => {
        const obj = new QObject();
        const filter = new QObject();
        const event = new QEvent(EventType.MouseButtonPress);
        const filterSpy = jest.spyOn(filter, 'eventFilter');

        obj.installEventFilter(filter);
        obj.event(event);

        expect(filterSpy).toHaveBeenCalledWith(obj, event);
    });

    test('event propagation', () => {
        class TestObject extends QObject {
            eventDefault(event: QEvent): boolean {
                if (event.getType() === EventType.MouseButtonPress) {
                    event.ignore();
                    return true;
                }
                return super.eventDefault(event);
            }
        }

        const obj = new TestObject();
        const event = new QEvent(EventType.MouseButtonPress);
        
        expect(obj.event(event)).toBeTruthy();
        expect(event.isAccepted()).toBeFalsy();
    });
});
