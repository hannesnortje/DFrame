import { QSpacer } from './QSpacer';
import { Qt } from '../core/Qt';

describe('QSpacer', () => {
    test('should create a default spacer', () => {
        const spacer = new QSpacer();
        
        expect(spacer.getHorizontalPolicy()).toBe(Qt.Expanding);
        expect(spacer.getVerticalPolicy()).toBe(Qt.Expanding);
        
        const element = spacer.getElement();
        expect(element.style.minWidth).toBe('0px');
        expect(element.style.minHeight).toBe('0px');
        expect(element.style.background).toBe('transparent');
    });
    
    test('should create a horizontal spacer', () => {
        const spacer = QSpacer.createHorizontal(20);
        
        expect(spacer.getHorizontalPolicy()).toBe(Qt.Expanding);
        expect(spacer.getVerticalPolicy()).toBe(Qt.Fixed);
        
        const element = spacer.getElement();
        expect(element.style.minWidth).toBe('20px');
        expect(element.style.minHeight).toBe('0px');
    });
    
    test('should create a vertical spacer', () => {
        const spacer = QSpacer.createVertical(30);
        
        expect(spacer.getHorizontalPolicy()).toBe(Qt.Fixed);
        expect(spacer.getVerticalPolicy()).toBe(Qt.Expanding);
        
        const element = spacer.getElement();
        expect(element.style.minWidth).toBe('0px');
        expect(element.style.minHeight).toBe('30px');
    });
    
    test('should set size policies', () => {
        const spacer = new QSpacer();
        
        spacer.setHorizontalPolicy(Qt.Minimum);
        spacer.setVerticalPolicy(Qt.Minimum);
        
        expect(spacer.getHorizontalPolicy()).toBe(Qt.Minimum);
        expect(spacer.getVerticalPolicy()).toBe(Qt.Minimum);
    });
});
