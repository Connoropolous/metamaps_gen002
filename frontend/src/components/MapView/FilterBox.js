import React, { Component, PropTypes } from 'react'

class FilterBox extends Component {
  static propTypes = {
    isMap: PropTypes.bool,
    filterBoxHtml: PropTypes.string
  }

  render () {
    const { filterBoxHtml } = this.props
    const html = {__html: filterBoxHtml}
    return <div className="sidebarFilterBox upperRightBox" dangerouslySetInnerHTML={html}></div>
  }
}

export default FilterBox
