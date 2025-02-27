import { QComboBox } from './QComboBox';

describe('QComboBox', () => {
    let combo: QComboBox;

    beforeEach(() => {
        combo = new QComboBox();
    });

    test('should add and remove items', () => {
        combo.addItem('Item 1');
        combo.addItem('Item 2');
        expect(combo.count()).toBe(2);
        combo.removeItem(0);
        expect(combo.count()).toBe(1);
    });

    test('should set and get current index', () => {
        combo.addItem('Item 1');
        combo.addItem('Item 2');
        combo.setCurrentIndex(1);
        expect(combo.currentIndex()).toBe(1);
    });

    test('should handle item text and data', () => {
        combo.addItem('Item 1', { id: 1 });
        expect(combo.itemText(0)).toBe('Item 1');
        expect(combo.itemData(0)).toEqual({ id: 1 });
    });

    test('should emit currentIndexChanged signal', () => {
        const changeHandler = jest.fn();
        combo.connect('currentIndexChanged', changeHandler);
        combo.addItem('Item 1');
        combo.addItem('Item 2');
        combo.setCurrentIndex(1);
        expect(changeHandler).toHaveBeenCalledWith(1);
    });
});
