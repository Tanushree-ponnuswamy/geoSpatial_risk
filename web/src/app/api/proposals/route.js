import dbConnect from '../../../lib/db';
import Proposal from '../../../models/Proposal';

export const dynamic = 'force-dynamic';

export async function GET() {
    await dbConnect();

    try {
        const proposals = await Proposal.find({}).sort({ submittedAt: -1 });
        return Response.json({ success: true, data: proposals });
    } catch (error) {
        return Response.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    await dbConnect();

    try {
        const body = await request.json();

        // Generate custom ID
        const customId = `NIL-2026-${Math.floor(1000 + Math.random() * 9000)}`;

        const proposal = await Proposal.create({
            ...body,
            id: customId,
            status: 'Assessment Pending',
            riskScore: null,
        });

        return Response.json({ success: true, id: proposal.id });
    } catch (error) {
        return Response.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function OPTIONS() {
    return Response.json({}, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}
