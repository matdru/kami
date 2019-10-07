import React, { Component } from 'react'
import { connect } from 'react-redux'

import Conversation from '../components/Conversation'
import Room from '../components/Room'

import { tryFetchMoreMessages } from '../actions/rooms'
import { trySendMessage } from '../actions/messages'
import getProps from '../selectors/room'

interface State {
	loadMoreVisible: boolean | null
}

export interface SelectorProps {
	auth: Auth
	room: RoomItem | undefined
	messages: Message[]
	isLoading: boolean
}

interface DispatchProps {
	trySendMessage: (text: string, roomId: string, status?: boolean) => void
	tryFetchMoreMessages: (roomId: string) => void
}

interface OwnProps {
	match: any
}

type Props = SelectorProps & DispatchProps & OwnProps

class RoomContainer extends Component<Props, State> {
	messagesEnd: any = null
	messagesContainer: HTMLElement | null = null
	scrollData: any = null

	constructor(props: Props) {
		super(props)

		this.state = {
			loadMoreVisible: null,
		}
	}

	componentDidMount() {
		this.scrollToBottom()
	}

	componentDidUpdate(prevProps: Props) {
		// scroll management
		if (prevProps.messages.length === 0 && this.props.messages.length > 0) {
			this.scrollToBottom()
			return
		}

		if (
			prevProps.room &&
			this.props.room &&
			prevProps.room.id !== this.props.room.id
		) {
			this.scrollToBottom()
			return
		}

		if (
			prevProps.messages.length !== this.props.messages.length &&
			prevProps.messages.length > 0 &&
			this.props.messages.length > 0
		) {
			const previousLastMessage = prevProps.messages.slice(-1)[0]
			const currentLastMessage = this.props.messages.slice(-1)[0]
			// if last message is different
			if (previousLastMessage.id !== currentLastMessage.id) {
				if (
					!!currentLastMessage &&
					currentLastMessage.sender.uid === this.props.auth.uid
				) {
					// last message was ours, scroll to the bottom
					this.scrollToBottom()
				} else if (this.messagesContainer) {
					// last message is not ours, lets check scroll
					const {
						scrollHeight,
						scrollTop,
						clientHeight,
					} = this.messagesContainer

					// if our scroll is around bottom 2 messages, scroll to bottom pls
					if (Math.abs(clientHeight - (scrollHeight - scrollTop - 45)) < 45) {
						this.scrollToBottom()
					}
				}
			} else {
				// if we loaded earlier messages we need to restore scroll position
				if (this.scrollData && this.messagesContainer) {
					const { scrollHeight, scrollTop, clientHeight } = this.scrollData
					const scrollBottom = scrollHeight - clientHeight - scrollTop
					if (scrollBottom > 0) {
						const updatedScrollHeight = this.messagesContainer.scrollHeight
						const updatedClientHeight = this.messagesContainer.clientHeight
						const calculatedScrollTop =
							updatedScrollHeight - updatedClientHeight - scrollBottom

						this.messagesContainer.scrollTo({ top: calculatedScrollTop })
					}
				}
			}
		}
	}

	getMessagesRef = (ref: any) => {
		this.messagesContainer = ref
	}

	// TODO improve typings
	handleMessagesScroll = (e: any) => {
		if (e && e.target) {
			let element = e.target
			this.scrollData = {
				scrollHeight: element.scrollHeight,
				scrollTop: element.scrollTop,
				clientHeight: element.clientHeight,
			}
		}
	}

	scrollToBottom = () => {
		if (this.messagesEnd) {
			this.messagesEnd.scrollIntoView({ behavior: 'auto' })
		}
	}

	handleLoadMoreVisibilityChange = (isVisible: any) => {
		const { room } = this.props
		if (isVisible && this.state.loadMoreVisible === false && room) {
			this.props.tryFetchMoreMessages(room.id)
		}

		this.setState({
			loadMoreVisible: isVisible,
		})
	}

	render() {
		const { room, messages, isLoading } = this.props

		return (
			<Room room={room} isLoading={isLoading}>
				<Conversation
					room={room}
					messages={messages}
					onLoadMoreVisibilityChange={this.handleLoadMoreVisibilityChange}
					onMessagesScroll={this.handleMessagesScroll}
					getMessagesRef={this.getMessagesRef}
					getBottomAnchorRef={ref => (this.messagesEnd = ref)}
				/>
			</Room>
		)
	}
}

const mapStateToProps = (state: StoreState, ownProps: any): SelectorProps =>
	getProps(state, ownProps)

export default connect(
	mapStateToProps,
	{ trySendMessage, tryFetchMoreMessages },
)(RoomContainer)
