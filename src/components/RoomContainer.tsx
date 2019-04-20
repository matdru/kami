import React, { Fragment, Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { Layout, Typography, Spin } from 'antd'

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

const LoadingWrapper = styled.div`
	height: 100%;
	padding: 24;
	display: flex;
	flex-direction: column;
	background: '#fff';
	justify-content: center;
	align-items: center;
`

const Messages = styled.div`
	flex-grow: 1;
	overflow: scroll;
`

const Message = styled.div`
	display: flex;
	min-height: 40px;
	border-bottom: 1px solid grey;
`

const InputForm = styled.form`
	height: 50px;
	background-color: #fff;
	border-radius: 4px;
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
`

const SendButton = styled.button`
	flex-shrink: 0;
`

interface Props {
	auth: Auth;
	room: RoomItem | { id: null, name: string, messages: any[] };
	isLoading: boolean;
	messages: any[];
	trySendMessage: (text: string, roomId: string, status?: boolean) => void;
}

class RoomContainer extends Component<Props> {
	state = {
		messageValue: '',
	}

	messagesEnd: any = null

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
		if (!!room.id) {
			const text = this.state.messageValue
			this.props.trySendMessage(text, room.id)
			this.setState({
				messageValue: '',
			})
		}
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
			}
		}

		// check last message, if its mine, scroll to bottom?
	}

	render() {
		const { room, messages, isLoading } = this.props
		// console.log(messages)
		let content = (
			<LoadingWrapper>
				<Spin size="large" />
			</LoadingWrapper>
		)
		if (!isLoading) {
			content = (
				<ChatWrapper>
					<Messages>
						{messages.map(message => (
							<Message key={message.id}>{message.text}</Message>
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
						padding: 16,
						display: 'flex',
						flexRirection: 'row',
						alignItems: 'center',
					}}
				>
					<Title style={{ margin: 0 }} level={3}>
						{room.name}
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
	const room = state.rooms.find(room => room.id === roomId)
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
