import { AppPage } from './app.po';

describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('otoneuro-login', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Login Otoneuro!');
  });
});
