import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { signOut } from './authClient'

export const useSignOut = () => {
	const router = useRouter()

	const handleSignOut = async () => {
		try {
			await signOut({
				fetchOptions: {
					onSuccess: () => {
						toast.success('Logout successfully!')
						router.refresh()
						router.push('/signin')
					},
				},
			})
		} catch (error) {
			console.error('Sign out error:', error)
			router.push('/')
		}
	}

	return { handleSignOut }
}
