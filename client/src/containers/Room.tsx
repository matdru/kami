import React, { Component } from 'react'
import { connect } from 'react-redux'

import Conversation from '../components/Conversation'
import Room from '../components/Room'

import { trySendMessage, tryFetchMoreMessages } from '../actions/rooms'
import getProps from '../selectors/room'

interface State {
	loadMoreVisible: boolean | null
}

interface Props {
	auth: Auth
	room: RoomItem | undefined
	match: any
	isLoading: boolean
	messages: Message[]
	trySendMessage: (text: string, roomId: string, status?: boolean) => void
	tryFetchMoreMessages: (roomId: string) => void
}

class RoomContainer extends Component<Props, State> {
	messagesEnd: any = null
	messagesContainer: HTMLElement | null = null

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
			if (
				previousLastMessage.id !== currentLastMessage.id &&
				!!currentLastMessage &&
				currentLastMessage.sender.uid === this.props.auth.uid
			) {
				// last message was ours, scroll to the bottom
				this.scrollToBottom()
			} else if (this.messagesContainer) {
				// last message is not ours, lets check scroll
				const { scrollHeight, scrollTop, clientHeight } = this.messagesContainer

				// if our scroll is around bottom 2 messages, scroll to bottom pls
				if (Math.abs(clientHeight - (scrollHeight - scrollTop - 45)) < 45) {
					this.scrollToBottom()
				}
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
			console.log('load more messages')
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
					getMessagesRef={ref => (this.messagesContainer = ref)}
					getBottomAnchorRef={ref => (this.messagesEnd = ref)}
				/>
			</Room>
		)
	}
}

const mapStateToProps = (state: StoreState, ownProps: any) =>
	getProps(state, ownProps)
export default connect(
	mapStateToProps,
	{ trySendMessage, tryFetchMoreMessages },
)(RoomContainer)
