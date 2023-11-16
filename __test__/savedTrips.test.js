
// Mock global para o jQuery
global.$ = jest.fn(() => ({
  on: jest.fn(),
  ready: jest.fn(),
  val: jest.fn(),
  click: jest.fn(),
}));

jest.mock('../src/client/js/formHandler', () => ({
  handleFormSubmit: jest.fn(),
}));

jest.mock('../src/client/js/updateUI', () => ({
  updateUI: jest.fn(),
}));


import { saveTrip, getTrips } from '../src/client/js/savedTrips';

// Mock local storage
const localStorageMock = (function() {
    let store = {};
    return {
        getItem: function(key) {
            return store[key] || null;
        },
        setItem: function(key, value) {
            store[key] = value.toString();
        },
        clear: function() {
            store = {};
        }
    };
})();

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
});

describe('saveTrip', () => {
    beforeEach(() => {
        // Clears the local storage before each test
        localStorage.clear();
    });

    it('should save a trip to local storage', () => {
        const trip = { name: 'Paris', date: '2023-01-01' };
        saveTrip(trip);
        const trips = getTrips();
        expect(trips).toEqual([trip]);
    });
});
