import React, { Fragment, Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { Layout, Typography } from 'antd'

import LoadingSpinner from '../components/LoadingSpinner'
import Message from '../components/Message'
import ChatInput from '../components/ChatInput'
import AppHeader from './AppHeader'

import { trySendMessage } from '../actions/rooms'
import getProps from '../selectors/room'

const { Content } = Layout

const ChatWrapper = styled.div`
	height: 100%;
	padding: 24;
	display: flex;
	flex-direction: column;
	background: '#fff';
`

const Messages = styled.div`
	padding-top: 8px;
	padding-bottom: 8px;
	flex-grow: 1;
	overflow-y: scroll;
	overflow-x: hidden;
`

interface Props {
	auth: Auth
	room: RoomItem | undefined
	match: any
	isLoading: boolean
	messages: Message[]
	trySendMessage: (text: string, roomId: string, status?: boolean) => void
}

class RoomContainer extends Component<Props> {
	messagesEnd: any = null
	messagesContainer: HTMLElement | null = null

	componentWillMount() {
		const { roomId } = this.props.match.params
		console.log(roomId)
	}

	componentDidMount() {
		this.scrollToBottom()
	}

	componentDidUpdate(prevProps: Props) {
		if (prevProps.messages.length === 0 && this.props.messages.length > 0) {
			this.scrollToBottom()
			return
		}

		// scroll management
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
				const {
					scrollHeight,
					scrollTop,
					offsetHeight,
					clientHeight,
				} = this.messagesContainer
				const calculato = scrollHeight - scrollTop === clientHeight

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

	render() {
		const { room, messages, isLoading } = this.props
		let content = <LoadingSpinner />
		if (!isLoading) {
			content = (
				<ChatWrapper>
					<Messages
						ref={el => {
							this.messagesContainer = el
						}}
					>
						{messages.map((message, idx) => (
							<Message
								isConsecutive={
									!!messages[idx - 1] &&
									messages[idx - 1].sender.uid === message.sender.uid
								}
								name={message.sender.displayName || ''}
								key={message.id}
							>
								{message.text}
							</Message>
						))}
						<div
							style={{ float: 'left', clear: 'both' }}
							ref={el => {
								this.messagesEnd = el
							}}
						/>
					</Messages>
					<ChatInput room={this.props.room} />
				</ChatWrapper>
			)
		}
		return (
			<Fragment>
				<AppHeader room={room} />
				<Content
					style={{
						margin: '0px 16px 24px 16px',
						overflow: 'initial',
					}}
				>
					{content}
				</Content>
			</Fragment>
		)
	}
}

const mapStateToProps = (state: StoreState, ownProps: any) => getProps(state, ownProps)
export default connect(
	mapStateToProps,
	{ trySendMessage },
)(RoomContainer)
