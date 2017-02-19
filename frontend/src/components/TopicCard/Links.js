/* global $ */

import React, { PropTypes, Component } from 'react'

import MetacodeSelect from '../MetacodeSelect'
import Permission from './Permission'

// TODO use a callback instead of an import
import Visualize from '../../Metamaps/Visualize'

const inmaps = (topic) => {
  const inmapsArray = topic.get('inmaps') || []
  const inmapsLinks = topic.get('inmapsLinks') || []

  let html = ''
  if (inmapsArray.length < 6) {
    for (let i = 0; i < inmapsArray.length; i++) {
      const url = '/maps/' + inmapsLinks[i]
      html += '<li><a href="' + url + '">' + inmapsArray[i] + '</a></li>'
    }
  } else {
    for (let i = 0; i < 5; i++) {
      const url = '/maps/' + inmapsLinks[i]
      html += '<li><a href="' + url + '">' + inmapsArray[i] + '</a></li>'
    }
    const extra = inmapsArray.length - 5
    html += '<li><span class="showMore">See ' + extra + ' more...</span></li>'
    for (let i = 5; i < inmapsArray.length; i++) {
      const url = '/maps/' + inmapsLinks[i]
      html += '<li class="hideExtra extraText"><a href="' + url + '">' + inmapsArray[i] + '</a></li>'
    }
  }

  return html
}

// TODO all of these should be largely turned into passed-in callbacks
const bindShowCardListeners = (topic, ActiveMapper) => {
  $('.links .mapCount').unbind().click(function(event) {
    $('.mapCount .tip').toggle()
    $('.showcard .hoverTip').toggleClass('hide')
  })
  $('.showcard').unbind('.hideTip').bind('click.hideTip', function() {
    $('.mapCount .tip').hide()
    $('.showcard .hoverTip').removeClass('hide')
  })

  var originalText = $('.showMore').html()
  $('.mapCount .tip .showMore').unbind().toggle(
    function(event) {
      $('.extraText').toggleClass('hideExtra')
      $('.showMore').html('Show less...')
    },
    function(event) {
      $('.extraText').toggleClass('hideExtra')
      $('.showMore').html(originalText)
    }
  )
}

class Links extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showMetacodeTitle: false,
      showMetacodeSelect: false
    }
  }

  componentDidMount = () => {
    bindShowCardListeners(this.props.topic, this.props.ActiveMapper)
  }

  handleMetacodeSelect = metacodeId => {
    this.props.updateTopic({
      metacode_id: metacodeId
    })
    Visualize.mGraph.plot()
  }

  render = () => {
    const { topic, ActiveMapper } = this.props
    const metacode = topic.getMetacode()

    return (
      <div className="links">
        <div className="linkItem icon metacodeItem"
          style={{ zIndex: this.state.showMetacodeTitle ? 4 : 1 }}
          onMouseLeave={() => this.setState({ showMetacodeTitle: false, showMetacodeSelect: false })}
        >
          <div className={`metacodeTitle mbg${metacode.get('id')}`}
						style={{ display: this.state.showMetacodeTitle ? 'block' : 'none' }}
					>
						{metacode.get('name')}
						<div className="expandMetacodeSelect"
							onClick={() => this.setState({ showMetacodeSelect: !this.state.showMetacodeSelect })}
						/>
					</div>
					<div className="metacodeImage"
						style={{backgroundImage: `url(${metacode.get('icon')})`}}
						title="click and drag to move card"
						onMouseEnter={() => this.setState({ showMetacodeTitle: true })}
					/>
					<div className="metacodeSelect"
						style={{ display: this.state.showMetacodeSelect ? 'block' : 'none' }}
					>
            <MetacodeSelect onMetacodeSelect={this.handleMetacodeSelect} metacodeSets={this.props.metacodeSets} />
					</div>
				</div>
        <div className="linkItem contributor">
          <a href={`/explore/mapper/${topic.get('user_id')}`} target="_blank"><img src={topic.get('user_image')} className="contributorIcon" width="32" height="32" /></a>
          <div className="contributorName">{topic.get('user_name')}</div>
        </div>
        <div className="linkItem mapCount">
          <div className="mapCountIcon"></div>
          {topic.get('map_count').toString()}
          <div className="hoverTip">Click to see which maps topic appears on</div>
          <div className="tip"><ul>{inmaps(topic)}</ul></div>
        </div>
        <a href={`/topics/${topic.id}`} target="_blank" className="linkItem synapseCount">
          <div className="synapseCountIcon"></div>
          {topic.get('synapse_count').toString()}
          <div className="tip">Click to see this topics synapses</div>
        </a>
        <Permission
          topic={topic}
          ActiveMapper={ActiveMapper}
          updateTopic={this.props.updateTopic}
        />
        <div className="clearfloat"></div>
      </div>
    )
  }
}

Links.propTypes = {
  topic: PropTypes.object, // backbone object
  ActiveMapper: PropTypes.object,
  updateTopic: PropTypes.func,
  metacodeSets: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    metacodes: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      icon_path: PropTypes.string, // url
      name: PropTypes.string
    }))
  }))
}

export default Links
