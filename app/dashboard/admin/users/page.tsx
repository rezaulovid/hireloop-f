import { getUsers } from '@/lib/users';
import { PageContainer } from '@/components/dashboard/page-shell'
import { UserManagementBoard } from './_components/user-management-board'

const AdminUsersPage = async () => {
    const { users, total } = await getUsers()

    return (
        <PageContainer width="wide">
            <UserManagementBoard users={users} total={total} />
        </PageContainer>
    )
}

export default AdminUsersPage