import { promises as fs } from 'fs';
import path from 'path';

export async function PUT(request) {
    const { id, status, riskScore } = await request.json();
    const dataPath = path.join(process.cwd(), '../data/proposals.json');

    try {
        const fileContent = await fs.readFile(dataPath, 'utf8');
        let proposals = JSON.parse(fileContent);

        // Find and update
        const index = proposals.findIndex(p => p.id === id);
        if (index === -1) {
            return Response.json({ success: false, error: 'Not Found' }, { status: 404 });
        }

        proposals[index].status = status;
        proposals[index].riskScore = riskScore; // Save the calculated score

        // Write back
        await fs.writeFile(dataPath, JSON.stringify(proposals, null, 2));

        return Response.json({ success: true });
    } catch (error) {
        return Response.json({ success: false, error: error.message }, { status: 500 });
    }
}
