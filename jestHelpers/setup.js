import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

global.cozy = {}

jest.mock('cozy-intent', () => ({
  useWebviewIntent: jest.fn()
}))

Enzyme.configure({ adapter: new Adapter() })
// see https://github.com/jsdom/jsdom/issues/1695
window.HTMLElement.prototype.scroll = function () {}
