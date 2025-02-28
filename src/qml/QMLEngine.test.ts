import { QMLEngine } from './QMLEngine';
import { QtComponents } from './QtComponents';

describe('QMLEngine', () => {
    it('should initialize with built-in components', () => {
        const engine = new QMLEngine();
        const componentKeys = Array.from(engine['components'].keys());
        const expectedKeys = Object.keys(QtComponents);

        expect(componentKeys).toEqual(expectedKeys);
    });
});