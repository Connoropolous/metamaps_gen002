import React, { Component, PropTypes } from 'react'

import FilterBox from './FilterBox'

class MapButtons extends Component {
  static propTypes = {
    currentUser: PropTypes.object,
    canEditMap: PropTypes.bool,
    onImportClick: PropTypes.func,
    onForkClick: PropTypes.func,
    onFilterClick: PropTypes.func,
    filterBoxHtml: PropTypes.string
  }

  render () {
    const { currentUser, canEditMap, filterBoxHtml, onFilterClick, onImportClick, onForkClick } = this.props
    return <div className="mapElement upperRightEl upperRightMapButtons upperRightUI">
      {canEditMap && <div className="importDialog upperRightEl upperRightIcon mapElement" onClick={onImportClick}>
        <div className="tooltipsUnder">
          Import Data
        </div>
      </div>}
      <div className="sidebarFilter upperRightEl">
        <div className="sidebarFilterIcon upperRightIcon" onClick={onFilterClick}>
          <div className="tooltipsUnder">Filter</div>
        </div>
        <FilterBox filterBoxHtml={filterBoxHtml} />
      </div>
      {currentUser && <div className="sidebarFork upperRightEl">
        <div className="sidebarForkIcon upperRightIcon" onClick={onForkClick}>
          <div className="tooltipsUnder">Save To New Map</div>
        </div>
      </div>}
      <div className="clearfloat"></div>
    </div>
  }
}

export default MapButtons
