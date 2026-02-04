import dbConnect from '../../../lib/db';
import User from '../../../models/User';

export async function POST(request) {
    await dbConnect();

    try {
        const { username, password } = await request.json();
        const lowerUser = username.toLowerCase();

        // Domain to Role Mapping
        const DOMAIN_ROLES = {
            'localbody.com': 'local_body',
            'dtcp.com': 'dtcp',
            'revenue.com': 'revenue',
            'forest.com': 'forest',
            'fire.com': 'fire',
            'pwd.com': 'pwd',
            'horticulture.com': 'horticulture',
            'haca.com': 'haca',
            'tnpcb.com': 'tnpcb',
            'admin.com': 'super_admin'
        };

        const parts = lowerUser.split('@');
        const domain = parts.length > 1 ? parts[1] : '';
        const roleFromDomain = DOMAIN_ROLES[domain];

        if (roleFromDomain) {
            let user = await User.findOne({ username: lowerUser });

            if (!user) {
                user = await User.create({
                    username: lowerUser,
                    password: password,
                    role: roleFromDomain,
                    department: roleFromDomain === 'super_admin' ? null : roleFromDomain
                });
            } else {
                if (user.password !== password) {
                    return Response.json({ success: false, error: 'Invalid admin credentials' }, { status: 401 });
                }
            }

            return Response.json({
                success: true,
                user: { username: user.username, role: user.role, department: user.department }
            });
        }

        if (!domain) {
            const reservedUsers = Object.values(DOMAIN_ROLES);
            if (reservedUsers.includes(lowerUser) || lowerUser === 'admin') {
                const user = await User.findOne({ username: lowerUser, password });
                if (user) {
                    return Response.json({
                        success: true,
                        user: { username: user.username, role: user.role, department: user.department }
                    });
                }
            }
        }

        let user = await User.findOne({ username: lowerUser });

        if (!user) {
            user = await User.create({
                username: lowerUser,
                password,
                role: 'user'
            });
        }

        return Response.json({
            success: true,
            user: { username: user.username, role: user.role, department: user.department }
        });

    } catch (error) {
        return Response.json({ success: false, error: error.message }, { status: 500 });
    }
}
