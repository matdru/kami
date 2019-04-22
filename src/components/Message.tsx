import React, { FunctionComponent } from 'react'
import { Avatar } from 'antd'
import styled from 'styled-components'

const MessageLayout = styled.div`
	display: flex;
	flex-direction: row;
	margin-bottom: 2px;
`

const LeftPanel = styled.div`
	width: 46px;
	padding: 5px;
`

// const Avatar = styled.div`
// 	/* width: 35px;
// 	height: 35px;
// 	margin: 5px;
// 	border-radius: 2px;
// 	background-color: #cecece;
// ` */

const RightPanel = styled.div`
	color: black;
`

const MessageHeader = styled.div`
	color: black;
	font-weight: bold;
	margin-top: 2px;
`

interface Props {
	name: string
	isConsecutive?: boolean
}

const Message: FunctionComponent<Props> = ({
	children,
	name,
	isConsecutive,
}) => {
	if (isConsecutive) {
		return (
			<MessageLayout>
				<LeftPanel />
				<RightPanel>{children}</RightPanel>
			</MessageLayout>
		)
	}

	return (
		<MessageLayout>
			<LeftPanel>
				<Avatar size={35} shape="square" icon="user" />
			</LeftPanel>
			<RightPanel>
				<MessageHeader>{name}</MessageHeader>
				{children}
			</RightPanel>
		</MessageLayout>
	)
}

export default Message
