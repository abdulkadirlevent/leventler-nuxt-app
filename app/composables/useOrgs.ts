import type {FormSubmitEvent} from '@nuxt/ui'
import type {CreateTeamSchema} from "~/types";

export function useOrgs() {
    const {user} = useAuth()
    const toast = useToast()
    const activeOrganizationId = useCookie('activeOrganizationId')
    const isLoading = useState('orgs-loading', () => false)

    async function createTeam(event: FormSubmitEvent<CreateTeamSchema>, options: { showToast?: boolean } = {}) {

        const teamEvent = {
            name: event.data.name,
            slug: event.data.slug,
        }
        console.log(teamEvent)

        if (options.showToast) {
            toast.add({
                description: `${teamEvent.name} ${teamEvent.slug}`,
                title: 'Team created successfully',
                color: 'error'
            })
        }
    }

    return {
        createTeam,
    }
}