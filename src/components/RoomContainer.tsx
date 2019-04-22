import React, { Fragment, Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { Layout, Typography } from 'antd'

import LoadingSpinner from './LoadingSpinner'
import Message from './Message'
import { trySendMessage } from '../actions/rooms'

const { Header, Content } = Layout
const { Title } = Typography

const ChatWrapper = styled.div`
	height: 100%;
	padding: 24;
	display: flex;
	flex-direction: column;
	background: '#fff';
`

const Messages = styled.div`
	flex-grow: 1;
	overflow-y: scroll;
	overflow-x: hidden;
`

const InputForm = styled.form`
	height: 44px;
	background-color: #fff;
	border-radius: 4px;
	border: 1px solid #acacac;
	display: flex;
	flex-direction: row;
	flex-shrink: 0;
	margin-top: 10px;
`

const Input = styled.input`
	padding-left: 14px;
	border: none;
	border-radius: 4px;
	flex-grow: 1;
	outline: none;
`

const SendButton = styled.button`
	flex-shrink: 0;
	padding: 0px 15px;
	background: none;
	border: none;
`

interface Props {
	auth: Auth
	room: RoomItem | { id: null; name: string; messages: any[] }
	isLoading: boolean
	messages: Message[]
	trySendMessage: (text: string, roomId: string, status?: boolean) => void
}

class RoomContainer extends Component<Props> {
	state = {
		messageValue: '',
	}

	messagesEnd: any = null
	messagesContainer: HTMLElement | null = null

	componentDidMount() {
		this.scrollToBottom()
	}

	componentDidUpdate(prevProps: Props) {
		if (prevProps.messages.length === 0 && this.props.messages.length > 0) {
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

	handleTyping = (e: any) => {
		this.setState({ messageValue: e.target.value })
	}

	scrollToBottom = () => {
		if (this.messagesEnd) {
			this.messagesEnd.scrollIntoView({ behavior: 'auto' })
		}
	}

	handleSend = (e: any) => {
		e.preventDefault()
		const { room } = this.props
		const text = this.state.messageValue
		if (!!room.id && text.length > 0) {
			this.props.trySendMessage(text, room.id)
			this.setState({
				messageValue: '',
			})
		}
	}

	render() {
		const { room, messages, isLoading } = this.props
		// console.log(messages)
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
					<InputForm onSubmit={this.handleSend}>
						<Input
							value={this.state.messageValue}
							onChange={this.handleTyping}
						/>
						<SendButton type={'submit'}>Send</SendButton>
					</InputForm>
				</ChatWrapper>
			)
		}
		return (
			<Fragment>
				<Header
					style={{
						background: '#fff',
						borderBottom: '1px solid #acacac',
						padding: 16,
						display: 'flex',
						flexDirection: 'row',
						alignItems: 'center',
					}}
				>
					<Title style={{ margin: 0 }} level={3}>
						# {room.name}
					</Title>
				</Header>
				<Content
					style={{
						margin: '24px 16px',
						overflow: 'initial',
					}}
				>
					{content}
				</Content>
			</Fragment>
		)
	}
}

const mapStateToProps = (state: StoreState, ownProps: any) => {
	const { roomId } = ownProps.match.params
	const room = state.rooms.joined.find(room => room.id === roomId)
	const messages = room ? room.messages : []
	return {
		auth: state.auth,
		room: room || { id: null, name: '', messages: [] },
		messages,
		isLoading: !room,
	}
}

export default connect(
	mapStateToProps,
	{ trySendMessage },
)(RoomContainer)
