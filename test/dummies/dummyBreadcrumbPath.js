const ROOT_DIR_ID = 'io.cozy.files.root-dir'

export const dummyBreadcrumbPath = (breadcrumbPath = []) => [
  { id: ROOT_DIR_ID, name: 'Drive' },
  { id: 'grandParentFolderId', name: 'grandParent' },
  { id: 'parentFolderId', name: 'parent' },
  { id: 'currentFolderId', name: 'current' },
  ...breadcrumbPath
]

export const dummyRootBreadcrumbPath = () => ({
  id: ROOT_DIR_ID,
  name: 'Drive'
})
