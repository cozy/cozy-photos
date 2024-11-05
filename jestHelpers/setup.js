global.cozy = {}

jest.mock('cozy-intent', () => ({
  useWebviewIntent: jest.fn()
}))

// see https://github.com/jsdom/jsdom/issues/1695
window.HTMLElement.prototype.scroll = function () {}
