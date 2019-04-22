import React, { FunctionComponent } from 'react'
import styled from 'styled-components'

const MessageLayout = styled.div`
	display: flex;
	flex-direction: row;
	min-height: 40px;
`

const LeftPanel = styled.div``
const Avatar = styled.div`
	width: 35px;
	height: 35px;
	margin: 5px;
	border-radius: 2px;
	background-color: #cecece;
`

const RightPanel = styled.div``

const MessageHeader = styled.div`
	color: black;
	font-weight: bold;
	margin-top: 2px;
`

interface Props {
	name: string
}

const Message: FunctionComponent<Props> = ({ children, name }) => (
	<MessageLayout>
		<LeftPanel>
			<Avatar />
		</LeftPanel>
		<RightPanel>
			<MessageHeader>{name}</MessageHeader>
			{children}
		</RightPanel>
	</MessageLayout>
)

export default Message
