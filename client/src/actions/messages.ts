import { functions } from '../firebase/firebase'

// get function handler
const sendMessage = functions.httpsCallable('sendMessage')
export const trySendMessage = (
	text: string,
	roomId: string,
	status: boolean = false,
) => {
	return (_: any, getState: any) => {
		const user = getState().auth
		if (user) {
			const message = {
				text,
				roomId,
			}
			return sendMessage(message)
		}
	}
}
