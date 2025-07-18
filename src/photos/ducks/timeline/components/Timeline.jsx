import React, { Component } from 'react'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'
import { useAlert } from 'cozy-ui/transpiled/react/providers/Alert'
import PropTypes from 'prop-types'
import styles from '../../../styles/layout.styl'

import { Content } from 'cozy-ui/transpiled/react/Layout'
import Topbar from '../../../components/Topbar'
import Toolbar from './Toolbar'
import DeleteConfirm from './DeleteConfirm'
import PhotoBoard from '../../../components/PhotoBoard'

import { addToUploadQueue } from '../../upload'
import { AddToAlbumModal, belongsToAlbums } from '../../albums'
import Selection from '../../selection'

import {
  getReferencedFolders,
  getOrCreateFolderWithReference,
  REF_PHOTOS,
  REF_UPLOAD
} from 'folder-references'
import { useClient } from 'cozy-client'
import { Outlet } from 'react-router-dom'

const getUploadDir = async (client, t) => {
  const referencedFolders = await getReferencedFolders(client, REF_UPLOAD)

  if (referencedFolders.length > 0) {
    return referencedFolders[0]._id
  } else {
    await getOrCreateFolderWithReference(
      client,
      `/${t('UploadQueue.path_photos')}`,
      REF_PHOTOS
    )
    const uploadDir = await getOrCreateFolderWithReference(
      client,
      `/${t('UploadQueue.path_photos')}/${t('UploadQueue.path_upload')}`,
      REF_UPLOAD
    )

    return uploadDir._id
  }
}

class Timeline extends Component {
  state = {
    showAddAlbumModal: false
  }
  static contextTypes = {
    store: PropTypes.object.isRequired
  }

  showAddAlbumModal = () => {
    this.setState(state => ({ ...state, showAddAlbumModal: true }))
  }
  hideAddAlbumModal = () => {
    this.setState(state => ({ ...state, showAddAlbumModal: false }))
  }

  uploadPhotos = async photos => {
    const { uploadPhoto, client, t, showAlert } = this.props
    const uploadDirId = await getUploadDir(client, t)

    this.dispatch(
      addToUploadQueue({
        files: photos,
        callback: photo => uploadPhoto(photo, uploadDirId),
        showAlert,
        t
      })
    )
  }

  downloadPhotos = photos => {
    this.props.client.collection('io.cozy.files').downloadArchive(
      photos.map(({ _id }) => _id),
      'selected'
    )
  }

  closeModal = () => {
    this.setState({
      displayModal: false,
      selected: null,
      clearSelection: null
    })
  }
  showDeleteConfirm = () => {
    const { selected, clearSelection } = this.state
    return (
      <DeleteConfirm
        t={this.props.t}
        count={selected.length}
        related={belongsToAlbums(selected)}
        onClose={this.closeModal}
        confirm={async () => {
          await Promise.all(selected.map(p => this.props.deletePhoto(p))).then(
            clearSelection
          )
          this.closeModal()
        }}
      />
    )
  }
  deletePhotos = (selected, clearSelection) => {
    this.setState({
      displayModal: true,
      selected,
      clearSelection
    })
  }

  dispatch(action) {
    return this.context.store.dispatch(action)
  }

  render() {
    const { t, lists, fetchStatus, hasMore, fetchMore, lastFetch } = this.props
    return (
      <Selection
        actions={selection => ({
          'album-add': this.showAddAlbumModal,
          download: this.downloadPhotos,
          trash: selected => this.deletePhotos(selected, selection.clear)
        })}
      >
        {(selected, active, selection) => (
          <Content className="u-pt-0-s u-pt-1">
            <div
              data-testid="timeline-pho-content-wrapper"
              className={styles['pho-content-wrapper']}
            >
              <Topbar viewName="photos">
                <Toolbar
                  disabled={active}
                  uploadPhotos={this.uploadPhotos}
                  selectItems={selection.show}
                  t={t}
                />
              </Topbar>

              {this.state.displayModal && this.showDeleteConfirm()}
              {this.state.showAddAlbumModal && (
                <AddToAlbumModal
                  onDismiss={this.hideAddAlbumModal}
                  onSuccess={selection.clear}
                  photos={selected}
                />
              )}
              <PhotoBoard
                lists={lists}
                selected={selected}
                photosContext="timeline"
                showSelection={active}
                onPhotoToggle={selection.toggle}
                onPhotosSelect={selection.select}
                onPhotosUnselect={selection.unselect}
                fetchStatus={fetchStatus}
                hasMore={hasMore}
                fetchMore={fetchMore}
                lastFetch={lastFetch}
              />
              <Outlet />
            </div>
          </Content>
        )}
      </Selection>
    )
  }
}

const TimelineWrapper = props => {
  const client = useClient()
  const { t } = useI18n()
  const { showAlert } = useAlert()

  return <Timeline {...props} client={client} t={t} showAlert={showAlert} />
}

export default TimelineWrapper
