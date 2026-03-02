import { Suspense } from 'react'
import SidebarUser from './SidebarUser'
import { getUser } from '@/server/actions/usersActions'

export async function AsyncSidebarUser() {
	const user = await getUser()

	return <SidebarUser user={user} />
}
