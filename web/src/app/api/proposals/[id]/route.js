import dbConnect from '../../../../lib/db';
import Proposal from '../../../../models/Proposal';

export async function PATCH(request, { params }) {
    await dbConnect();
    const { id } = await params;

    try {
        const body = await request.json();
        const { status, department, remarks } = body;

        let updateData = {};

        if (department) {
            // Department-specific update
            updateData[`departmentApprovals.${department}.status`] = status;
            if (remarks) {
                updateData[`departmentApprovals.${department}.remarks`] = remarks;
            }
        } else {
            // Global/Super Admin update (Final Status)
            updateData['status'] = status;
        }

        const proposal = await Proposal.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true }
        );

        if (!proposal) {
            return Response.json({ success: false, error: "Proposal not found" }, { status: 404 });
        }

        return Response.json({ success: true, data: proposal });
    } catch (error) {
        return Response.json({ success: false, error: error.message }, { status: 500 });
    }
}
