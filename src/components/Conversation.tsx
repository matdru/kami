import React from 'react'
import styled from 'styled-components'
import { Button } from 'antd'
import VsibilitySensor from 'react-visibility-sensor'

import Message from '../components/Message'
import ChatInput from '../components/ChatInput'

const ChatWrapper = styled.div`
	/* height: 100%; */
	width: 100%;
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

const TopAnchor = styled.div`
	width: 100%;
	height: 60px;
	display: flex;
	justify-content: center;
	align-items: center;
`

const BottomAnchor = styled.div`
	float: left;
	clear: both;
`

interface Props {
	room: RoomItem | undefined
	messages: Message[]
	onLoadMoreVisibilityChange: (isVisible: boolean) => void
	getMessagesRef: (ref: any) => void
	getBottomAnchorRef: (ref: any) => void
}

const Conversation = ({
	room,
	messages,
	getMessagesRef,
	getBottomAnchorRef,
	onLoadMoreVisibilityChange,
}: Props) => (
	<ChatWrapper>
		<Messages ref={getMessagesRef}>
			<TopAnchor>
				<VsibilitySensor onChange={onLoadMoreVisibilityChange}>
					<Button>Load more</Button>
				</VsibilitySensor>
			</TopAnchor>
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
			<BottomAnchor ref={getBottomAnchorRef} />
		</Messages>
		<ChatInput room={room} />
	</ChatWrapper>
)

export default Conversation
