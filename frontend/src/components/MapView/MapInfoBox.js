import React, { Component, PropTypes } from 'react'

class MapInfoBox extends Component {
  static propTypes = {
    currentUser: PropTypes.object,
    map: PropTypes.object
  }

  render () {
    const { currentUser, map } = this.props
    if (!map) return null

    let name, contributors_class, contributor_image, contributor_list,
        contributor_count, topic_count, synapse_count, map_creator_tip,
        permission, desc, user_name, created_at, updated_at
    return <div className="mapInfoBox mapElement mapElementHidden permission">
      <div className="requestTitle">Click here to name this map</div>
      <div className="mapInfoName" id="mapInfoName">{name}</div>
      <div className="mapInfoStat">
        <div className="infoStatIcon mapContributors hoverForTip">
          <img id="mapContribs" className="{contributors_class}"
            width="25" height="25" src="{contributor_image}" />
          <span className="count">{contributor_count}</span>
          <div className="tip">{contributor_list}</div>
        </div>
        <div className="infoStatIcon mapTopics">
          {topic_count}
        </div>
        <div className="infoStatIcon mapSynapses">
          {synapse_count}
        </div>
        <div className={`infoStatIcon mapPermission ${permission} hoverForTip`}>
          {map_creator_tip}
        </div>
        <div className="clearfloat"></div>
      </div>
      <div className="mapInfoDesc" id="mapInfoDesc">
        {desc}
      </div>
      <div className="mapInfoMeta">
        <p className="mapCreatedAt"><span>Created by:</span> {user_name} on {created_at}</p>
        <p className="mapEditedAt"><span>Last edited:</span> {updated_at}</p>
        <div className="mapInfoButtonsWrapper">
          <div className="mapInfoThumbnail">
            <div className="thumbnail"></div>
            <div className="tooltip">Update Thumbnail</div>
            <span>Thumb</span>
          </div>
          <div className="mapInfoDelete">
            <div className="deleteMap"></div>
            <span>Delete</span>
          </div>
          <div className="mapInfoShare">
            <div className="mapInfoShareIcon"></div>
            <span>Share</span>
          </div>
        </div>
      </div>
    </div>
  }
}

export default MapInfoBox
