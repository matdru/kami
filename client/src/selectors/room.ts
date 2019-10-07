import { createSelector } from 'reselect'
import { byCreatedAt } from '../utils/misc'

import { SelectorProps } from '../containers/Room'

const getAuth = (state: StoreState) => state.auth

const getRoom = (state: StoreState, ownProps: any) => {
	const { roomId } = ownProps.match.params
	return state.rooms.active[roomId]
}

const getRoomMessages = (state: StoreState, ownProps: any) => {
	const { roomId } = ownProps.match.params
	const room = state.rooms.active[roomId]
	const messages = room ? Object.values(room.messages).sort(byCreatedAt) : []

	// TODO figure out memoization function

	// inject fresh user info to each message
	const roomMessages = messages.map(message => {
		if (message.sender.uid) {
			const user = state.users[message.sender.uid]
			// console.log({ message, user })
			return {
				...message,
				sender: {
					...message.sender,
					photoURL: user.photoURL || undefined,
					displayName: user.name || message.sender.displayName,
				},
			}
		} else {
			return message
		}
	})

	console.log({ roomMessages })
	return roomMessages
}

export const getEarliestMessageForRoomId = (roomId: string) => (
	state: StoreState,
) => {
	const room = state.rooms.active[roomId]
	const messages = Object.values(room.messages).sort(byCreatedAt)
	return messages[0] || null
}

const getProps = createSelector(
	getRoom,
	getRoomMessages,
	getAuth,
	(room, messages, auth): SelectorProps => {
		return {
			auth,
			room,
			messages,
			isLoading: !room,
		}
	},
)

export default getProps
