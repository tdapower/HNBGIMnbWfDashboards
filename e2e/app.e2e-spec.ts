import { MnbwfDashboardPage } from './app.po';

describe('mnbwf-dashboard App', () => {
  let page: MnbwfDashboardPage;

  beforeEach(() => {
    page = new MnbwfDashboardPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
