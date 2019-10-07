type Optional<T> = T | undefined

interface Room {
	id?: string
	people: any
	name?: string
	roomName: string
	displayName?: string
	messages: any[]
	unread?: any
}

interface Person {
	id: string
	name: string
	lastRead: number
	unread: number
	displayName?: string
}

interface Messages {
	[key: string]: Message
}

interface Message {
	id: string
	createdAt: Date
	sender: Auth
	status: boolean
	text: string
}

interface Auth {
	uid?: string
	displayName?: string
	photoURL?: string | null
	email?: string
}

interface User {
	id?: string
	name?: string
	photoURL?: string | null
	status?: string
}

interface RoomItem {
	id: string
	name: string
	avatarUrl?: string
	people: Person[]
	messages: Message[]
	canFetchMore: boolean
	isFetchingMore: boolean
}

interface Rooms {
	active: { [key: string]: RoomItem }
	available: { [key: string]: RoomItem }
}

interface Users {
	[key: string]: User
}

interface StoreState {
	auth: Auth
	rooms: Rooms,
	users: Users
}
