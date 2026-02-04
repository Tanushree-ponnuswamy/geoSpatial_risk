import dbConnect from '../../../lib/db';
import User from '../../../models/User';

export const dynamic = 'force-dynamic';

export async function GET() {
    await dbConnect();

    const users = [
        { username: 'user', password: 'password', role: 'user' },
        { username: 'admin', password: 'password', role: 'super_admin' },
        { username: 'revenue', password: 'password', role: 'revenue', department: 'revenue' },
        { username: 'forest', password: 'password', role: 'forest', department: 'forest' },
        { username: 'fire', password: 'password', role: 'fire', department: 'fire' },
        { username: 'pwd', password: 'password', role: 'pwd', department: 'pwd' },
        { username: 'local_body', password: 'password', role: 'local_body', department: 'local_body' },
        { username: 'dtcp', password: 'password', role: 'dtcp', department: 'dtcp' },
        { username: 'horticulture', password: 'password', role: 'horticulture', department: 'horticulture' },
        { username: 'haca', password: 'password', role: 'haca', department: 'haca' },
        { username: 'tnpcb', password: 'password', role: 'tnpcb', department: 'tnpcb' },
    ];

    let created = [];
    for (const u of users) {
        const found = await User.findOne({ username: u.username });
        if (!found) {
            await User.create(u);
            created.push(u.username);
        }
    }

    return Response.json({ success: true, created });
}
