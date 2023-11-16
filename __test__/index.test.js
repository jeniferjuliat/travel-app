
const nock = require('nock');
const request = require('supertest');
const app = require('../src/server/index');

describe('GET Country Data', () => {
  beforeAll(() => {
      nock.disableNetConnect(); 
  });

  afterAll(() => {
      nock.enableNetConnect();
  });

  afterEach(() => {
      nock.cleanAll(); 
  });

  it('should fetch country flag for "Brazil"', async () => {
      const mockCountryData = {
          flags: ['https://example.com/flag_of_brazil.png']
      };

      nock('https://restcountries.com')
          .get('/v3/name/Brazil?fullText=true')
          .reply(200, [{ ...mockCountryData }]);

      const response = await request(app)
          .post('/getCountryData')
          .send({ countryName: 'Brazil' });

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ flag: mockCountryData.flags[0] });
  });
});
