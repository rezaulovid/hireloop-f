import { getUsers } from '@/lib/users';
import React from 'react';

const AdminUsersPage =async () => {
    const users = await getUsers();
    console.log(users);
    return (
        <div>
            
        </div>
    );
};

export default AdminUsersPage;