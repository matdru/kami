import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { trySendMessage } from '../actions/rooms'

const InputForm = styled.form`
	height: 44px;
	background-color: #fff;
	border-radius: 4px;
	border: 1px solid #acacac;
	display: flex;
	flex-direction: row;
	flex-shrink: 0;
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
	room: RoomItem | undefined
	trySendMessage: (text: string, roomId: string) => void
}

interface State {
	value: string
}

class ChatInput extends Component<Props, State> {
	state = {
		value: '',
	}

	handleTyping = (e: any) => {
		this.setState({ value: e.target.value })
	}

	handleSend = (e: any) => {
		e.preventDefault()
		const { room } = this.props
		const text = this.state.value
		if (!!room && !!room.id && text.length > 0) {
			this.props.trySendMessage(text, room.id)
			this.setState({
				value: '',
			})
		}
	}

	render() {
		return (
			<InputForm onSubmit={this.handleSend}>
				<Input value={this.state.value} onChange={this.handleTyping} />
				<SendButton type={'submit'}>Send</SendButton>
			</InputForm>
		)
	}
}

export default connect(
	null,
	{ trySendMessage },
)(ChatInput)
