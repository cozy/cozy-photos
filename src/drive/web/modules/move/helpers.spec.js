import CozyClient from 'cozy-client'

import { cancelMove } from 'drive/web/modules/move/helpers'
import { CozyFile } from 'models'

jest.mock('cozy-doctypes')
jest.mock('cozy-stack-client')

CozyFile.doctype = 'io.cozy.files'

const getSpy = jest.fn().mockResolvedValue({
  data: { id: 'fakeDoc', _type: 'io.cozy.files' }
})
const refreshSpy = jest.fn()
const restoreSpy = jest.fn()
const collectionSpy = jest.fn(() => ({
  get: getSpy,
  restore: restoreSpy
}))
const mockClient = new CozyClient({
  stackClient: {
    collection: collectionSpy,
    on: jest.fn()
  }
})

describe('cancelMove', () => {
  const defaultEntries = [
    {
      _id: 'bill_201901',
      dir_id: 'bills',
      name: 'bill_201901.pdf'
    },
    {
      _id: 'bill_201902',
      dir_id: 'bills',
      name: 'bill_201902.pdf'
    },
    // shared file:
    {
      _id: 'bill_201903',
      dir_id: 'bills',
      name: 'bill_201903.pdf'
    }
  ]
  const setup = async ({
    entries = defaultEntries,
    trashedFiles = []
  } = {}) => {
    return cancelMove({
      client: mockClient,
      entries: entries,
      trashedFiles: trashedFiles,
      registerCancelable: promise => promise,
      refreshSharing: refreshSpy
    })
  }

  it('should move items back to their previous location', async () => {
    await setup()

    expect(CozyFile.move).toHaveBeenCalledWith('bill_201901', {
      folderId: 'bills'
    })
    expect(CozyFile.move).toHaveBeenCalledWith('bill_201902', {
      folderId: 'bills'
    })
    expect(restoreSpy).not.toHaveBeenCalled()
    expect(refreshSpy).toHaveBeenCalled()
  })

  it('should restore files that have been trashed due to conflicts', async () => {
    await setup({
      entries: [],
      trashedFiles: ['trashed-1', 'trashed-2']
    })

    expect(collectionSpy).toHaveBeenCalledWith('io.cozy.files')
    expect(restoreSpy).toHaveBeenCalledWith('trashed-1')
    expect(restoreSpy).toHaveBeenCalledWith('trashed-2')
    expect(refreshSpy).toHaveBeenCalled()
  })
})